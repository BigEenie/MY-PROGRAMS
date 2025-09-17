# University of Ibadan Course Materials Portal

## Overview

This is a Python Flask web application designed as a course materials portal for the University of Ibadan. The system provides a centralized platform for students to access study materials organized by faculties, departments, and academic levels. The application features an admin panel for content management and integrates with Google Drive for file storage and distribution.

## System Architecture

### Backend Architecture
- **Framework**: Python Flask with Gunicorn WSGI server
- **Authentication**: Session-based authentication using Werkzeug password hashing
- **Data Storage**: JSON file-based storage for simplicity and portability
- **Template Engine**: Jinja2 for dynamic HTML rendering
- **Deployment**: Configured for Replit with autoscale deployment target

### Frontend Architecture
- **Template System**: Server-side rendered HTML templates with Jinja2
- **Styling**: Custom CSS with CSS variables for theming
- **JavaScript**: Vanilla JavaScript with modular class-based architecture
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Icons**: Font Awesome for consistent iconography
- **Fonts**: Google Fonts (Inter and Playfair Display)

## Key Components

### Core Application Files
1. **app.py** - Main Flask application with routes, authentication, and business logic
2. **main.py** - Application entry point for production deployment
3. **templates/** - HTML templates for all pages (index, admin, login, etc.)
4. **static/** - Static assets including CSS, JavaScript, and images

### Data Management
- **data/materials.json** - Course materials structure with faculty/department hierarchy
- **data/settings.json** - University and portal configuration settings
- **data/access_log.json** - Access tracking for analytics (planned)

### Authentication System
- Session-based admin authentication
- Default credentials: admin/admin123 (must be changed in production)
- Password hashing using Werkzeug security utilities
- Protected admin routes with login requirements

### Admin Panel Features
- University settings management (name, colors, contact info)
- Course materials organization by faculty → department → level
- Google Drive link management for file distribution
- Responsive admin interface with modern UI components

## Data Flow

### Student Access Flow
1. Student visits portal homepage
2. Selects faculty from available options
3. Chooses department within selected faculty
4. Selects academic level (100L, 200L, etc.)
5. Gets redirected to corresponding Google Drive folder

### Admin Management Flow
1. Admin authenticates via login page
2. Accesses admin dashboard with management options
3. Updates university settings, colors, and branding
4. Manages course material structure and Google Drive links
5. Changes are saved to JSON files and immediately reflected

### Data Storage Structure
```
data/
├── materials.json (Faculty → Department → Level → Google Drive URLs)
├── settings.json (University info, colors, contact details)
└── access_log.json (User access tracking - planned feature)
```

## External Dependencies

### Python Packages
- **Flask** (3.1.1+) - Web framework
- **Flask-SQLAlchemy** (3.1.1+) - Database ORM (prepared for future database integration)
- **Werkzeug** (3.1.3+) - Security utilities and WSGI utilities
- **Gunicorn** (23.0.0+) - Production WSGI server
- **psycopg2-binary** (2.9.10+) - PostgreSQL adapter (prepared for future use)
- **email-validator** (2.2.0+) - Email validation utilities

### Frontend Dependencies (CDN)
- **Font Awesome** (6.4.0) - Icon library
- **Google Fonts** - Typography (Inter, Playfair Display)

### Third-Party Integrations
- **Google Drive** - File storage and distribution platform
- **Replit** - Hosting and deployment platform

## Deployment Strategy

### Replit Configuration
- **Runtime**: Python 3.11 with Nix package manager
- **Packages**: OpenSSL, PostgreSQL (prepared for future database integration)
- **Server**: Gunicorn with auto-reload for development
- **Deployment Target**: Autoscale for production scaling

### Production Considerations
1. **Security**: Change default admin credentials immediately
2. **Session Secret**: Replace default session secret key
3. **Database Migration**: Current JSON storage can be migrated to PostgreSQL
4. **SSL/TLS**: Enable HTTPS for production deployment
5. **Environment Variables**: Use environment variables for sensitive configuration

### Development Workflow
- Development server runs on port 5000 with auto-reload
- File-based data storage allows easy local development
- Admin panel provides immediate content management
- Responsive design works across all device types

## Changelog

- June 28, 2025. Complete faculty and department structure implementation with all 9 faculties and their respective departments, including proper level structure (100L-600L)
- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.