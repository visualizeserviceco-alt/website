"""
Clean URLs Test - Minimal Flask App
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__)

print("Starting Clean URLs Flask App...")

# Routes for clean URLs
@app.route('/')
def index():
    """Serve the main website index"""
    print("Serving index.html")
    return send_from_directory('.', 'index.html')

@app.route('/process')
def process_page():
    """Serve the process page with clean URL"""
    print("Serving Process.html from /process")
    return send_from_directory('pages', 'Process.html')

@app.route('/payments')
def payments_page():
    """Serve the payments page with clean URL"""
    print("Serving Payments.html from /payments")
    return send_from_directory('pages', 'Payments.html')

@app.route('/client-portal')
def client_portal_page():
    """Serve the client portal page with clean URL"""
    print("Serving PapsProd.html from /client-portal")
    return send_from_directory('pages', 'PapsProd.html')

@app.route('/<path:filename>')
def serve_static_files(filename):
    """Serve static files from the existing website"""
    print(f"Serving static file: {filename}")
    
    # Skip special routes
    if filename in ['process', 'payments', 'client-portal']:
        return '', 404
    
    try:
        return send_from_directory('.', filename)
    except Exception as e:
        print(f"Error serving {filename}: {e}")
        return '', 404

if __name__ == '__main__':
    print("Clean URLs Flask app starting on port 5001...")
    app.run(debug=True, port=5001)