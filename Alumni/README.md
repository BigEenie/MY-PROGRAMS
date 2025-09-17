# Alumni Directory Web Application

A web application built with Flask that allows students to browse and connect with alumni profiles.

## Project Structure

### Python Files (Backend)
- `app.py` - Flask application setup and database configuration
- `main.py` - Application entry point
- `models.py` - Database models for alumni profiles
- `routes.py` - Web routes and API endpoints
- `pyproject.toml` - Python dependencies

### HTML Files (Frontend Templates)
- `base.html` - Base template with navigation and layout
- `index.html` - Homepage with alumni directory and search
- `profile.html` - Individual alumni profile page
- `add_alumni.html` - Form to add new alumni profiles

### CSS Files (Styling)
- `style.css` - Custom styles and responsive design

### JavaScript Files (Frontend Logic)
- `main.js` - Interactive features, form validation, and animations

## Features

- Browse alumni profiles with filtering and search
- View detailed alumni profiles with contact information
- Add new alumni profiles through a form
- Responsive design with Bootstrap dark theme
- Real-time form validation
- Search functionality by name, company, and position
- Filter by graduation year, field of study, and location

## Installation

1. Install Python dependencies: `pip install -r requirements.txt`
2. Set up PostgreSQL database
3. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Flask session secret key
4. Run the application: `python main.py`

## Technologies Used

- Backend: Python, Flask, SQLAlchemy, PostgreSQL
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- UI Framework: Bootstrap 5 with Replit dark theme
- Icons: Feather Icons
- Database: PostgreSQL