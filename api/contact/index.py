"""
Vercel serverless function for contact form submissions
Uses Vercel's serverless function format
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

# For Vercel, we'll use environment variables or a database service
# For now, we'll use a simple approach with email notifications

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
    
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Validate required fields
            if not data.get('name') or not data.get('email') or not data.get('message'):
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing required fields'}).encode())
                return
            
            # Here you would typically:
            # 1. Save to a database (like Supabase, MongoDB, etc.)
            # 2. Send email notification
            # 3. Store in a service like Airtable
            
            # For now, we'll return success
            # TODO: Integrate with your preferred storage/email service
            
            response = {
                'success': True,
                'message': 'Thank you! Your message has been received.',
                'id': datetime.utcnow().timestamp()
            }
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Failed to submit form', 'details': str(e)}).encode())








