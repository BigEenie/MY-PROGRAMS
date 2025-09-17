from app import db
from datetime import datetime

class Alumni(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Personal Information
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    
    # Academic Information
    graduation_year = db.Column(db.Integer, nullable=False)
    degree = db.Column(db.String(200), nullable=False)
    field_of_study = db.Column(db.String(200), nullable=False)
    
    # Current Information
    current_position = db.Column(db.String(200))
    current_company = db.Column(db.String(200))
    current_location = db.Column(db.String(200))
    industry = db.Column(db.String(100))
    
    # Additional Information
    bio = db.Column(db.Text)
    linkedin_url = db.Column(db.String(500))
    website_url = db.Column(db.String(500))
    
    # Profile Image (placeholder for now, using initials)
    profile_image_url = db.Column(db.String(500))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Alumni {self.first_name} {self.last_name}>'
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def initials(self):
        return f"{self.first_name[0]}{self.last_name[0]}".upper()
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'graduation_year': self.graduation_year,
            'degree': self.degree,
            'field_of_study': self.field_of_study,
            'current_position': self.current_position,
            'current_company': self.current_company,
            'current_location': self.current_location,
            'industry': self.industry,
            'bio': self.bio,
            'linkedin_url': self.linkedin_url,
            'website_url': self.website_url,
            'initials': self.initials
        }
