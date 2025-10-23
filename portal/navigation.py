"""
VISUALIZE STUDIO - NAVIGATION CONTEXT
Provides authentication context for navigation templates
"""

from flask import render_template_string
from flask_login import current_user

def get_navigation_html():
    """
    Generate navigation HTML based on authentication status
    Returns appropriate navigation for logged in vs logged out users
    """
    
    if current_user.is_authenticated:
        # Authenticated user navigation
        nav_template = """
        <header class="vh-header">
          <div class="wrap">
            <div class="brand">
              <img src="/assets/images/Visualize.svg" alt="Visualize Logo" style="height:32px; vertical-align:middle;">
            </div>
            <div class="hamburger" onclick="this.parentElement.querySelector('nav').classList.toggle('active')">
              <span></span><span></span><span></span>
            </div>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/process">Project Process</a></li>
                <li><a href="/payments">Payments</a></li>
                <li><a href="/portal/dashboard">Dashboard</a></li>
                <li><a href="/portal/logout">Sign Out</a></li>
              </ul>
            </nav>
          </div>
        </header>
        """
    else:
        # Public navigation
        nav_template = """
        <header class="vh-header">
          <div class="wrap">
            <div class="brand">
              <img src="/assets/images/Visualize.svg" alt="Visualize Logo" style="height:32px; vertical-align:middle;">
            </div>
            <div class="hamburger" onclick="this.parentElement.querySelector('nav').classList.toggle('active')">
              <span></span><span></span><span></span>
            </div>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/process">Project Process</a></li>
                <li><a href="/payments">Payments</a></li>
                <li><a href="/portal/login">Client Login</a></li>
              </ul>
            </nav>
          </div>
        </header>
        """
    
    return nav_template