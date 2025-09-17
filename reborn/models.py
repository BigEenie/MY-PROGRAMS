from datetime import datetime
from app import db
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash

class Seller(db.Model):
    __tablename__ = 'sellers'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    profile_image_url = Column(String(500))
    bio = Column(Text)
    rating = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with products
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'email': self.email,
            'phone': self.phone,
            'profile_image': self.profile_image_url or f'https://via.placeholder.com/150x150/007bff/ffffff?text={self.name[0].upper()}',
            'bio': self.bio,
            'rating': self.rating,
            'is_active': self.is_active,
            'created_at': self.created_at
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, ForeignKey('sellers.id'), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    condition = Column(String(50), default='Good')
    image_url = Column(String(500))
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with seller
    seller = relationship("Seller", back_populates="products")
    
    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'condition': self.condition,
            'image': self.image_url or f'https://via.placeholder.com/300x200/6c757d/ffffff?text={self.name.replace(" ", "+")}',
            'is_available': self.is_available,
            'created_at': self.created_at
        }

class PurchaseRequest(db.Model):
    __tablename__ = 'purchase_requests'
    
    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, ForeignKey('sellers.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    buyer_name = Column(String(100), nullable=False)
    buyer_email = Column(String(120), nullable=False)
    buyer_phone = Column(String(20))
    message = Column(Text, nullable=False)
    status = Column(String(20), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    seller = relationship("Seller")
    product = relationship("Product")
    
    def to_dict(self):
        return {
            'id': self.id,
            'seller_id': self.seller_id,
            'product_id': self.product_id,
            'buyer_name': self.buyer_name,
            'buyer_email': self.buyer_email,
            'buyer_phone': self.buyer_phone,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at
        }

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class University(db.Model):
    __tablename__ = 'university'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    logo_url = Column(String(500))
    primary_color = Column(String(7), default='#007bff')
    secondary_color = Column(String(7), default='#28a745')
    accent_color = Column(String(7), default='#ffc107')
    updated_at = Column(DateTime, default=datetime.utcnow)


def init_database():
    """Initialize database with tables and sample data"""
    # Create all tables
    db.create_all()
    
    # Check if admin exists, if not create one
    if not Admin.query.filter_by(username='admin').first():
        admin = Admin(username='admin')
        admin.set_password('admin123')
        db.session.add(admin)
    
    # Check if university record exists, if not create one
    if not University.query.first():
        university = University(
            name='University Marketplace',
            logo_url='https://via.placeholder.com/40x40/667eea/ffffff?text=U',
            primary_color='#667eea',
            secondary_color='#f093fb',
            accent_color='#ffecd2'
        )
        db.session.add(university)
    
    # Remove the problematic line that references undefined 'products'
    # db.session.add_all(products)  <-- This line was causing the error
    
    db.session.commit()