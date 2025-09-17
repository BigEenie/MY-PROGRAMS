# Setup Instructions

## Quick Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/university_marketplace"
   export SESSION_SECRET="your-very-secure-secret-key-here"
   ```

3. **Run Application**:
   ```bash
   python main.py
   ```

4. **Access Application**:
   - Homepage: http://localhost:5000
   - Admin: http://localhost:5000/admin/login (admin/admin123)

## Database Setup

### Option 1: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb university_marketplace

# Create user
sudo -u postgres createuser -P marketplace_user

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE university_marketplace TO marketplace_user;"

# Set DATABASE_URL
export DATABASE_URL="postgresql://marketplace_user:password@localhost:5432/university_marketplace"
```

### Option 2: SQLite (Development)
```bash
# Use SQLite for development
export DATABASE_URL="sqlite:///marketplace.db"
```

## Features Available

✓ Colorful gradient design with modern animations
✓ PostgreSQL database with persistent data storage
✓ University logo URL customization
✓ Nigerian Naira (₦) currency formatting
✓ Purchase request tracking system
✓ Admin panel with statistics and settings
✓ Mobile-responsive design
✓ Glass-effect UI elements

## Sample Data

The application automatically creates:
- Admin user (admin/admin123)
- 3 Nigerian student sellers
- 6 sample products with Naira pricing
- University settings with customizable branding

## Admin Features

1. **University Settings**: Customize logo and colors
2. **Seller Management**: Add/activate/deactivate sellers
3. **Statistics Dashboard**: View marketplace metrics
4. **Purchase Monitoring**: Track buyer inquiries

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and user has permissions

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Missing Dependencies
```bash
# Reinstall all requirements
pip install --force-reinstall -r requirements.txt
```

## Production Deployment

### Using Gunicorn
```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

### Environment Variables for Production
```bash
export FLASK_ENV=production
export DATABASE_URL="postgresql://user:pass@host:port/db"
export SESSION_SECRET="production-secret-key"
```

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong SESSION_SECRET
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS
- [ ] Regular database backups

Ready to use! The colorful marketplace will automatically initialize with sample data on first run.