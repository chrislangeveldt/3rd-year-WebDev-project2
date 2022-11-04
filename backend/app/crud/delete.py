from app import app, db
from app.models import User, Group, Membership, Post, Comment, token_required
from app.models import user_schema, users_schema, post_schema, group_schema, groups_schema, posts_schema, comment_schema, comments_schema

from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify, request
from flask_cors import cross_origin
from sqlalchemy import desc

@app.route('/profile/delete', methods=['DELETE'])  # not tested
@cross_origin()
@token_required
def delete_profile(current_user):
    mships = Membership.query.filter_by(user_id=current_user.id).filter_by(admin=True)
    group_ids = [m.group_id for m in mships]
    groups = Group.query.filter(Group.id.in_(group_ids))

    db.session.delete(current_user)

    for group in groups:
        m = Membership.query.filter_by(group_id=group.id).first()
        if not m:
            db.session.delete(group)
        else:
            m = Membership.query.filter_by(group_id=group.id).filter_by(admin=True).first()
            if not m:
                Membership.query.filter_by(group_id=group.id).first().admin = True

    db.session.commit()
    return {
        'success':True
    }

@app.route('/group/delete', methods=['DELETE']) # not tested yet
@cross_origin()
@token_required
def delete_group(current_user):
    group_name = request.json['group_name']

    group = Group.query.filter_by(name=group_name).first()

    if not group:
        return {
            'success':False,
            'msg':'Group does not exist'
        }
 
    membership = Membership.query.get((group.id, current_user.id))
    if not membership:
        return {
            'success':False,
            'msg':'Not in this group'
        }

    if not membership.admin:
        return {
            'success':False,
            'msg':'Not an admin of this group'
        }

    db.session.delete(group)
    db.session.commit()

    return {
        'success':True
    }

@app.route('/group/leave', methods=['DELETE'])
@cross_origin()
@token_required
def leave_group(current_user):
    name = request.json['name']

    group = Group.query.filter_by(name=name).first()

    mship = Membership.query.get((group.id, current_user.id))

    db.session.delete(mship)

    m = Membership.query.filter_by(group_id=group.id).first()
    if not m:
        db.session.delete(group)
    else:
        m = Membership.query.filter_by(group_id=group.id).filter_by(admin=True).first()
        if not m:
            Membership.query.filter_by(group_id=group.id).first().admin = True

    db.session.commit()
    return {
        'success':True
    }