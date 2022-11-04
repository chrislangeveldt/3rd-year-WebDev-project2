from flask import request, jsonify
from datetime import datetime, timedelta
from functools import wraps
import jwt
from haversine import haversine

from app import db, ma, app

from sqlalchemy.ext.associationproxy import association_proxy

###################
#    Tables
################### 
hashtag_post = db.Table('hashtag_post',
    db.Column('hashtag_id', db.Integer, db.ForeignKey('hashtag.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'))
)

user_friend = db.Table('user_friend',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('friend_id', db.Integer, db.ForeignKey('user.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    email = db.Column(db.String(32))
    password_hash = db.Column(db.String(128))
    avatar_url = db.Column(db.String(2048))

    posts = db.relationship('Post', backref='user', cascade='all, delete, delete-orphan')
    comments = db.relationship('Comment', backref='user', cascade='all, delete, delete-orphan')
    
    memberships = db.relationship('Membership', backref='user', cascade='all, delete')
    groups = association_proxy("memberships", "group")

    friends = db.relationship('User', secondary=user_friend, primaryjoin=user_friend.c.user_id==id, secondaryjoin=user_friend.c.friend_id==id)

    def distance_to_post(post, lat, lng):
        loc1 = (float(lat), float(lng))
        lat = float(post.latitude)
        lng = float(post.longitude)

        loc2 = (lat, lng)

        return haversine(loc1, loc2)

    def __init__(self, username, email, avatar_url, password_hash):
        self.username = username
        self.email = email
        self.avatar_url = avatar_url
        self.password_hash = password_hash


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))

    posts = db.relationship('Post', backref='group', cascade='all, delete, delete-orphan')
    memberships = db.relationship('Membership', backref='group', cascade='all, delete')
    users = association_proxy("memberships", "user")

    def __init__(self, name):
        self.name = name
 

class Membership(db.Model):
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    admin = db.Column(db.Boolean)

#   group
#   user  

    def __init__(self, group_id, user_id, admin):
        self.group_id = group_id
        self.user_id = user_id
        self.admin = admin


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    video_url = db.Column(db.String(2048))
    date = db.Column(db.DateTime, default=datetime.now)
    longitude = db.Column(db.String(10))
    latitude = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    hashtags_text = db.Column(db.Text)
    
    hashtags = db.relationship('Hashtag', secondary=hashtag_post, backref='posts')
    comments = db.relationship('Comment', backref='post', cascade='all, delete, delete-orphan')
#   user
#   group


    def __init__(self, text, video_url, longitude, latitude, hashtags_text):
        self.text = text
        self.video_url = video_url
        self.longitude = longitude
        self.latitude = latitude  
        self.hashtags_text = hashtags_text


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.now)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#   post
#   user 

    def __init__(self, text):
        self.text = text

class Hashtag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(32))

#   posts

    def __init__(self, tag):
        self.tag = tag


###################
#   Schemas
###################

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email', 'avatar_url')
user_schema = UserSchema()
users_schema = UserSchema(many=True)

class GroupSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')
group_schema = GroupSchema()
groups_schema = GroupSchema(many=True)

class MembershipSchema(ma.Schema):
    class Meta:
        fields = ('id', 'group.name', 'user.username', 'admin')
membership_schema = GroupSchema()
memberships_schema = GroupSchema(many=True)

class PostSchema(ma.Schema):
    class Meta:
        fields = ('id', 'text','video_url', 'date', 'longitude', 'latitude', 'user.username', 'group.name', 'hashtags_text')
post_schema = PostSchema()
posts_schema = PostSchema(many=True)

class CommentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'text', 'date', 'user.username')
comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)


###################
#  Authentication
###################
class JWTTokenBlocklist(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    jwt_token = db.Column(db.Text, nullable=False)

    def __init__(self, jwt_token):
        self.jwt_token = jwt_token

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'access-token' in request.headers:
            token = request.headers['access-token']
 
        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            token_expired = JWTTokenBlocklist.query.filter_by(jwt_token=token).first()
            if token_expired is not None:
                db.session.delete(token_expired)
                db.session.commit()
            return jsonify({
                'timeout':"true",
                'message': 'token is invalid'})

        token_expired = JWTTokenBlocklist.query.filter_by(jwt_token=token).first()
        if token_expired is not None:
            return jsonify({
                'timeout':"true",
                'message': 'token is invalid'})
 
        return f(current_user, *args, **kwargs)
    return decorator

db.create_all()
db.session.commit()