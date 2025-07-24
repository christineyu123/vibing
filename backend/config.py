import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'supersecretkey')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///vibing.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwtsecretkey')
    # For AWS RDS PostgreSQL (uncomment and set env vars to use)
    # SQLALCHEMY_DATABASE_URI = f"postgresql://{os.environ.get('RDS_USER')}:{os.environ.get('RDS_PASSWORD')}@{os.environ.get('RDS_HOST')}/{os.environ.get('RDS_DB')}" 