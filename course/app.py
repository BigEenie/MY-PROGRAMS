import os
import json
from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = 'university-of-ibadan-portal-2025'

# File paths
DATA_FILE = 'data/materials.json'
SETTINGS_FILE = 'data/settings.json'

def load_materials():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"faculties": []}

def load_settings():
    try:
        with open(SETTINGS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "university_name": "University of Ibadan",
            "portal_title": "Course Materials Portal",
            "university_motto": "Premier University, First and the Best",
            "primary_color": "#1a365d",
            "secondary_color": "#2d3748",
            "university_address": "Ibadan, Oyo State, Nigeria",
            "university_phone": "+234 (0) 2 810 1100",
            "university_email": "info@ui.edu.ng"
        }

@app.route('/')
def index():
    materials = load_materials()
    settings = load_settings()
    return render_template('index.html', materials=materials, settings=settings)

@app.route('/about')
def about():
    settings = load_settings()
    return render_template('about.html', settings=settings)



@app.route('/404')
def page_not_found():
    settings = load_settings()
    return render_template('404.html', settings=settings), 404

@app.errorhandler(404)
def not_found_error(error):
    return page_not_found()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)