"""
Minimal Flask test to verify setup
"""
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello from Flask!"

@app.route('/test')
def test():
    return "Test route working!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)