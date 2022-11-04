from app import app, db
from app.models import User, Group, Membership, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request
from flask_cors import cross_origin
from sqlalchemy import desc

@app.route('/profile/update', methods=['PUT'])
@cross_origin()
@token_required
def update_profile(current_user):
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    avatar_url = request.json['avatar_url']

    if username != current_user.username:
        user_exist = User.query.filter_by(username=username).first()
        if user_exist:
            return {
                'success': False,
                'msg': 'This username already exists'
            }

    current_user.username = username
    current_user.email = email
    current_user.password_hash = generate_password_hash(password)
    current_user.avatar_url = avatar_url

    db.session.commit()

    return {
        'success':True
    }

@app.route('/friend/add', methods = ['PUT'])
@cross_origin()
@token_required
def friend_add(current_user):
    user_id = request.json['user_id']

    user = User.query.get(user_id)
    current_user.friends.append(user)

    db.session.commit()
    return {
        'success': True
    }

@app.route('/friend/remove', methods=['PUT'])
@cross_origin()
@token_required
def unfriend(current_user):
    user_id = request.json['user_id']
    
    friend = User.query.get(user_id)
    current_user.friends.remove(friend)

    db.session.commit()
    return {
        'success':True
    }

@app.route('/admin/make', methods = ['PUT'])
@cross_origin()
@token_required
def make_admin(current_user):
    group_id = request.json['group_id']
    user_id = request.json['user_id']

    mship = Membership.query.get((group_id, user_id))

    mship.admin = 1

    db.session.commit()
    return {
        'success': True
    }