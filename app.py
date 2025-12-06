"""
VISUALIZE STUDIO - MAIN APPLICATION
"""

from flask import Flask, send_from_directory
import os
from config import config

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
    
    # Main website routes (existing static site)
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

    @app.route('/terms')
    def terms_page():
        """Serve the Terms of Service page with clean URL"""
        return send_from_directory('pages', 'Terms.html')

    @app.route('/portfolio')
    def portfolio_page():
        """Serve the Portfolio page with clean URL"""
        return send_from_directory('pages', 'Portfolio.html')

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
        """Handle 404 errors"""
        return "404 - Page not found", 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        return "500 - Internal server error", 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    # Development server
    print("🚀 Starting Visualize Studio...")
    print("📋 Available routes:")
    print("   Main site: http://localhost:5001/")
    print("   Portfolio: http://localhost:5001/portfolio")
    print("   Process: http://localhost:5001/process")
    print("   Payments: http://localhost:5001/payments")
    print("   Terms: http://localhost:5001/terms")
    
    app.run(debug=True, port=5001)
