# Portfolio Website

## Overview

This is a personal portfolio website built with Flask, designed to showcase a developer's skills, projects, and provide a contact form for potential clients or employers. The application features a responsive design with dark/light theme support and email functionality for contact form submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Flask
- **CSS Framework**: Bootstrap 5 with custom CSS for styling
- **JavaScript**: Vanilla JavaScript for interactivity (theme toggle, smooth scrolling, navigation highlighting)
- **Theme System**: Dark/light theme toggle with localStorage persistence
- **Responsive Design**: Mobile-first approach using Bootstrap's grid system

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Structure**: Simple single-file application with modular route handling
- **Configuration**: Environment variable-based configuration for email settings
- **Email Service**: Flask-Mail integration for contact form functionality

## Key Components

### Flask Application (`app.py`)
- Main application file containing route definitions and configuration
- Contact form processing with email sending capability
- Environment-based configuration for email settings
- Flash messaging for user feedback

### Frontend Components
- **Navigation**: Fixed navbar with smooth scrolling navigation and enhanced visibility
- **Contact Form**: HTML form with Flask backend processing
- **Responsive Layout**: Bootstrap-based responsive design with improved accessibility
- **Visual Effects**: Colorful gradients, animations, and glassmorphism effects

### Static Assets
- **CSS**: Custom styles in `static/css/style.css` with CSS variables for theming
- **JavaScript**: Interactive features in `static/js/script.js`
- **Styling**: Bootstrap CDN integration with Font Awesome icons

## Data Flow

### Contact Form Flow
1. User fills out contact form on frontend
2. Form data submitted via POST to `/contact` endpoint
3. Flask validates required fields
4. Email message constructed and sent via Flask-Mail
5. Success/error message flashed to user
6. User redirected back to contact section

### Visual Design
1. Fixed light theme with enhanced visibility and contrast
2. Vibrant gradient backgrounds and colorful elements
3. Glassmorphism effects with backdrop blur
4. Smooth animations and hover effects
5. Accessibility-focused design with improved readability

## External Dependencies

### CDN Resources
- **Bootstrap 5**: UI framework and styling
- **Font Awesome 6**: Icon library
- **Custom Bootstrap Theme**: Replit-specific dark theme variant

### Python Packages
- **Flask**: Web framework
- **Flask-Mail**: Email functionality

### Email Service
- **SMTP Configuration**: Gmail SMTP by default (configurable)
- **Environment Variables**: Email credentials and settings
- **TLS Security**: Secure email transmission

## Deployment Strategy

### Environment Configuration
- **Environment Variables**: All sensitive configuration (email credentials, secret keys)
- **Default Values**: Fallback values for development
- **Port Configuration**: Configurable port (default 5000)

### Development Setup
- **Debug Mode**: Enabled for development
- **Host Binding**: 0.0.0.0 for container compatibility
- **Logging**: Debug-level logging enabled

### Production Considerations
- Environment variables must be properly configured
- Secret key should be properly randomized
- Email service credentials required for contact form functionality
- Static file serving handled by Flask (suitable for small-scale deployment)

### File Structure
```
/
├── app.py              # Main Flask application
├── main.py             # Application entry point
├── templates/
│   └── index.html      # Main template file
└── static/
    ├── css/
    │   └── style.css   # Custom styles
    └── js/
        └── script.js   # Frontend JavaScript
```

The architecture prioritizes simplicity and maintainability, making it easy to customize content, styling, and functionality while providing a professional presentation layer for a developer portfolio.