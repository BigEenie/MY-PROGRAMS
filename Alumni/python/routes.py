from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app, db
from models import Alumni
from sqlalchemy import or_, and_

@app.route('/')
def index():
    # Get query parameters for filtering
    search_query = request.args.get('search', '')
    graduation_year = request.args.get('graduation_year', '')
    field_of_study = request.args.get('field_of_study', '')
    location = request.args.get('location', '')
    page = request.args.get('page', 1, type=int)
    
    # Start with base query
    query = Alumni.query
    
    # Apply filters
    if search_query:
        query = query.filter(
            or_(
                Alumni.first_name.ilike(f'%{search_query}%'),
                Alumni.last_name.ilike(f'%{search_query}%'),
                Alumni.current_company.ilike(f'%{search_query}%'),
                Alumni.current_position.ilike(f'%{search_query}%')
            )
        )
    
    if graduation_year:
        query = query.filter(Alumni.graduation_year == graduation_year)
    
    if field_of_study:
        query = query.filter(Alumni.field_of_study.ilike(f'%{field_of_study}%'))
    
    if location:
        query = query.filter(Alumni.current_location.ilike(f'%{location}%'))
    
    # Order by graduation year (newest first) and paginate
    alumni_pagination = query.order_by(Alumni.graduation_year.desc()).paginate(
        page=page, per_page=12, error_out=False
    )
    
    # Get filter options for dropdowns
    graduation_years = db.session.query(Alumni.graduation_year).distinct().order_by(Alumni.graduation_year.desc()).all()
    graduation_years = [year[0] for year in graduation_years]
    
    fields_of_study = db.session.query(Alumni.field_of_study).distinct().order_by(Alumni.field_of_study).all()
    fields_of_study = [field[0] for field in fields_of_study if field[0]]
    
    locations = db.session.query(Alumni.current_location).distinct().order_by(Alumni.current_location).all()
    locations = [location[0] for location in locations if location[0]]
    
    return render_template('index.html', 
                         alumni_pagination=alumni_pagination,
                         graduation_years=graduation_years,
                         fields_of_study=fields_of_study,
                         locations=locations,
                         current_filters={
                             'search': search_query,
                             'graduation_year': graduation_year,
                             'field_of_study': field_of_study,
                             'location': location
                         })

@app.route('/profile/<int:alumni_id>')
def profile(alumni_id):
    alumni = Alumni.query.get_or_404(alumni_id)
    return render_template('profile.html', alumni=alumni)

@app.route('/add-alumni', methods=['GET', 'POST'])
def add_alumni():
    if request.method == 'POST':
        try:
            alumni = Alumni(
                first_name=request.form['first_name'],
                last_name=request.form['last_name'],
                email=request.form['email'],
                phone=request.form.get('phone'),
                graduation_year=int(request.form['graduation_year']),
                degree=request.form['degree'],
                field_of_study=request.form['field_of_study'],
                current_position=request.form.get('current_position'),
                current_company=request.form.get('current_company'),
                current_location=request.form.get('current_location'),
                industry=request.form.get('industry'),
                bio=request.form.get('bio'),
                linkedin_url=request.form.get('linkedin_url'),
                website_url=request.form.get('website_url')
            )
            
            db.session.add(alumni)
            db.session.commit()
            flash('Alumni profile added successfully!', 'success')
            return redirect(url_for('profile', alumni_id=alumni.id))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding alumni profile: {str(e)}', 'error')
    
    return render_template('add_alumni.html')

@app.route('/api/alumni/search')
def api_alumni_search():
    """API endpoint for live search functionality"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 10, type=int)
    
    if not query:
        return jsonify([])
    
    alumni = Alumni.query.filter(
        or_(
            Alumni.first_name.ilike(f'%{query}%'),
            Alumni.last_name.ilike(f'%{query}%'),
            Alumni.current_company.ilike(f'%{query}%'),
            Alumni.current_position.ilike(f'%{query}%')
        )
    ).limit(limit).all()
    
    return jsonify([alumni.to_dict() for alumni in alumni])
