# EmailJS Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com
2. Sign up for a free account (200 emails/month free)

### Step 2: Add Email Service
1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this)

### Step 3: Create Email Templates

#### Contact Form Template:
1. Go to **Email Templates** → **Create New Template**
2. Template Name: "Contact Form"
3. Subject: `New Contact Form Submission from {{from_name}}`
4. Content:
```
From: {{from_name}}
Email: {{from_email}}
Project Type: {{project_type}}

Message:
{{message}}
```
5. **Copy your Template ID** (you'll need this)

#### Quote Form Template:
1. Create another template: "Quote Request"
2. Subject: `New Quote Request from {{from_name}}`
3. Content:
```
From: {{from_name}}
Email: {{from_email}}
Package Interest: {{package}}

Project Details:
{{project_details}}
```
4. **Copy your Template ID** (you'll need this)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find **Public Key**
3. **Copy your Public Key**

### Step 5: Update the Forms

#### In `pages/Contact.html`:
Find these lines and replace:
- `YOUR_PUBLIC_KEY` → Your EmailJS Public Key
- `YOUR_SERVICE_ID` → Your EmailJS Service ID
- `YOUR_TEMPLATE_ID` → Your Contact Form Template ID

#### In `pages/Quote.html`:
Find these lines and replace:
- `YOUR_PUBLIC_KEY` → Your EmailJS Public Key (same as above)
- `YOUR_SERVICE_ID` → Your EmailJS Service ID (same as above)
- `YOUR_QUOTE_TEMPLATE_ID` → Your Quote Request Template ID

### Step 6: Test
1. Deploy your site
2. Submit a test form
3. Check your email inbox!

## Example Configuration

After setup, your Contact.html should have:
```javascript
emailjs.init("abc123xyz");  // Your Public Key

await emailjs.send(
  'service_abc123',  // Your Service ID
  'template_xyz789', // Your Template ID
  templateParams
);
```

## Benefits
- ✅ Works immediately on static sites
- ✅ No backend needed
- ✅ Free tier: 200 emails/month
- ✅ Submissions go directly to your email
- ✅ Works on Vercel, Netlify, any static host

## Troubleshooting

**Forms not sending?**
- Check browser console (F12) for errors
- Verify all IDs are correct
- Make sure EmailJS service is connected
- Check email spam folder

**Need more emails?**
- Upgrade to paid plan ($15/month for 1,000 emails)
- Or use the Flask backend option








