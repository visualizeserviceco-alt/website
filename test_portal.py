#!/usr/bin/env python3
"""
Test script for Visualize Studio Client Portal
"""

import requests
import sys

BASE_URL = "http://localhost:5000"

def test_routes():
    """Test all main routes"""
    print("🧪 Testing Visualize Studio Client Portal...")
    
    # Test main website
    print("\n1. Testing main website...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Main page: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test login page
    print("\n2. Testing login page...")
    try:
        response = requests.get(f"{BASE_URL}/login")
        print(f"   Login page: {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test protected dashboard (should redirect to login)
    print("\n3. Testing protected dashboard...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard", allow_redirects=False)
        print(f"   Dashboard (no auth): {response.status_code} (should be 302 redirect)")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test signup with correct token
    print("\n4. Testing signup page with correct token...")
    try:
        response = requests.get(f"{BASE_URL}/signup?access=visualize-client")
        print(f"   Signup (correct token): {response.status_code}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test signup with wrong token
    print("\n5. Testing signup page with wrong token...")
    try:
        response = requests.get(f"{BASE_URL}/signup?access=wrong")
        print(f"   Signup (wrong token): {response.status_code} (should redirect)")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test login with demo credentials
    print("\n6. Testing login with demo credentials...")
    try:
        session = requests.Session()
        login_data = {
            'username': 'demo_client',
            'password': 'demo123'
        }
        response = session.post(f"{BASE_URL}/login", data=login_data, allow_redirects=False)
        print(f"   Login POST: {response.status_code} (should be 302 redirect to dashboard)")
        
        # Now try to access dashboard with session
        if response.status_code == 302:
            dashboard_response = session.get(f"{BASE_URL}/dashboard")
            print(f"   Dashboard (authenticated): {dashboard_response.status_code}")
            
            # Test client resources
            resources_response = session.get(f"{BASE_URL}/client-info")
            print(f"   Client resources: {resources_response.status_code}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n✅ Testing complete!")

if __name__ == "__main__":
    test_routes()