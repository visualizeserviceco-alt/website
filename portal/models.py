"""
VISUALIZE STUDIO - CLIENT PORTAL MODELS
Secure client authentication and data models
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Client(UserMixin, db.Model):
    """
    Client model for secure authentication and project tracking
    
    Features:
    - Unique email and username constraints
    - Secure password hashing with Werkzeug
    - Project status and payment tracking
    - Session management compatible with Flask-Login
    """
    __tablename__ = 'clients'
    
    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Project & payment tracking
    project_status = db.Column(db.String(100), default="")
    payments_due = db.Column(db.Float, default=0.0)
    project_description = db.Column(db.Text, default="")
    notes = db.Column(db.Text, default="")
    
    # Account management
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    
    def __init__(self, **kwargs):
        """Initialize client with secure defaults"""
        super(Client, self).__init__(**kwargs)
        if not self.project_status:
            self.project_status = "New Project"
    
    def set_password(self, password):
        """
        Hash and store password securely using Werkzeug
        Never stores plaintext passwords
        """
        if not password:
            raise ValueError("Password cannot be empty")
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')
    
    def check_password(self, password):
        """
        Verify password against stored hash
        Returns True if password matches, False otherwise
        """
        if not password or not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def update_login_time(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def get_id(self):
        """Return user ID as string for Flask-Login"""
        return str(self.id)
    
    @property
    def is_authenticated(self):
        """Required by Flask-Login"""
        return True
    
    @property
    def is_anonymous(self):
        """Required by Flask-Login"""
        return False
    
    def __repr__(self):
        return f'<Client {self.username}: {self.name}>'

    @classmethod
    def find_by_email_or_username(cls, identifier):
        """
        Find client by email or username for login
        Supports login with either credential type
        """
        return cls.query.filter(
            (cls.email == identifier) | (cls.username == identifier)
        ).first()
    
    @classmethod
    def create_client(cls, name, email, username, password, phone=None, 
                     project_status="", payments_due=0.0):
        """
        Create new client with validation and security checks
        
        Args:
            name: Full client name
            email: Unique email address
            username: Unique username
            password: Raw password (will be hashed)
            phone: Optional phone number
            project_status: Current project phase
            payments_due: Outstanding payment amount
            
        Returns:
            Tuple: (client_object, success_boolean, error_message)
        """
        try:
            # Validation
            if not all([name, email, username, password]):
                return None, False, "All required fields must be provided"
            
            if len(password) < 6:
                return None, False, "Password must be at least 6 characters"
            
            # Check for existing email/username
            if cls.query.filter_by(email=email).first():
                return None, False, "Email already registered"
            
            if cls.query.filter_by(username=username).first():
                return None, False, "Username already taken"
            
            # Create client
            client = cls(
                name=name,
                email=email.lower().strip(),
                username=username.strip(),
                phone=phone,
                project_status=project_status,
                payments_due=payments_due
            )
            client.set_password(password)
            
            db.session.add(client)
            db.session.commit()
            
            return client, True, "Client created successfully"
            
        except Exception as e:
            db.session.rollback()
            return None, False, f"Database error: {str(e)}"