#!/usr/bin/env python3
"""
Quick test script to check if login endpoints are working
"""
import requests
import sys

def test_endpoint(url, description):
    try:
        response = requests.get(url, timeout=5)
        print(f"✅ {description}: {response.status_code}")
        if response.status_code != 200:
            print(f"   Response headers: {dict(response.headers)}")
            print(f"   Response text (first 200 chars): {response.text[:200]}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"❌ {description}: Error - {e}")
        return False

def main():
    base_url = "http://localhost:5000"
    
    endpoints = [
        ("/", "Homepage"),
        ("/login", "Login page"), 
        ("/signup?access=visualize-client", "Signup page"),
        ("/dashboard", "Dashboard (should redirect to login)"),
    ]
    
    print("Testing Visualize Studio endpoints...")
    print("=" * 50)
    
    all_good = True
    for path, description in endpoints:
        url = base_url + path
        success = test_endpoint(url, description)
        all_good = all_good and success
        print()
    
    if all_good:
        print("🎉 All primary endpoints are working!")
    else:
        print("⚠️  Some endpoints have issues - check the details above")

if __name__ == "__main__":
    main()