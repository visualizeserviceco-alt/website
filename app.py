"""
VISUALIZE STUDIO - CLIENT PORTAL APPLICATION
Secure client login system with personalized dashboards
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'visualize-studio-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///visualize_clients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access the client portal.'
login_manager.login_message_category = 'info'

# Database Models
class User(UserMixin, db.Model):
    """User model for client authentication"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Client-specific data
    project_stage = db.Column(db.String(50), default='Planning')
    payment_status = db.Column(db.String(50), default='Current')
    payment_due = db.Column(db.Float, default=0.0)
    project_description = db.Column(db.Text)
    notes = db.Column(db.Text)

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    """Load user for Flask-Login"""
    return User.query.get(int(user_id))

# Routes - Public Website (serve existing static files)
@app.route('/')
def index():
    """Serve the main website index"""
    return send_from_directory('.', 'index.html')

# Clean URL routes for main pages
@app.route('/process')
def process_page():
    """Serve the process page with clean URL"""
    return send_from_directory('pages', 'Process.html')

@app.route('/payments')
def payments_page():
    """Serve the payments page with clean URL"""
    return send_from_directory('pages', 'Payments.html')

@app.route('/client-portal')
def client_portal_page():
    """Serve the client portal page with clean URL"""
    return send_from_directory('pages', 'PapsProd.html')

@app.route('/<path:filename>')
def serve_static_files(filename):
    """Serve static files from the existing website"""
    # Skip authentication and clean URL routes - these are handled by specific route handlers
    skip_routes = ['login', 'signup', 'dashboard', 'client-info', 'logout', 'process', 'payments', 'client-portal']
    
    if filename in skip_routes:
        # Let Flask handle these with the specific route handlers
        return '', 404
    
    try:
        return send_from_directory('.', filename)
    except:
        return '', 404

# Authentication Routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Client login page"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember_me') == 'on'
        
        user = User.query.filter((User.username == username) | (User.email == username)).first()
        
        if user and user.check_password(password) and user.is_active:
            login_user(user, remember=remember)
            next_page = request.args.get('next')
            flash(f'Welcome back, {user.full_name}!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid username/email or password.', 'error')
    
    return render_template('login.html')

@app.route('/signup')
def signup():
    """Private signup page with access token"""
    access_token = request.args.get('access')
    required_token = 'visualize-client'
    
    if access_token != required_token:
        flash('Access denied. Contact Visualize Studio for the signup link.', 'error')
        return redirect(url_for('index'))
    
    return render_template('signup.html', access_token=access_token)

@app.route('/register', methods=['POST'])
def register():
    """Process signup form"""
    access_token = request.form.get('access_token')
    required_token = 'visualize-client'
    
    if access_token != required_token:
        flash('Invalid access token.', 'error')
        return redirect(url_for('index'))
    
    # Get form data
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    full_name = request.form.get('full_name')
    phone = request.form.get('phone')
    
    # Validation
    if not all([username, email, password, full_name]):
        flash('All required fields must be filled.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')
    
    if password != confirm_password:
        flash('Passwords do not match.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')
    
    if len(password) < 6:
        flash('Password must be at least 6 characters long.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')
    
    if User.query.filter_by(username=username).first():
        flash('Username already exists.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')
    
    if User.query.filter_by(email=email).first():
        flash('Email already registered.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')
    
    # Create new user
    user = User(
        username=username,
        email=email,
        full_name=full_name,
        phone=phone,
        project_description="Welcome to Visualize Studio! Your project details will be updated soon."
    )
    user.set_password(password)
    
    try:
        db.session.add(user)
        db.session.commit()
        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('login'))
    except Exception as e:
        db.session.rollback()
        flash('Registration failed. Please try again.', 'error')
        return redirect(url_for('signup') + f'?access={access_token}')

@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))

# Client Portal Routes
@app.route('/dashboard')
@login_required
def dashboard():
    """Client dashboard with personalized data"""
    return render_template('dashboard.html', user=current_user)

@app.route('/client-info')
@login_required
def client_info():
    """Shared resources for all clients"""
    return render_template('client_info.html')

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('error.html', 
                         error_code=404, 
                         error_message="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    return render_template('error.html', 
                         error_code=500, 
                         error_message="Internal server error"), 500

# Database initialization
def init_db():
    """Initialize database with sample data"""
    with app.app_context():
        db.create_all()
        
        # Create sample clients if no users exist
        if not User.query.first():
            # Sample client 1
            client1 = User(
                username='demo_client',
                email='demo@client.com',
                full_name='Demo Client',
                phone='555-123-4567',
                project_stage='Design Phase',
                payment_status='Current',
                payment_due=0.0,
                project_description='Complete brand identity design including logo, business cards, and marketing materials.',
                notes='Client requested modern, minimalist design aesthetic.'
            )
            client1.set_password('demo123')
            
            # Sample client 2
            client2 = User(
                username='jane_smith',
                email='jane@company.com',
                full_name='Jane Smith',
                phone='555-987-6543',
                project_stage='Development',
                payment_status='Payment Due',
                payment_due=1500.0,
                project_description='E-commerce website development with custom shopping cart and payment integration.',
                notes='Final payment due upon project completion.'
            )
            client2.set_password('jane123')
            
            db.session.add(client1)
            db.session.add(client2)
            db.session.commit()
            print("Sample client data created successfully!")
            print("Demo credentials:")
            print("  Username: demo_client, Password: demo123")
            print("  Username: jane_smith, Password: jane123")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)