from flask_sqlalchemy import SQLAlchemy
from app import app

db = SQLAlchemy(app)

def init_db():
    with app.app_context():
        db.create_all() 