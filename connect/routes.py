import os
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from flask_socketio import emit, join_room, leave_room
from werkzeug.utils import secure_filename
from PIL import Image
from app import app, socketio, db
from models import User, Post  # Use SQLAlchemy models only
from flask_login import login_required, login_user, logout_user, current_user
from utils import allowed_file, resize_image

UPLOAD_FOLDER = os.path.join('static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ---------- HOME ----------
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('feed'))
    return render_template('index.html')

# ---------- AUTH ----------
@app.route('/register', methods=['GET', 'POST'])
def register():
    from werkzeug.security import generate_password_hash
    if request.method == 'POST':
        username = request.form['username'].strip()
        email = request.form['email'].strip().lower()
        password = request.form['password']
        full_name = request.form['full_name'].strip()

        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            flash("User already exists", 'error')
            return redirect(url_for('register'))

        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            role='student',
            full_name=full_name
        )
        db.session.add(new_user)
        db.session.commit()
        flash('Registered successfully!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    from werkzeug.security import check_password_hash
    if request.method == 'POST':
        email = request.form['email'].strip().lower()
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('Welcome back!', 'success')
            return redirect(url_for('feed'))
        else:
            flash('Invalid credentials', 'error')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('index'))


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


# ---------- FEED ----------
@app.route('/feed')
@login_required
def feed():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return render_template('feed.html', posts=posts, user=current_user)

# ---------- CREATE POST ----------
@app.route('/create_post', methods=['GET', 'POST'])
@login_required
def create_post():
    if request.method == 'POST':
        content = request.form['content']
        image = request.files.get('image')
        image_filename = None

        if image and allowed_file(image.filename):
            filename = secure_filename(f"post_{current_user.id}_{image.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(filepath)
            resize_image(filepath, (800, 600))
            image_filename = filename

        post = Post(user_id=current_user.id, content=content, image=image_filename)
        db.session.add(post)
        db.session.commit()
        flash('Post created!', 'success')
        return redirect(url_for('feed'))

    return render_template('create_post.html')

# ---------- PROFILE ----------
@app.route('/profile/<username>')
@login_required
def profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        flash("User not found", 'error')
        return redirect(url_for('feed'))
    posts = Post.query.filter_by(user_id=user.id).order_by(Post.timestamp.desc()).all()
    return render_template('profile.html', user=user, posts=posts, is_own=current_user.id == user.id)

# ---------- WEBSOCKET EVENTS ----------
@socketio.on('connect')
def on_connect():
    if current_user.is_authenticated:
        join_room(f'user_{current_user.id}')
        print(f"User {current_user.id} connected")

@socketio.on('disconnect')
def on_disconnect():
    if current_user.is_authenticated:
        leave_room(f'user_{current_user.id}')
        print(f"User {current_user.id} disconnected")