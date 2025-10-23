"""
VISUALIZE STUDIO - MAIN APPLICATION
Secure client portal with Flask backend and static frontend integration
"""

from flask import Flask, send_from_directory, render_template
from portal import init_portal, create_sample_data
import os

def create_app():
    """
    Create and configure the Flask application
    
    Returns:
        Flask app with portal system integrated
    """
    app = Flask(__name__)
    
    # Security Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'visualize-studio-change-in-production-2024!'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///visualize_clients.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Session Security
    app.config['SESSION_COOKIE_SECURE'] = os.environ.get('FLASK_ENV') == 'production'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours
    
    # Portal Configuration
    app.config['SIGNUP_ACCESS_TOKEN'] = os.environ.get('SIGNUP_TOKEN') or 'visualize-admin-2024'
    
    # Initialize portal system
    login_manager = init_portal(app)
    
    # =============== PUBLIC WEBSITE ROUTES ===============
    @app.route('/')
    def index():
        """Serve the main website index"""
        return send_from_directory('.', 'index.html')

    @app.route('/process')
    def process_page():
        """Serve the process page with clean URL"""
        return send_from_directory('pages', 'Process.html')

    @app.route('/payments')
    def payments_page():
        """Serve the payments page with clean URL"""
        return send_from_directory('pages', 'Payments.html')

    # =============== STATIC FILE SERVING ===============
    @app.route('/<path:filename>')
    def serve_static_files(filename):
        """
        Serve static files from the existing website
        Excludes portal routes which are handled by blueprint
        """
        # Portal routes are handled by the blueprint, skip them here
        portal_routes = ['portal']
        
        if filename.startswith('portal/') or filename in portal_routes:
            return '', 404
        
        try:
            return send_from_directory('.', filename)
        except:
            return '', 404

    # =============== ERROR HANDLERS ===============
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return render_template('portal/error.html', 
                             error_code=404, 
                             error_message="Page not found"), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        from portal.models import db
        db.session.rollback()
        return render_template('portal/error.html', 
                             error_code=500, 
                             error_message="Internal server error"), 500

    @app.errorhandler(403)
    def forbidden(error):
        """Handle 403 errors"""
        return render_template('portal/error.html', 
                             error_code=403, 
                             error_message="Access forbidden"), 403

    return app

def init_database(app):
    """Initialize database with tables and sample data"""
    print("🔧 Initializing database...")
    create_sample_data(app)
    print("✅ Database initialization complete!")

if __name__ == '__main__':
    # Create application
    app = create_app()
    
    # Initialize database
    init_database(app)
    
    # Development server configuration
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    port = int(os.environ.get('PORT', 5000))
    
    print(f"\n🚀 Starting Visualize Studio server...")
    print(f"   Debug mode: {debug_mode}")
    print(f"   Port: {port}")
    print(f"\n🔗 Available URLs:")
    print(f"   Main site: http://localhost:{port}/")
    print(f"   Client login: http://localhost:{port}/portal/login")
    print(f"   Private signup: http://localhost:{port}/portal/signup?access=visualize-admin-2024")
    
    app.run(debug=debug_mode, port=port, host='0.0.0.0')