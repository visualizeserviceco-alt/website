"""
VISUALIZE STUDIO - MAIN APPLICATION
Clean Flask app with organized client portal system
"""

from flask import Flask, send_from_directory
import os
from config import config
from portal import create_portal

def create_app(config_name=None):
    """
    Application factory pattern for creating Flask app
    
    Args:
        config_name: Configuration environment ('development', 'production', 'testing')
        
    Returns:
        Configured Flask application
    """
    app = Flask(__name__, static_folder='.', static_url_path='/static')
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    app.config.from_object(config[config_name])
    
    # Initialize client portal system (handles all /login, /signup, /dashboard routes)
    create_portal(app)
    
    # Main website routes (existing static site)
    @app.route('/')
    def index():
        """Serve the main website index"""
        return send_from_directory('.', 'index.html')

    @app.route('/process')
    def process_page():
        """Serve the process page with clean URL"""
        return send_from_directory('.', 'Process.html')

    @app.route('/payments')
    def payments_page():
        """Serve the payments page with clean URL"""
        return send_from_directory('.', 'Payments.html')

    @app.route('/client-portal')
    def client_portal_page():
        """Serve the client portal page with clean URL"""
        return send_from_directory('.', 'PapsProd.html')

    # Static files catch-all (must be last route)
    @app.route('/<path:filename>')
    def serve_static_files(filename):
        """Serve static files from the existing website"""
        try:
            return send_from_directory('.', filename)
        except:
            return '', 404

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors with portal template if available"""
        try:
            from flask import render_template
            return render_template('portal/error.html', 
                                 error_code=404, 
                                 error_message="Page not found"), 404
        except:
            return "404 - Page not found", 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        try:
            from flask import render_template
            from portal.models import db
            db.session.rollback()
            return render_template('portal/error.html', 
                                 error_code=500, 
                                 error_message="Internal server error"), 500
        except:
            return "500 - Internal server error", 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    # Development server
    print("🚀 Starting Visualize Studio with Client Portal...")
    print("📋 Available routes:")
    print("   Main site: http://localhost:5001/")
    print("   Client login: http://localhost:5001/login")
    print("   Client signup: http://localhost:5001/signup?access=visualize-client")
    print("   Client dashboard: http://localhost:5001/dashboard")
    
    app.run(debug=True, port=5001)