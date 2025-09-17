# Harmony Counseling Website

A complete marriage counselor website built with HTML, CSS, JavaScript, and Python Flask.

## Features

### Core Pages
- **Homepage** - Hero section with professional introduction and call-to-action
- **About** - Dr. Sarah Johnson's background, qualifications, and philosophy
- **Services** - 6 comprehensive counseling services with pricing
- **Contact** - Contact form, office information, and map integration
- **Booking** - Online appointment scheduling system
- **Testimonials** - Client reviews and success stories
- **Resources** - Blog articles and downloadable PDFs
- **FAQ** - Frequently asked questions with accordion interface
- **Newsletter** - Email subscription signup

### Design Features
- Calming color scheme (blues, greens, neutrals)
- Professional Inter typography
- Mobile-responsive design
- Smooth scrolling navigation
- Interactive elements and animations
- SEO optimized with meta tags

### Technical Features
- Working contact and booking forms
- Email notifications for submissions
- SQLite database for data storage
- Downloadable PDF resources
- Newsletter subscription management
- Admin dashboard for form submissions
- Health monitoring endpoints

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Flask (Python 3.11)
- **Database**: SQLite
- **Styling**: Custom CSS with responsive design
- **Email**: SMTP integration for notifications

## File Structure

```
/
├── index.html              # Main website HTML
├── app.py                  # Flask application with API endpoints
├── run.py                  # Production server runner
├── static/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   └── resources/          # Downloadable PDF files
├── replit.md              # Project documentation
└── README.md              # This file
```

## Installation & Setup

1. **Install Python 3.11+**
2. **Install dependencies:**
   ```bash
   pip install flask
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

4. **Visit the website:**
   Open http://localhost:5000 in your browser

## Configuration

### Email Setup
To enable email notifications, set these environment variables:
- `EMAIL_ADDRESS` - SMTP email address
- `EMAIL_PASSWORD` - SMTP password or app password

### Database
The application automatically creates a SQLite database (`counseling.db`) on first run with tables for:
- Contact form submissions
- Booking requests
- Newsletter subscriptions
- Blog posts (for future content management)

## API Endpoints

- `GET /` - Main website
- `POST /api/contact` - Contact form submission
- `POST /api/booking` - Booking form submission
- `POST /api/newsletter` - Newsletter subscription
- `GET /api/download/<resource>` - Resource downloads
- `GET /api/health` - Health check
- `GET /api/admin/submissions` - Admin dashboard (basic)
- `GET /sitemap.xml` - SEO sitemap
- `GET /robots.txt` - Search engine robots file

## Customization

### Colors
Main colors defined in `static/css/style.css`:
- Primary Blue: `#4299e1`
- Secondary Blue: `#2c5282`
- Green Accent: `#68d391`
- Text Gray: `#2c3e50`

### Content
- Update counselor information in `index.html`
- Modify services in the Services section
- Add/edit testimonials in the Testimonials section
- Update contact information throughout

### Images
Replace placeholder images with professional photos:
- Counselor headshot for About section
- Office photos for various sections
- Update image URLs in `index.html`

## Deployment

### Replit Deployment
The website is configured for Replit deployment with:
- Automatic Flask server startup
- Environment variable support
- Static file serving

### Production Deployment
For production deployment:
1. Use a production WSGI server (gunicorn, uWSGI)
2. Set up proper SSL certificates
3. Configure environment variables
4. Set up email service (SendGrid, Mailgun)
5. Use PostgreSQL for production database

## Features Implementation

### Forms
All forms include:
- Client-side validation
- Server-side processing
- Database storage
- Email notifications
- Error handling
- Success confirmations

### Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Responsive navigation
- Touch-friendly interactions
- Optimized images

### SEO Optimization
- Semantic HTML structure
- Meta description tags
- Open Graph tags for social sharing
- XML sitemap generation
- Robots.txt file
- Clean URL structure

## Support & Maintenance

### Database Maintenance
- Regular backup of SQLite database
- Monitor form submissions
- Clean up old newsletter subscriptions

### Content Updates
- Update blog posts in Resources section
- Add new testimonials regularly
- Keep service information current
- Update office hours and contact info

### Security
- Validate all form inputs
- Use HTTPS in production
- Regular security updates
- Monitor for spam submissions

## License

This website template is provided for educational and professional use. Customize as needed for your counseling practice.

## Contact

For technical support or customization requests, contact the development team.