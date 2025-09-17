from flask import Flask, request, jsonify, render_template, send_from_directory, abort
import json
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Database initialization
def init_db():
    """Initialize SQLite database for storing form submissions."""
    conn = sqlite3.connect('counseling.db')
    cursor = conn.cursor()
    
    # Contact form submissions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            service TEXT,
            message TEXT NOT NULL,
            newsletter BOOLEAN DEFAULT FALSE,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Booking submissions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS booking_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            format TEXT NOT NULL,
            preferred_date TEXT,
            preferred_time TEXT,
            message TEXT,
            consultation BOOLEAN DEFAULT FALSE,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Newsletter subscriptions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    # Blog posts (for future content management)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            image_url TEXT,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection."""
    conn = sqlite3.connect('counseling.db')
    conn.row_factory = sqlite3.Row
    return conn

# Email configuration (would use environment variables in production)
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': os.environ.get('EMAIL_ADDRESS', 'info@harmonycounseling.com'),
    'password': os.environ.get('EMAIL_PASSWORD', 'your_app_password'),
    'admin_email': 'admin@harmonycounseling.com'
}

def send_email(to_email, subject, body, is_html=False):
    """Send email notification."""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['email']
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html' if is_html else 'plain'))
        
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
        text = msg.as_string()
        server.sendmail(EMAIL_CONFIG['email'], to_email, text)
        server.quit()
        
        return True
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        return False

