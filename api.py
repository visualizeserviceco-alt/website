"""
API routes for form submissions
"""
from flask import Blueprint, request, jsonify
from models import db, ContactSubmission, QuoteSubmission
from datetime import datetime

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/test', methods=['GET'])
def test_api():
    """Test endpoint to verify API is working"""
    return jsonify({'success': True, 'message': 'API is working!'}), 200

@api_bp.route('/contact', methods=['POST', 'OPTIONS'])
def submit_contact():
    """Handle contact form submission"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        # Get JSON data
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Missing required fields: name, email, and message are required'}), 400
        
        # Create submission
        submission = ContactSubmission(
            name=data.get('name').strip(),
            email=data.get('email').strip(),
            project_type=data.get('project', '').strip() or None,
            message=data.get('message').strip()
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Thank you! Your message has been received.',
            'id': submission.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in submit_contact: {error_details}")
        return jsonify({'error': 'Failed to submit form', 'details': str(e)}), 500

@api_bp.route('/quote', methods=['POST', 'OPTIONS'])
def submit_quote():
    """Handle quote request form submission"""
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        # Get JSON data
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('project'):
            return jsonify({'error': 'Missing required fields: name, email, and project are required'}), 400
        
        # Create submission
        submission = QuoteSubmission(
            name=data.get('name').strip(),
            email=data.get('email').strip(),
            package=data.get('package', '').strip() or None,
            project_details=data.get('project').strip()
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Thank you! Your quote request has been received.',
            'id': submission.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in submit_quote: {error_details}")
        return jsonify({'error': 'Failed to submit form', 'details': str(e)}), 500

@api_bp.route('/submissions/contact', methods=['GET'])
def get_contact_submissions():
    """Get all contact form submissions (admin only)"""
    try:
        # TODO: Add authentication here
        submissions = ContactSubmission.query.order_by(ContactSubmission.submitted_at.desc()).all()
        return jsonify({
            'success': True,
            'submissions': [s.to_dict() for s in submissions]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch submissions', 'details': str(e)}), 500

@api_bp.route('/submissions/quote', methods=['GET'])
def get_quote_submissions():
    """Get all quote form submissions (admin only)"""
    try:
        # TODO: Add authentication here
        submissions = QuoteSubmission.query.order_by(QuoteSubmission.submitted_at.desc()).all()
        return jsonify({
            'success': True,
            'submissions': [s.to_dict() for s in submissions]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch submissions', 'details': str(e)}), 500

@api_bp.route('/submissions/contact/<int:submission_id>/read', methods=['PUT'])
def mark_contact_read(submission_id):
    """Mark a contact submission as read"""
    try:
        submission = ContactSubmission.query.get_or_404(submission_id)
        submission.read = True
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update submission', 'details': str(e)}), 500

@api_bp.route('/submissions/quote/<int:submission_id>/read', methods=['PUT'])
def mark_quote_read(submission_id):
    """Mark a quote submission as read"""
    try:
        submission = QuoteSubmission.query.get_or_404(submission_id)
        submission.read = True
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update submission', 'details': str(e)}), 500

@api_bp.route('/submissions/stats', methods=['GET'])
def get_stats():
    """Get submission statistics"""
    try:
        contact_count = ContactSubmission.query.count()
        quote_count = QuoteSubmission.query.count()
        unread_contact = ContactSubmission.query.filter_by(read=False).count()
        unread_quote = QuoteSubmission.query.filter_by(read=False).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'contact_total': contact_count,
                'quote_total': quote_count,
                'contact_unread': unread_contact,
                'quote_unread': unread_quote
            }
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch stats', 'details': str(e)}), 500
