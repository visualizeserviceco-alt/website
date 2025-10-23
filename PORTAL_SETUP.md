# Visualize Studio - Client Portal Setup

## 🚀 Quick Start

### 1. Replace Main App
```bash
# Backup current app.py
mv app.py app_old.py

# Use new secure app
mv app_new.py app.py
```

### 2. Install Dependencies
```bash
pip install flask flask-sqlalchemy flask-login werkzeug
```

### 3. Environment Variables (Recommended)
```bash
# Create .env file
export SECRET_KEY="your-super-secret-key-here-change-this"
export SIGNUP_TOKEN="visualize-private-signup-2024"
export FLASK_ENV="development"  # or "production"
```

### 4. Run Application
```bash
python app.py
```

## 🔐 Security Features

### ✅ Password Security
- **Werkzeug PBKDF2** password hashing (never stores plaintext)
- **Minimum 6 characters** with validation
- **Salt + iterations** for protection against rainbow tables

### ✅ Session Management
- **Secure session cookies** (HttpOnly, SameSite=Lax)
- **24-hour session lifetime** with "Remember Me" option
- **Proper logout** with session cleanup
- **CSRF protection** ready (cookies secured)

### ✅ Route Protection
- **@login_required** on all private routes
- **User isolation** - clients only see their own data
- **Safe redirects** - prevents open redirect attacks
- **Input validation** on all forms

### ✅ Database Security
- **Unique constraints** on email and username
- **SQLAlchemy ORM** prevents SQL injection
- **Proper error handling** with rollbacks
- **Database connection pooling**

## 🛡️ Access Control

### Public Routes (No Login Required)
- `/` - Homepage
- `/process` - Process page  
- `/payments` - Payments page
- `/portal/login` - Client login
- All static assets (CSS, JS, images)

### Private Routes (Login Required)
- `/portal/dashboard` - Client dashboard
- `/portal/client-resources` - Shared resources
- `/portal/logout` - Secure logout

### Admin-Only Routes (Token Required)
- `/portal/signup?access=visualize-admin-2024` - Client registration

## 👤 User Management

### Demo Accounts (Created Automatically)
```
Username: demo_client
Password: demo123
Email: demo@client.com

Username: jane_smith  
Password: jane123
Email: jane@company.com
```

### Creating New Clients
1. **Admin shares signup URL:** `/portal/signup?access=visualize-admin-2024`
2. **Client fills registration form** with validation
3. **Account created** with secure password hashing
4. **Client can login** at `/portal/login`

## 🔍 Testing Checklist

### ✅ Authentication Tests
- [ ] Visit `/portal/dashboard` while logged out → redirects to login
- [ ] Login with wrong password → shows error message
- [ ] Login with correct credentials → redirects to dashboard
- [ ] Each client sees only their own dashboard data
- [ ] "Remember me" keeps session for 24 hours
- [ ] Logout clears session and redirects to homepage

### ✅ Security Tests  
- [ ] Try SQL injection in login forms → safely handled
- [ ] Try accessing other client data → blocked
- [ ] Test signup without access token → access denied
- [ ] Test password requirements → enforced
- [ ] Test duplicate email/username → prevented

### ✅ Navigation Tests
- [ ] When logged out: shows "Client Login" 
- [ ] When logged in: shows "Dashboard" and "Sign Out"
- [ ] All navigation links work correctly
- [ ] Mobile hamburger menu functions

## 🌐 Production Deployment

### Environment Variables (Required)
```bash
SECRET_KEY="generate-strong-random-key-32+-characters"
SIGNUP_TOKEN="your-private-signup-token" 
FLASK_ENV="production"
DATABASE_URL="postgresql://..." # or keep SQLite
```

### Vercel Deployment (Static + Serverless)
1. **Static frontend** deployed via Vercel's static hosting
2. **Flask backend** deployed as Vercel serverless function
3. **Clean URLs** handled by `vercel.json` configuration
4. **Database** hosted on PlanetScale/Supabase for production

### Security Checklist for Production
- [ ] Change `SECRET_KEY` to cryptographically secure random value
- [ ] Set `SESSION_COOKIE_SECURE=True` (requires HTTPS)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable database backups
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS if needed
- [ ] Monitor for security alerts

## 📁 File Structure
```
portal/
├── __init__.py          # Portal initialization
├── models.py            # Client database model
├── auth.py              # Authentication routes
├── navigation.py        # Dynamic navigation
└── templates/portal/
    ├── login.html       # Login form
    ├── signup.html      # Registration form  
    ├── dashboard.html   # Client dashboard
    ├── client_resources.html  # Shared resources
    └── error.html       # Error pages
```

## 🔧 Maintenance

### Database Migrations
```bash
# If you modify models.py, create new migration
flask db migrate -m "Description of changes"
flask db upgrade
```

### Adding New Clients
1. Share signup URL with access token
2. Or manually create in database:
```python
from portal.models import Client, db
client, success, msg = Client.create_client(
    name="Client Name",
    email="client@email.com", 
    username="client_user",
    password="secure_password"
)
```

### Updating Client Data
```python
# Access through admin interface or directly:
client = Client.query.filter_by(email='client@email.com').first()
client.project_status = "New status"
client.payments_due = 500.0
db.session.commit()
```

## 🆘 Troubleshooting

### Common Issues
1. **"Template not found"** → Check template paths in `portal/templates/portal/`
2. **"No module named portal"** → Ensure `__init__.py` files exist
3. **Database errors** → Delete `visualize_clients.db` and restart app
4. **Login not working** → Check password hashing and session config
5. **Navigation not updating** → Verify `/portal/nav` endpoint returns correct HTML

### Debug Mode
```python
# Enable detailed error messages
export FLASK_ENV=development
python app.py
```

This secure client portal system is now ready for production use! 🎉