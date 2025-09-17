#!/usr/bin/env python3
"""
Simple production runner for the marriage counselor website.
Runs the Flask application with proper configuration.
"""

import os
import sys
from app import app, init_db

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Get port from environment or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    print(f"Starting Harmony Counseling website on port {port}")
    print("Visit http://localhost:5000 to view the website")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False
    )