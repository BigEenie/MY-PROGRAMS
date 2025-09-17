from flask import Flask, render_template, request, redirect, url_for, session
import json, os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'secret_key'
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def load_users():
    if not os.path.exists('users.json'):
        return {}
    with open('users.json', 'r') as f:
        return json.load(f)

def save_users(users):
    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)

def load_messages():
    if not os.path.exists('messages.json'):
        return {}
    with open('messages.json', 'r') as f:
        return json.load(f)

def save_messages(messages):
    with open('messages.json', 'w') as f:
        json.dump(messages, f, indent=4)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        users = load_users()
        username = request.form['username']
        if username in users:
            return "Username already exists"
        users[username] = {
            "password": request.form['password'],
            "name": request.form['name'],
            "course": request.form['course'],
            "year": request.form['year'],
            "bio": "",
            "education": "",
            "employment": "",
            "posts": [],
            "image": ""
        }
        save_users(users)
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        users = load_users()
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username]['password'] == password:
            session['username'] = username
            return redirect(url_for('dashboard'))
        return "Invalid credentials"
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    users = load_users()
    user = users[session['username']]
    return render_template('dashboard.html', user=user)

@app.route('/profile')
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    users = load_users()
    user = users[session['username']]
    return render_template('profile.html', user=user)

@app.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    users = load_users()
    user = users[session['username']]
    if request.method == 'POST':
        user['bio'] = request.form['bio']
        user['education'] = request.form['education']
        user['employment'] = request.form['employment']
        if 'image' in request.files:
            image = request.files['image']
            if image.filename:
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                user['image'] = filename
        users[session['username']] = user
        save_users(users)
        return redirect(url_for('profile'))
    return render_template('edit_profile.html', user=user)

@app.route('/directory')
def directory():
    if 'username' not in session:
        return redirect(url_for('login'))
    users = load_users()
    return render_template('directory.html', users=users)

@app.route('/message/<recipient>', methods=['GET', 'POST'])
def message_user(recipient):
    if 'username' not in session:
        return redirect(url_for('login'))
    sender = session['username']
    messages = load_messages()
    if request.method == 'POST':
        text = request.form['text']
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
        messages.setdefault(sender, {}).setdefault(recipient, []).append({
            'from': sender, 'to': recipient, 'text': text, 'timestamp': timestamp
        })
        messages.setdefault(recipient, {}).setdefault(sender, []).append({
            'from': sender, 'to': recipient, 'text': text, 'timestamp': timestamp
        })
        save_messages(messages)
        return redirect(url_for('message_user', recipient=recipient))
    chat = messages.get(sender, {}).get(recipient, [])
    return render_template('message.html', recipient=recipient, chat=chat)

if __name__ == '__main__':
    app.run(debug=True)