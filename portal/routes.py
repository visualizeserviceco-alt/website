"""
VISUALIZE STUDIO - CLIENT PORTAL AUTHENTICATION
Secure login system with Flask-Login integration
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from urllib.parse import urlparse
from .models import db, Client
from .navigation import get_navigation_html
import re

# Create blueprint with clean URLs (no prefix)
auth_bp = Blueprint('portal', __name__, 
                   url_prefix='',
                   template_folder='templates')

def is_safe_url(target):
    """
    Validate redirect URL to prevent open redirect attacks
    Only allow relative URLs within the same domain
    """
    if not target:
        return False
    
    ref_url = urlparse(request.host_url)
    test_url = urlparse(target)
    
    # Allow relative URLs and same-domain URLs
    return test_url.scheme in ('http', 'https', '') and \
           (test_url.netloc == '' or test_url.netloc == ref_url.netloc)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """
    Client login with email or username
    Supports 'next' parameter for post-login redirection
    """
    # Redirect if already logged in
    if current_user.is_authenticated:
        return redirect(url_for('portal.dashboard'))
    
    if request.method == 'POST':
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '')
        remember = request.form.get('remember') == 'on'
        
        # Validation
        if not identifier or not password:
            flash('Please enter both username/email and password.', 'error')
            return render_template('portal/login.html')
        
        # Find client by email or username
        client = Client.find_by_email_or_username(identifier)
        
        if client and client.check_password(password) and client.is_active:
            # Successful login
            login_user(client, remember=remember)
            client.update_login_time()
            
            flash(f'Welcome back, {client.name}!', 'success')
            
            # Handle next parameter for secure redirection
            next_page = request.args.get('next')
            if next_page and is_safe_url(next_page):
                return redirect(next_page)
            
            return redirect(url_for('portal.dashboard'))
        else:
            flash('Invalid username/email or password.', 'error')
    
    return render_template('portal/login.html')

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """
    Private signup page - requires access token
    Not linked publicly, admin shares URL manually
    """
    # Check access token
    access_token = request.args.get('access') or request.form.get('access_token')
    required_token = current_app.config.get('SIGNUP_ACCESS_TOKEN', 'visualize-admin-2024')
    
    if access_token != required_token:
        flash('Access denied. Contact Visualize Studio for the signup link.', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        # Extract form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        phone = request.form.get('phone', '').strip()
        
        # Validation
        errors = []
        
        if not all([name, email, username, password]):
            errors.append('All required fields must be filled.')
        
        if password != confirm_password:
            errors.append('Passwords do not match.')
        
        if len(password) < 6:
            errors.append('Password must be at least 6 characters long.')
        
        # Email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if email and not re.match(email_pattern, email):
            errors.append('Please enter a valid email address.')
        
        # Username format validation (alphanumeric + underscore, 3-20 chars)
        username_pattern = r'^[a-zA-Z0-9_]{3,20}$'
        if username and not re.match(username_pattern, username):
            errors.append('Username must be 3-20 characters (letters, numbers, underscore only).')
        
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('portal/signup.html', access_token=access_token)
        
        # Create client
        client, success, message = Client.create_client(
            name=name,
            email=email,
            username=username,
            password=password,
            phone=phone
        )
        
        if success:
            flash('Registration successful! You can now log in.', 'success')
            return redirect(url_for('portal.login'))
        else:
            flash(message, 'error')
            return render_template('portal/signup.html', access_token=access_token)
    
    return render_template('portal/signup.html', access_token=access_token)

@auth_bp.route('/logout')
@login_required
def logout():
    """
    Secure logout with session cleanup
    Redirects to homepage with confirmation message
    """
    username = current_user.name if current_user.is_authenticated else None
    logout_user()
    
    # Clear any additional session data
    session.clear()
    
    if username:
        flash(f'Goodbye, {username}! You have been logged out securely.', 'info')
    else:
        flash('You have been logged out.', 'info')
    
    return redirect(url_for('index'))

@auth_bp.route('/dashboard')
@login_required
def dashboard():
    """
    Client dashboard showing personalized project information
    Only accessible to authenticated clients
    Shows ONLY current_user's data (never query parameters)
    """
    return render_template('portal/dashboard.html', client=current_user)

@auth_bp.route('/client-resources')
@login_required  
def client_resources():
    """
    Shared resources page accessible to any logged-in client
    Contains general information, downloads, and resources
    """
    return render_template('portal/client_resources.html', client=current_user)

# Error handlers for portal blueprint
@auth_bp.errorhandler(404)
def portal_not_found(error):
    """Handle 404 errors within portal"""
    return render_template('portal/error.html', 
                         error_code=404, 
                         error_message="Portal page not found"), 404

@auth_bp.errorhandler(403)
def portal_forbidden(error):
    """Handle 403 errors within portal"""
    return render_template('portal/error.html', 
                         error_code=403, 
                         error_message="Access forbidden"), 403

@auth_bp.route('/nav')
def navigation():
    """
    Dynamic navigation endpoint
    Returns navigation HTML based on authentication status
    """
    return get_navigation_html()