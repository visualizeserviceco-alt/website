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

    @app.route('/work')
    def work_page():
        """Serve the Work page with clean URL"""
        return send_from_directory('pages', 'Work.html')

    @app.route('/about')
    def about_page():
        """Serve the About page with clean URL"""
        return send_from_directory('pages', 'About.html')

    @app.route('/contact')
    def contact_page():
        """Serve the Contact/Let's Chat page with clean URL"""
        return send_from_directory('pages', 'Contact.html')

    @app.route('/quote')
    def quote_page():
        """Serve the Request a Quote page with clean URL"""
        return send_from_directory('pages', 'Quote.html')

    @app.route('/stickers')
    def stickers_page():
        """Serve the Custom Stickers page with clean URL"""
        return send_from_directory('pages', 'Stickers.html')

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
    print("   Work: http://localhost:5001/work")
    print("   About: http://localhost:5001/about")
    print("   Contact: http://localhost:5001/contact")
    print("   Quote: http://localhost:5001/quote")
    print("   Stickers: http://localhost:5001/stickers")
    print("   Process: http://localhost:5001/process")
    print("   Payments: http://localhost:5001/payments")
    print("   Terms: http://localhost:5001/terms")
    
    app.run(debug=True, port=5001)
