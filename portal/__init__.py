"""
VISUALIZE STUDIO - CLIENT PORTAL INITIALIZATION
Setup portal blueprint, database, and authentication system
"""

from flask import Flask
from flask_login import LoginManager
from .models import db, Client
from .routes import auth_bp

def create_portal(app: Flask):
    """
    Initialize the complete client portal system with clean URLs
    
    Args:
        app: Flask application instance
        
    Returns:
        Configured LoginManager instance
    """
    
    # Initialize database
    db.init_app(app)
    
    # Configure Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'portal.login'
    login_manager.login_message = 'Please log in to access the client portal.'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        """Load user for Flask-Login session management"""
        try:
            return Client.query.get(int(user_id))
        except (ValueError, TypeError):
            return None
    
    # Register portal blueprint with clean URLs (no prefix)
    app.register_blueprint(auth_bp)
    
    # Initialize database and create sample data
    with app.app_context():
        db.create_all()
        _create_sample_data_if_needed()
    
    return login_manager

def _create_sample_data_if_needed():
    """
    Create sample client data for testing if no clients exist
    """
    # Check if clients already exist
    if Client.query.first():
        return
    
    # Create sample clients
    try:
        # Client 1: Demo client
        client1, success1, msg1 = Client.create_client(
            name="Demo Client",
            email="demo@client.com",
            username="demo_client", 
            password="demo123",
            phone="555-123-4567",
            project_status="Design Phase - Logo concepts in review",
            payments_due=0.0
        )
        
        if success1:
            client1.project_description = "Complete brand identity package including logo, business cards, letterhead, and basic website. Modern, professional aesthetic with blue and gray color scheme."
            client1.notes = "Client prefers minimalist designs. Deadline: End of month. Very responsive to communications."
        
        # Client 2: Jane Smith
        client2, success2, msg2 = Client.create_client(
            name="Jane Smith",
            email="jane@company.com", 
            username="jane_smith",
            password="jane123",
            phone="555-987-6543",
            project_status="Development Phase - Website 80% complete",
            payments_due=1500.0
        )
        
        if success2:
            client2.project_description = "E-commerce website development with custom shopping cart, payment integration, and inventory management. Built on modern tech stack with responsive design."
            client2.notes = "Final payment due upon completion. Launch date: Next Friday. Client requested SSL certificate and backup system."
        
        db.session.commit()
        
        print("✅ Sample client data created successfully!")
        print("\n🔐 Demo Login Credentials:")
        print("   Username: demo_client | Password: demo123")
        print("   Username: jane_smith  | Password: jane123")
        print(f"\n🔗 Access URLs:")
        print("   Login: /login")
        print("   Signup: /signup?access=visualize-client")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.session.rollback()

# Backward compatibility
init_portal = create_portal