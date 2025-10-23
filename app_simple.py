"""
Simplified Visualize Studio Client Portal for debugging
"""

from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'test-key'

# Simple routes first
@app.route('/')
def index():
    """Serve the main website index"""
    try:
        return send_from_directory('.', 'index.html')
    except Exception as e:
        return f"Error serving index.html: {e}", 500

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Simple login page"""
    if request.method == 'POST':
        return "Login form submitted!"
    return "<h1>Login Page</h1><form method='POST'><input type='text' name='username' placeholder='Username'><input type='password' name='password' placeholder='Password'><button type='submit'>Login</button></form>"

@app.route('/test')
def test():
    """Test route"""
    return "Visualize Studio Client Portal - Test Route Working!"

if __name__ == '__main__':
    print("Starting simplified Visualize Studio Client Portal...")
    app.run(debug=True, port=5002)