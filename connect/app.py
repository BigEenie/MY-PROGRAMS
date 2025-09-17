import os
import logging
from flask import Flask
from flask_socketio import SocketIO
from flask_login import LoginManager
from werkzeug.middleware.proxy_fix import ProxyFix

from models import db, get_user_by_id, User  # only now importing db

# Logging
logging.basicConfig(level=logging.DEBUG)

# App
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Config
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Extensions
db.init_app(app)

# Flask-Login
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))  # Updated to avoid importing get_user_by_id

# SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Create uploads directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Routes
from routes import *

# Run
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
