"""
VISUALIZE STUDIO - APPLICATION CONFIGURATION
Centralized configuration for Flask app and client portal
"""

import os
from datetime import timedelta

class Config:
    """Base configuration with common settings"""
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'visualize-studio-secret-key-change-in-production'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///visualize_clients.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session Security
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Client Portal Settings
    SIGNUP_ACCESS_TOKEN = os.environ.get('SIGNUP_ACCESS_TOKEN') or 'visualize-client'
    
    # Flask-Login
    LOGIN_VIEW = 'portal.login'
    LOGIN_MESSAGE = 'Please log in to access the client portal.'
    LOGIN_MESSAGE_CATEGORY = 'info'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SESSION_COOKIE_SECURE = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    
    # Override with production database URL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://user:password@localhost/visualize_prod'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}