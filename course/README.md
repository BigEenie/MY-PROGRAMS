# University of Ibadan Course Material Portal - 2025 Edition

## Overview

This is a complete University of Ibadan Course Material Management System built with Flask, HTML, CSS, and JavaScript. The system provides easy access to course materials across all 17 faculties and their respective departments.

## Features

- **Complete Faculty Structure**: All 17 UI faculties with accurate department listings
- **Course Material Access**: Direct links to Google Drive folders for each department and level
- **Developer Profile**: Integrated developer information section (editable in HTML)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Search Functionality**: Find faculties and departments quickly
- **Modern UI**: Beautiful, professional interface with animations

## Quick Start

1. **Install Python 3.11+** (if not already installed)
2. **Install Flask**: `pip install flask`
3. **Run the application**: `python app.py`
4. **Open your browser**: Visit `http://localhost:5000`

## Editing Your Developer Profile

To customize the developer profile section with your personal information:

### 1. Edit Your Personal Information

Open `templates/index.html` and find the developer profile section (around line 218). Edit these fields:

```html
<!-- EDIT YOUR PERSONAL INFORMATION HERE -->
<h3 class="profile-name">Your Full Name</h3>
<p class="profile-title">Your Department • University of Ibadan</p>
<p class="profile-level">Your Current Level (e.g., 300 Level)</p>
```

### 2. Add Your Profile Picture

In the same file, find the profile image section (around line 210):

```html
<!-- EDIT YOUR PROFILE PICTURE HERE -->
<!-- Uncomment and edit the line below to add your image: -->
<!-- <img src="images/your-photo.jpg" alt="Developer Photo" class="profile-img"> -->
```

To add your photo:
1. Place your image file in the `static/images/` folder
2. Uncomment the `<img>` tag above
3. Update the `src` attribute with your image filename

### 3. Update Your Bio

Find the profile description section (around line 238):

```html
<!-- EDIT YOUR BIO HERE -->
<p>
    I am a passionate student at the University of Ibadan, dedicated to making 
    academic resources more accessible to fellow students...
</p>
```

Replace this text with your own biography.

### 4. Add Your Contact Information

Update your contact links (around line 258):

```html
<!-- EDIT YOUR CONTACT INFORMATION HERE -->
<a href="mailto:your.email@example.com" class="contact-link">
    <i class="fas fa-envelope"></i>
    your.email@example.com
</a>
<a href="https://github.com/yourusername" class="contact-link" target="_blank">
    <i class="fab fa-github"></i>
    GitHub Profile
</a>
```

Replace the email addresses and URLs with your actual contact information.

## Adding Course Material Links

To add Google Drive links for course materials:

1. Open `data/materials.json`
2. Find the department you want to update
3. Replace `"INSERT_YOUR_GOOGLE_DRIVE_LINK_HERE"` with actual Google Drive folder links
4. Make sure the links are publicly accessible

Example:
```json
{
  "id": "100l",
  "name": "100 Level",
  "driveUrl": "https://drive.google.com/drive/folders/your-actual-folder-id"
}
```

## Project Structure

```
ui_project_2025/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── data/
│   ├── materials.json    # Faculty and department data
│   └── settings.json     # University settings
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   ├── config.js     # JavaScript configuration
│   │   └── main.js       # Main JavaScript functionality
│   └── images/           # Static images and logos
├── templates/
│   ├── index.html        # Main page template
│   └── 404.html          # Error page template
└── README.md             # This file
```

## Faculty Structure Included

All 17 University of Ibadan faculties are included:

1. Faculty of Arts
2. Faculty of Science
3. Faculty of Agriculture
4. Faculty of Social Sciences
5. Faculty of Education
6. Faculty of Veterinary Medicine
7. Faculty of Pharmacy
8. Faculty of Technology
9. Faculty of Law
10. Faculty of Public Health
11. Faculty of Dentistry
12. Faculty of Clinical Sciences
13. Faculty of Basic Medical Sciences
14. Faculty of Economics and Management Sciences
15. Faculty of Renewable Natural Resources
16. Faculty of Environmental Design and Management
17. Faculty of Multidisciplinary Studies

Each faculty contains its accurate department listings as provided by the University of Ibadan.

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Playfair Display)

## Customization

### Colors and Branding

To change the university colors, edit the CSS variables in `static/css/style.css`:

```css
:root {
    --primary-color: #1a365d;    /* Main UI blue */
    --secondary-color: #2d3748;  /* Secondary dark color */
    --accent-color: #d69e2e;     /* Accent gold/yellow */
}
```

### University Information

Update university details in `data/settings.json`:

```json
{
  "university_name": "University of Ibadan",
  "portal_title": "Course Materials Portal",
  "university_motto": "Premier University, First and the Best",
  "university_address": "Ibadan, Oyo State, Nigeria",
  "university_phone": "+234 (0) 2 810 1100",
  "university_email": "info@ui.edu.ng"
}
```

## Deployment

This application is ready for deployment on any platform that supports Python Flask applications:

- **Replit**: Upload the project and run
- **Heroku**: Add a `Procfile` with `web: python app.py`
- **Vercel**: Configure with Python runtime
- **Local Server**: Run `python app.py` for local development

## Support

For technical issues or customization help:
1. Check the code comments in HTML files for editing instructions
2. Review this README for common tasks
3. Ensure all file paths are correct when adding images or links

## License

This project is designed for educational use at the University of Ibadan. Customize and use as needed for academic purposes.

---

**Note**: Remember to replace all placeholder information with your actual details before deploying the application.