from app import app, db
from models import init_database
import routes

@app.before_request
def before_first_request():
    if not hasattr(app, '_database_initialized'):
        with app.app_context():
            # Force drop and recreate all tables to fix corruption
           # db.drop_all()
            #db.create_all()
            init_database()  # This will create your admin user and university settings
        app._database_initialized = True

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)