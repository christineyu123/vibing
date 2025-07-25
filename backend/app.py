from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from email_utils import send_email

from models import db, User, bcrypt, jwt  # Import extensions

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['username', 'email', 'password', 'user_type', 'user_plan', 'photo_choice', 'description', 'tags']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing field: {field}'}), 400
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Username or email already exists'}), 400
    user = User(
        username=data['username'],
        email=data['email'],
        user_type=data['user_type'],
        user_plan=data['user_plan'],
        photo_choice=data['photo_choice'],
        description=data['description'],
        tags=','.join(data['tags']),
        calendly=data.get('calendly'),
        free_offerings=json.dumps(data.get('free_offerings', []))
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token, 'user': user.to_dict(viewer_plan=user.user_plan)})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier')  # username or email
    password = data.get('password')
    if not identifier or not password:
        return jsonify({'error': 'Missing identifier or password'}), 400
    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token, 'user': user.to_dict(viewer_plan=user.user_plan)})

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict(viewer_plan=user.user_plan)})

@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.json
    for field in ['username', 'photo_choice', 'description', 'tags', 'calendly', 'free_offerings']:
        if field in data:
            if field == 'tags':
                setattr(user, field, ','.join(data[field]))
            elif field == 'free_offerings':
                setattr(user, field, json.dumps(data[field]))
            else:
                setattr(user, field, data[field])
    db.session.commit()
    return jsonify({'user': user.to_dict(viewer_plan=user.user_plan)})

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    viewer_id = get_jwt_identity()
    viewer = User.query.get(viewer_id)
    user_type = request.args.get('user_type')  # 'coder' or 'expert'
    tag = request.args.get('tag')
    query = User.query
    if user_type:
        query = query.filter_by(user_type=user_type)
    if tag:
        query = query.filter(User.tags.like(f'%{tag}%'))
    users = query.all()
    return jsonify({'users': [u.to_dict(viewer_plan=viewer.user_plan) for u in users]})

@app.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    viewer_id = get_jwt_identity()
    viewer = User.query.get(viewer_id)
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict(viewer_plan=viewer.user_plan)})

@app.route('/api/message/<int:user_id>', methods=['POST'])
@jwt_required()
def send_message(user_id):
    sender_id = get_jwt_identity()
    sender = User.query.get(sender_id)
    if sender.user_plan != 'pro':
        return jsonify({'error': 'Only pro users can send messages.'}), 403
    recipient = User.query.get(user_id)
    if not recipient:
        return jsonify({'error': 'Recipient not found'}), 404
    data = request.json
    subject = data.get('subject', 'Message from Vibing')
    body = data.get('body')
    if not body:
        return jsonify({'error': 'Message body required'}), 400
    success = send_email(recipient.email, subject, body)
    if success:
        return jsonify({'message': 'Email sent successfully'})
    else:
        return jsonify({'error': 'Failed to send email'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000) 