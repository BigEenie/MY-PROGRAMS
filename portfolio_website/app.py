import os
import logging
from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
from flask_mail import Mail, Message

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key-here")

# Configure Flask-Mail
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', '587'))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your-email@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your-app-password')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'your-email@gmail.com')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        if not all([name, email, subject, message]):
            flash('All fields are required!', 'error')
            return redirect(url_for('index') + '#contact')
        
        # Create email message
        msg = Message(
            subject=f"Portfolio Contact: {subject}",
            recipients=[app.config['MAIL_DEFAULT_SENDER']],
            body=f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
            """,
            reply_to=email
        )
        
        mail.send(msg)
        flash('Thank you for your message! I\'ll get back to you soon.', 'success')
        
    except Exception as e:
        logging.error(f"Error sending email: {e}")
        flash('Sorry, there was an error sending your message. Please try again later.', 'error')
    
    return redirect(url_for('index') + '#contact')

@app.route('/resume')
def download_resume():
    try:
        return send_from_directory('static/resume', 'resume.pdf', as_attachment=True)
    except FileNotFoundError:
        flash('Resume not found. Please contact me directly.', 'error')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
