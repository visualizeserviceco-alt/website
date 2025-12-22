# Backend API Setup Guide

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Database Setup

The database will be automatically created when you first run the Flask app. The SQLite database file (`visualize_studio.db`) will be created in the project root.

## Running the Application

### Development
```bash
python app.py
```

The server will start on `http://localhost:5001`

## API Endpoints

### Form Submissions
- `POST /api/contact` - Submit contact form
- `POST /api/quote` - Submit quote request form

### View Submissions (Admin)
- `GET /api/submissions/contact` - Get all contact submissions
- `GET /api/submissions/quote` - Get all quote submissions
- `GET /api/submissions/stats` - Get submission statistics

### Mark as Read
- `PUT /api/submissions/contact/<id>/read` - Mark contact submission as read
- `PUT /api/submissions/quote/<id>/read` - Mark quote submission as read

## Admin Dashboard

Access the admin dashboard at: `http://localhost:5001/admin`

The admin dashboard allows you to:
- View all form submissions
- See unread submission counts
- Mark submissions as read
- Filter between contact forms and quote requests

## Production Deployment

### Environment Variables
Set these environment variables in production:
- `FLASK_CONFIG=production`
- `SECRET_KEY` - Generate a secure secret key
- `DATABASE_URL` - For production, use PostgreSQL or another database (optional, defaults to SQLite)

### Database Migration
For production, consider using Flask-Migrate for database migrations:
```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## Security Notes

⚠️ **Important**: The admin endpoints currently have no authentication. Add authentication before deploying to production:

1. Add login functionality
2. Protect admin routes with authentication
3. Use environment variables for sensitive data
4. Enable HTTPS in production

## Troubleshooting

### Database errors
If you encounter database errors, delete `visualize_studio.db` and restart the app to recreate it.

### CORS errors
CORS is enabled for all origins. In production, restrict CORS to your domain only.
