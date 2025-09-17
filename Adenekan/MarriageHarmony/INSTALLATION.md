# Installation Guide - Harmony Counseling Website

## Quick Start

1. **Extract Files**
   ```bash
   tar -xzf harmony-counseling-website.tar.gz
   cd harmony-counseling-website/
   ```

2. **Install Python Dependencies**
   ```bash
   pip install flask
   ```

3. **Run the Website**
   ```bash
   python run.py
   ```

4. **Open in Browser**
   Visit: http://localhost:5000

## Detailed Setup

### Prerequisites
- Python 3.11 or higher
- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor for customization (VS Code, Sublime Text)

### Step-by-Step Installation

#### 1. Extract the Archive
```bash
# Extract all files
tar -xzf harmony-counseling-website.tar.gz

# Navigate to the project directory
cd harmony-counseling-website/
```

#### 2. Install Dependencies
```bash
# Install Flask framework
pip install flask

# Optional: Create virtual environment (recommended)
python -m venv counseling_env
source counseling_env/bin/activate  # On Windows: counseling_env\Scripts\activate
pip install flask
```

#### 3. Initial Configuration

**Email Settings (Optional)**
Create a `.env` file or set environment variables:
```bash
export EMAIL_ADDRESS="your-email@gmail.com"
export EMAIL_PASSWORD="your-app-password"
```

**Database Initialization**
The database is automatically created on first run. No manual setup required.

#### 4. Run the Application
```bash
# Development mode
python run.py

# The server will start on http://localhost:5000
```

#### 5. Test the Website
- Open http://localhost:5000 in your browser
- Test the contact form
- Try the booking system
- Check the newsletter signup
- Download PDF resources

## File Permissions

Ensure the application has write permissions for:
- Database file creation (`counseling.db`)
- Log file creation (`server.log`)
- Static file serving

```bash
chmod +w .
chmod +r static/ -R
```

## Troubleshooting

### Common Issues

**1. "ModuleNotFoundError: No module named 'flask'"**
```bash
pip install flask
```

**2. "Permission denied" errors**
```bash
chmod +x run.py
chmod +w .
```

**3. "Port already in use"**
- Kill existing processes: `pkill -f python`
- Or change port in `run.py`: `port = 8000`

**4. Database errors**
- Delete `counseling.db` file and restart
- Check write permissions in directory

**5. Email not working**
- Set up environment variables for email
- Use app-specific passwords for Gmail
- Check SMTP settings in `app.py`

### Debug Mode

To run in debug mode for development:
```bash
# Edit run.py and change:
app.run(host='0.0.0.0', port=port, debug=True)
```

## Customization

### Update Counselor Information
Edit `index.html`:
- Search for "Dr. Sarah Johnson" and replace with your name
- Update qualifications and credentials
- Change phone number: "(555) 123-4567"
- Update email: "info@harmonycounseling.com"
- Change address: "123 Wellness Way, Suite 200"

### Modify Colors
Edit `static/css/style.css`:
```css
/* Primary colors */
--primary-blue: #4299e1;
--secondary-blue: #2c5282;
--accent-green: #68d391;
```

### Add Your Photos
Replace placeholder images in `index.html`:
- Counselor headshot
- Office photos
- Update image alt text

### Update Services & Pricing
Edit the Services section in `index.html`:
- Modify service descriptions
- Update pricing information
- Add or remove services

## Production Deployment

### For Live Website

1. **Use Production Server**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:80 app:app
```

2. **Set Up SSL Certificate**
- Use Let's Encrypt for free SSL
- Configure HTTPS redirect

3. **Database Backup**
```bash
# Regular backup of SQLite database
cp counseling.db backups/counseling_$(date +%Y%m%d).db
```

4. **Environment Variables**
Set production environment variables:
- `EMAIL_ADDRESS`
- `EMAIL_PASSWORD`
- `DATABASE_URL` (if using PostgreSQL)

### Hosting Options

**Replit (Recommended for Easy Deployment)**
- Upload files to Replit
- Configure run command: `python run.py`
- Enable always-on for 24/7 availability

**Other Hosting Platforms**
- Heroku: Add Procfile with `web: gunicorn app:app`
- PythonAnywhere: Configure WSGI file
- DigitalOcean: Use App Platform or Droplet
- AWS: Use Elastic Beanstalk or EC2

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong passwords for email accounts
- [ ] Regularly backup database
- [ ] Monitor form submissions for spam
- [ ] Keep Python and Flask updated
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection for forms
- [ ] Set up rate limiting for forms

## Performance Optimization

- [ ] Compress images before upload
- [ ] Enable gzip compression
- [ ] Use CDN for static files
- [ ] Optimize CSS and JavaScript
- [ ] Set up database indexing
- [ ] Monitor server performance

## Support

For technical questions:
1. Check this installation guide
2. Review the README.md file
3. Check Flask documentation: https://flask.palletsprojects.com/
4. Contact development team if needed

## Updates

To update the website:
1. Backup current files and database
2. Extract new version
3. Compare configuration files
4. Test thoroughly before going live
5. Update production deployment

---

**Need Help?** This website is fully functional and ready to use. Customize the content, add your photos, and update contact information to make it your own professional counseling website.