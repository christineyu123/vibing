from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from datetime import datetime
import json

# Do NOT import app here! Just create extension objects

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(10), nullable=False)  # 'coder' or 'expert'
    user_plan = db.Column(db.String(10), nullable=False, default='free')  # 'free' or 'pro'
    photo_choice = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    calendly = db.Column(db.String(255), nullable=True)
    tags = db.Column(db.Text, nullable=False)  # Comma-separated keywords
    free_offerings = db.Column(db.Text, nullable=True)  # JSON string of offerings
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self, viewer_plan=None):
        # Only show email/calendly if viewer is pro
        data = {
            'id': self.id,
            'username': self.username,
            'user_type': self.user_type,
            'user_plan': self.user_plan,
            'photo_choice': self.photo_choice,
            'description': self.description,
            'tags': self.tags.split(',') if self.tags else [],
            'free_offerings': json.loads(self.free_offerings) if self.free_offerings else [],
        }
        if viewer_plan == 'pro':
            data['email'] = self.email
            data['calendly'] = self.calendly
        else:
            data['email'] = None
            data['calendly'] = None
        return data 