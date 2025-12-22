#!/usr/bin/env python3
"""
Simple test script to verify API endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_api_connection():
    """Test if API is accessible"""
    try:
        response = requests.get(f"{BASE_URL}/api/test")
        print(f"✓ API Test Endpoint: {response.status_code}")
        print(f"  Response: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ API Test Failed: {e}")
        print("  Make sure the Flask server is running: python app.py")
        return False

def test_contact_submission():
    """Test contact form submission"""
    try:
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "project": "Website Design",
            "message": "This is a test message"
        }
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"\n✓ Contact Form Submission: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"\n✗ Contact Form Test Failed: {e}")
        return False

def test_quote_submission():
    """Test quote form submission"""
    try:
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "package": "Branding & Design",
            "project": "This is a test quote request"
        }
        response = requests.post(
            f"{BASE_URL}/api/quote",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"\n✓ Quote Form Submission: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"\n✗ Quote Form Test Failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Visualize Studio API Endpoints\n")
    print("=" * 50)
    
    if test_api_connection():
        test_contact_submission()
        test_quote_submission()
    
    print("\n" + "=" * 50)
    print("Test complete!")
