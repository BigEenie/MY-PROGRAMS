# University Marketplace - Colorful Edition

A vibrant, modern Flask-based ecommerce marketplace for university students featuring colorful gradients, PostgreSQL database integration, and Nigerian Naira transactions.

## 🎨 New Features

### Visual Design
- **Vibrant Color Scheme**: Purple to pink gradients with customizable university colors
- **Glass Effects**: Modern backdrop-blur effects and transparency
- **Smooth Animations**: Hover effects, floating elements, and transitions
- **Responsive Design**: Mobile-friendly with touch interactions
- **Inter Font**: Clean, modern typography throughout

### Database Integration
- **PostgreSQL**: Full SQL database with ACID compliance
- **Data Persistence**: All sellers, products, and purchases saved permanently
- **Purchase Tracking**: Complete buyer inquiry system in database
- **Admin Management**: Secure seller activation/deactivation

### University Branding
- **Custom Logo URL**: Upload and display university logo
- **Color Customization**: Primary, secondary, and accent colors
- **Real-time Preview**: See changes instantly in admin panel
- **Brand Consistency**: Logo appears in navigation and footer

### Nigerian Context
- **Naira Currency**: All prices in ₦ with proper formatting
- **Local Sellers**: Sample Nigerian student profiles
- **Realistic Pricing**: MacBook ₦450,000, Books ₦15,000-25,000
- **Local Context**: Nigerian phone numbers and email domains

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Install Python dependencies
pip install flask flask-sqlalchemy psycopg2-binary email-validator werkzeug gunicorn

# Set environment variables
export DATABASE_URL="postgresql://user:password@host:port/database"
export SESSION_SECRET="your-secure-secret-key"
```

### 2. Database Configuration
The application uses PostgreSQL. Ensure you have:
- PostgreSQL server running
- Database created
- Connection details in DATABASE_URL

### 3. Run Application
```bash
python main.py
```

Access at: http://localhost:5000

### 4. Admin Access
- URL: http://localhost:5000/admin/login
- Username: `admin`
- Password: `admin123`

## 📁 Project Structure

```
university_marketplace_complete/
├── app.py                 # Flask app configuration
├── main.py               # Application entry point
├── models.py             # Database models and initialization
├── routes.py             # URL routes and request handlers
├── templates/            # HTML templates
│   ├── base.html         # Base layout with navigation
│   ├── index.html        # Colorful homepage
│   ├── admin.html        # Admin dashboard
│   ├── seller_profile.html
│   ├── contact_seller.html
│   ├── add_seller.html
│   ├── add_product.html
│   ├── admin_login.html
│   └── university_settings.html
├── static/
│   ├── css/
│   │   └── style.css     # Modern colorful styling
│   ├── js/
│   │   └── main.js       # Client-side functionality
│   └── uploads/          # File upload directory
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🎯 Key Features

### Homepage
- **Hero Section**: Animated gradient background with floating elements
- **Product Grid**: Colorful cards with hover effects and animations
- **Search & Filter**: Modern form design with gradient buttons
- **Feature Cards**: Glass-effect cards explaining marketplace benefits

### Admin Panel
- **Statistics Dashboard**: Colorful cards showing seller/product counts
- **Seller Management**: Add, activate, deactivate sellers
- **University Settings**: Customize logo, colors, and branding
- **Purchase Monitoring**: View all buyer inquiries

### Database Schema

#### Sellers Table
```sql
- id (Primary Key)
- name, department, email, phone
- profile_image_url, bio, rating
- is_active, created_at
```

#### Products Table
```sql
- id (Primary Key)
- seller_id (Foreign Key)
- name, description, price, category
- condition, image_url, is_available
- created_at
```

#### Purchase Requests Table
```sql
- id (Primary Key)
- seller_id, product_id (Foreign Keys)
- buyer_name, buyer_email, buyer_phone
- message, status, created_at
```

#### University Settings
```sql
- id (Primary Key)
- name, logo_url
- primary_color, secondary_color, accent_color
- updated_at
```

## 🎨 Customization

### Color Scheme
Access `/admin/university_settings` to customize:
- **Primary Color**: Main brand color (default: #667eea)
- **Secondary Color**: Accent color (default: #f093fb)
- **Accent Color**: Highlight color (default: #ffecd2)

### Logo Integration
1. Upload logo to hosting service (university website recommended)
2. Add URL in university settings
3. Recommended size: 40x40 pixels, PNG format
4. Automatic fallback to graduation cap icon

### Sample Data
The application includes Nigerian university context:

**Sellers:**
- Adebayo Oluwaseun (Computer Science)
- Fatima Mohammed (Business Administration)
- Chinedu Okwu (Engineering)

**Products:**
- MacBook Pro 13": ₦450,000
- Programming Books: ₦25,000
- Scientific Calculator: ₦35,000
- Business Textbook: ₦15,000
- Office Supplies: ₦8,000

## 💳 Transaction Flow

1. **Browse**: Students explore colorful product marketplace
2. **Select**: Click "Purchase (Cash on Delivery)" button
3. **Contact**: Fill form with delivery preferences
4. **Database**: Inquiry saved for seller follow-up
5. **Communication**: Direct seller-buyer coordination
6. **Delivery**: Cash payment upon product receipt

## 🔒 Security Features

- **Password Hashing**: Secure admin authentication
- **SQL Injection Protection**: SQLAlchemy ORM
- **Input Validation**: Email and form validation
- **Session Security**: Secure cookie management
- **CSRF Protection**: Form token validation

## 📱 Responsive Design

- **Mobile First**: Touch-friendly interactions
- **Tablet Support**: Optimized grid layouts
- **Desktop Enhanced**: Full feature experience
- **Cross-browser**: Modern browser compatibility

## 🚀 Deployment Ready

- **Gunicorn**: Production WSGI server configured
- **Environment Variables**: Secure configuration
- **Static Files**: Optimized serving
- **Database Migrations**: Automatic table creation
- **Error Handling**: Graceful failure recovery

## 🎓 Educational Use

Perfect for:
- University computer science projects
- Web development learning
- Database design practice
- Modern UI/UX implementation
- Full-stack development experience

## 📞 Support

For questions about implementation:
1. Check the colorful admin panel for settings
2. Review database logs for errors
3. Test purchase flow with sample data
4. Customize university branding as needed

## 🏆 Technology Stack

- **Backend**: Flask 3.1+ with SQLAlchemy ORM
- **Database**: PostgreSQL with full ACID compliance
- **Frontend**: Modern CSS3 with gradients and animations
- **Typography**: Inter font family
- **Icons**: Font Awesome 6.4+
- **Styling**: Bootstrap 5.3+ with custom overrides
- **Currency**: Nigerian Naira (₦) formatting

The marketplace is production-ready with a vibrant, professional design perfect for university environments.