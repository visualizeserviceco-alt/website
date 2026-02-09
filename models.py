"""
Database models for Visualize Studio
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ContactSubmission(db.Model):
    """Model for contact form submissions"""
    __tablename__ = 'contact_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    project_type = db.Column(db.String(100))
    message = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)
    
    def to_dict(self):
        """Convert submission to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'project_type': self.project_type,
            'message': self.message,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'read': self.read
        }

class QuoteSubmission(db.Model):
    """Model for quote request form submissions"""
    __tablename__ = 'quote_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    package = db.Column(db.String(100))
    project_details = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)
    
    def to_dict(self):
        """Convert submission to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'package': self.package,
            'project_details': self.project_details,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'read': self.read
        }








