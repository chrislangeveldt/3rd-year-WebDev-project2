from app import app, db
from app.models import User, Group, Membership, Post, Comment, Hashtag, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from flask import jsonify
from flask_cors import cross_origin
from sqlalchemy import desc, or_
from itertools import chain

@app.route('/profile/my', methods=['GET'])
@cross_origin()
@token_required
def myprofile(current_user):
    result =  user_schema.dump(current_user)
    return jsonify(result)

@app.route('/group=<group_id>', methods=['GET'])
@cross_origin()
@token_required
def getgroup(current_user, group_id):
    group = Group.query.get(group_id)
    mship = Membership.query.get((group_id, current_user.id))
    result = group_schema.dump(group)
    result = dict(chain.from_iterable([result.items(), {'admin':mship.admin}.items()]))
    return jsonify(result)

@app.route('/groups/not-my/group=<group_name>', methods=['GET'])
@cross_origin()
@token_required
def getallgroups(current_user, group_name): 
    my_group_ids = [group.id for group in current_user.groups]

    group_name += '%'

    groups = Group.query.filter(Group.id.not_in(my_group_ids), Group.name.like(group_name))
    
    results = groups_schema.dump(groups)
    return jsonify(results)

@app.route('/groups/my/group=<group_name>', methods=['GET'])
@cross_origin()
@token_required
def getmygroups(current_user, group_name):
    my_group_ids = [group.id for group in current_user.groups]

    group_name += '%'
    groups = Group.query.filter(Group.id.in_(my_group_ids), Group.name.like(group_name))

    groups = groups_schema.dump(groups)

    admin_to_group_ids = [mship.group_id for mship in Membership.query.filter_by(user_id=current_user.id).all() if mship.admin == 1]
    admin_to = [dict(chain.from_iterable([group.items(), {'admin':1}.items()])) for group in groups if group['id'] in admin_to_group_ids]
    others = [dict(chain.from_iterable([group.items(), {'admin':0}.items()])) for group in groups if not group['id'] in admin_to_group_ids]

    results = admin_to + others
    return jsonify(results)

@app.route('/feed/group=<group_name>&user=<username>&tag=<tag>&orderby=<orderby>&order=<order>&lat=<lat>&lng=<lng>&radius=<radius>', methods=['GET'])
@cross_origin()
@token_required
def feed(current_user, group_name, username, tag, orderby, order, lat, lng, radius):
    group_ids = [group.id for group in current_user.groups]
    user_ids = [user.id for user in current_user.friends]
    
    group_name += '%'
    username += '%'
    tag += '%'

    groups = Group.query.filter(Group.id.in_(group_ids), Group.name.like(group_name))

    flatList = [ item for elem in [group.users for group in groups] for item in elem]
    user_ids += [user.id for user in flatList]
    users = User.query.filter(User.id.in_(user_ids), User.username.like(username))

    hashtags = Hashtag.query.filter(Hashtag.tag.like(tag))
    post_ids_tag = []
    for hashtag in hashtags:
        post_ids_tag += [post.id for post in hashtag.posts]

    group_ids = [group.id for group in groups]
    user_ids = [friend.id for friend in users]

    if order == 'asc':
        posts = Post.query.filter(Post.group_id.in_(group_ids), Post.user_id.in_(user_ids), Post.id.in_(post_ids_tag)).order_by('date')
    else:
        posts = Post.query.filter(Post.group_id.in_(group_ids), Post.user_id.in_(user_ids), Post.id.in_(post_ids_tag)).order_by(desc('date'))

    if not radius == '%':
        posts = [post for post in posts if (post.latitude and post.longitude)]
        posts = [post for post in posts if User.distance_to_post(post, lat, lng) <= float(radius)]

    if orderby == 'location':
        posts = [post for post in posts if (post.latitude and post.longitude)]
        if order == 'asc': # furthest first 
            posts.sort(key=lambda post: User.distance_to_post(post, lat, lng), reverse=True)
        else:
            posts.sort(key=lambda post: User.distance_to_post(post, lat, lng))

    results = posts_schema.dump(posts)
    return jsonify(results)

@app.route('/feed/group=<group_id>', methods=['GET'])
@cross_origin()
@token_required
def getgroupfeed(current_user, group_id):
    posts = Post.query.filter_by(group_id=group_id).order_by(desc('date'))

    results = posts_schema.dump(posts)
    return jsonify(results)

@app.route('/get/post=<post_id>', methods=['GET'])
@cross_origin()
@token_required
def getpost(current_user, post_id):
    post = Post.query.get(post_id)

    result = post_schema.dump(post)
    return jsonify(result)


@app.route('/comments/post=<post_id>', methods=['GET'])
@cross_origin()
@token_required
def getcomments(current_user, post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(desc('date'))

    results = comments_schema.dump(comments)
    return jsonify(results)

@app.route('/users/group=<group_id>', methods=['GET'])
@cross_origin()
@token_required
def getgroupusers(current_user, group_id):
    group = Group.query.get(group_id)
    admin_ids = [mship.user_id for mship in Membership.query.filter_by(group_id=group_id).all() if mship.admin == 1]
    admins = [dict(chain.from_iterable([user.items(), {'admin':1}.items()])) for user in users_schema.dump(group.users) if user['id'] in admin_ids]
    others = [dict(chain.from_iterable([user.items(), {'admin':0}.items()])) for user in users_schema.dump(group.users) if not user['id'] in admin_ids]
    results = admins + others
    return jsonify(results)

@app.route('/friends/user=<username>', methods=['GET'])
@cross_origin()
@token_required
def friends(current_user, username):
    friend_ids = [friend.id for friend in current_user.friends]

    username += '%'
    users = User.query.filter(User.id.in_(friend_ids), User.username.like(username))

    results = users_schema.dump(users)
    return jsonify(results)

@app.route('/non-friends/user=<username>', methods=['GET'])
@cross_origin()
@token_required
def non_friends(current_user, username):
    excl_ids = [friend.id for friend in current_user.friends]
    excl_ids.append(current_user.id)

    username += '%'
    users = User.query.filter(User.id.not_in(excl_ids), User.username.like(username))
    
    results = users_schema.dump(users)
    return jsonify(results)

@app.route('/timeout', methods=['GET'])
@cross_origin()
@token_required
def timeout(current_user):
    return {
        "timeout":False
    }