@app.route('/')
def index():
    """Serve the main website."""
    return send_from_directory('.', 'index.html')

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contact_submissions 
            (name, email, phone, service, message, newsletter)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['email'],
            data.get('phone', ''),
            data.get('service', ''),
            data['message'],
            data.get('newsletter', False)
        ))
        
        conn.commit()
        conn.close()
        
        # Send notification email to admin
        admin_subject = f"New Contact Form Submission from {data['name']}"
        admin_body = f"""
        New contact form submission:
        
        Name: {data['name']}
        Email: {data['email']}
        Phone: {data.get('phone', 'Not provided')}
        Service Interest: {data.get('service', 'Not specified')}
        Newsletter Signup: {'Yes' if data.get('newsletter') else 'No'}
        
        Message:
        {data['message']}
        
        Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        send_email(EMAIL_CONFIG['admin_email'], admin_subject, admin_body)
        
        # Send confirmation email to user
        user_subject = "Thank you for contacting Harmony Counseling"
        user_body = f"""
        Dear {data['name']},
        
        Thank you for reaching out to Harmony Counseling. We have received your message and will get back to you within 24 hours.
        
        If you have any urgent concerns, please don't hesitate to call us at (555) 123-4567.
        
        Best regards,
        The Harmony Counseling Team
        """
        
        send_email(data['email'], user_subject, user_body)
        
        return jsonify({'success': True, 'message': 'Contact form submitted successfully'})
        
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/booking', methods=['POST'])
def handle_booking():
    """Handle booking form submissions."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'service', 'format']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO booking_submissions 
            (name, email, phone, service, format, preferred_date, preferred_time, message, consultation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['email'],
            data['phone'],
            data['service'],
            data['format'],
            data.get('date', ''),
            data.get('time', ''),
            data.get('message', ''),
            data.get('consultation', False)
        ))
        
        conn.commit()
        conn.close()
        
        # Send notification email to admin
        admin_subject = f"New Appointment Request from {data['name']}"
        admin_body = f"""
        New appointment request:
        
        Name: {data['name']}
        Email: {data['email']}
        Phone: {data['phone']}
        Service: {data['service']}
        Format: {data['format']}
        Preferred Date: {data.get('date', 'Not specified')}
        Preferred Time: {data.get('time', 'Not specified')}
        Free Consultation: {'Yes' if data.get('consultation') else 'No'}
        
        Additional Information:
        {data.get('message', 'None provided')}
        
        Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        send_email(EMAIL_CONFIG['admin_email'], admin_subject, admin_body)
        
        # Send confirmation email to user
        user_subject = "Appointment Request Received - Harmony Counseling"
        user_body = f"""
        Dear {data['name']},
        
        Thank you for your appointment request. We have received your information and will contact you within 24 hours to confirm your session details.
        
        Your Request Details:
        - Service: {data['service']}
        - Format: {data['format']}
        - Preferred Date: {data.get('date', 'Not specified')}
        - Preferred Time: {data.get('time', 'Not specified')}
        
        {"You've also requested a free 15-minute consultation, which we'll discuss when we contact you." if data.get('consultation') else ""}
        
        If you have any immediate questions, please call us at (555) 123-4567.
        
        Best regards,
        Dr. Sarah Johnson & The Harmony Counseling Team
        """
        
        send_email(data['email'], user_subject, user_body)
        
        return jsonify({'success': True, 'message': 'Booking request submitted successfully'})
        
    except Exception as e:
        logger.error(f"Booking form error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/newsletter', methods=['POST'])
def handle_newsletter():
    """Handle newsletter subscriptions."""
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO newsletter_subscriptions (email)
                VALUES (?)
            ''', (data['email'],))
            
            conn.commit()
            
            # Send welcome email
            subject = "Welcome to Harmony Counseling Newsletter"
            body = f"""
            Welcome to our community!
            
            Thank you for subscribing to the Harmony Counseling newsletter. You'll receive monthly updates with:
            
            - Relationship tips and advice
            - Communication strategies
            - Resources for stronger relationships
            - Updates about our services
            
            We're committed to helping you build healthier, happier relationships.
            
            Best regards,
            The Harmony Counseling Team
            
            If you ever wish to unsubscribe, simply reply to any newsletter email with "UNSUBSCRIBE".
            """
            
            send_email(data['email'], subject, body)
            
        except sqlite3.IntegrityError:
            # Email already exists
            return jsonify({'success': True, 'message': 'You are already subscribed to our newsletter'})
        
        finally:
            conn.close()
        
        return jsonify({'success': True, 'message': 'Successfully subscribed to newsletter'})
        
    except Exception as e:
        logger.error(f"Newsletter subscription error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/download/<resource>')
def handle_download(resource):
    """Handle resource downloads."""
    try:
        # Validate resource
        valid_resources = ['questionnaire', 'checklist', 'questions']
        if resource not in valid_resources:
            return jsonify({'error': 'Invalid resource'}), 404
        
        # In a real application, you would serve actual PDF files
        # For now, we'll just return a success response
        
        # Log the download
        logger.info(f"Resource downloaded: {resource}")
        
        return jsonify({'success': True, 'message': f'Resource {resource} available for download'})
        
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/admin/submissions')
def admin_submissions():
    """Admin endpoint to view form submissions (basic implementation)."""
    try:
        conn = get_db_connection()
        
        # Get contact submissions
        contact_submissions = conn.execute('''
            SELECT * FROM contact_submissions 
            ORDER BY submitted_at DESC LIMIT 50
        ''').fetchall()
        
        # Get booking submissions
        booking_submissions = conn.execute('''
            SELECT * FROM booking_submissions 
            ORDER BY submitted_at DESC LIMIT 50
        ''').fetchall()
        
        # Get newsletter subscriptions
        newsletter_subs = conn.execute('''
            SELECT * FROM newsletter_subscriptions 
            WHERE active = TRUE
            ORDER BY subscribed_at DESC LIMIT 50
        ''').fetchall()
        
        conn.close()
        
        return jsonify({
            'contact_submissions': [dict(row) for row in contact_submissions],
            'booking_submissions': [dict(row) for row in booking_submissions],
            'newsletter_subscriptions': [dict(row) for row in newsletter_subs]
        })
        
    except Exception as e:
        logger.error(f"Admin endpoint error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

# SEO and Meta endpoints
@app.route('/sitemap.xml')
def sitemap():
    """Generate sitemap for SEO."""
    sitemap_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://harmonycounseling.com/</loc>
        <lastmod>{}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://harmonycounseling.com/#about</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://harmonycounseling.com/#services</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://harmonycounseling.com/#contact</loc>
        <lastmod>{}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>'''.format(
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d'),
        datetime.now().strftime('%Y-%m-%d')
    )
    
    response = app.response_class(
        response=sitemap_xml,
        status=200,
        mimetype='application/xml'
    )
    return response

@app.route('/robots.txt')
def robots():
    """Generate robots.txt for SEO."""
    robots_txt = '''User-agent: *
Allow: /
Disallow: /api/admin/

Sitemap: https://harmonycounseling.com/sitemap.xml'''
    
    response = app.response_class(
        response=robots_txt,
        status=200,
        mimetype='text/plain'
    )
    return response

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Create static directories if they don't exist
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/resources', exist_ok=True)
    
    # Run the application
    app.run(host='0.0.0.0', port=5000, debug=True)