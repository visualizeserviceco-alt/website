"""
Vercel serverless function — creates a Stripe Checkout Session
for custom print order deposits.

Secret key is read from STRIPE_SECRET_KEY environment variable.
Set this in: Vercel Dashboard → Project → Settings → Environment Variables
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import stripe

DEPOSIT_CENTS = 2500  # $25.00 deposit — change here to adjust


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors()
        self.end_headers()

    def do_POST(self):
        try:
            stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')
            if not stripe.api_key:
                self._respond(500, {'error': 'Stripe not configured. Add STRIPE_SECRET_KEY to Vercel env vars.'})
                return

            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            order_summary = data.get('orderSummary', 'Custom Print Order')
            customer_email = data.get('customerEmail', '')
            customer_name = data.get('customerName', '')

            origin = (
                self.headers.get('Origin')
                or self.headers.get('Referer', 'https://visualizestudio.com').rstrip('/')
            )

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                mode='payment',
                customer_email=customer_email or None,
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Custom Print — Order Deposit',
                            'description': order_summary,
                        },
                        'unit_amount': DEPOSIT_CENTS,
                    },
                    'quantity': 1,
                }],
                metadata={
                    'customer_name': customer_name,
                    'order_summary': order_summary,
                },
                success_url=f'{origin}/prints?payment=success',
                cancel_url=f'{origin}/prints?payment=canceled',
            )

            self._respond(200, {'url': session.url})

        except stripe.error.AuthenticationError:
            self._respond(500, {'error': 'Invalid Stripe API key. Check your STRIPE_SECRET_KEY env var.'})
        except stripe.error.StripeError as e:
            self._respond(500, {'error': str(e.user_message or e)})
        except Exception as e:
            self._respond(500, {'error': str(e)})

    def _respond(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self._set_cors()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _set_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
