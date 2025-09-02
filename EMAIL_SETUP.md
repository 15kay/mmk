# Email Setup Guide - EmailJS Integration

This portfolio website uses EmailJS to send emails directly from the contact form without requiring a backend server.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month)
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Or any other supported service
4. Follow the connection wizard
5. **Important**: Note down your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Set up your template:

**Template Settings:**
- **Template Name**: `Portfolio Contact Form`
- **Subject**: `New Contact from {{from_name}} - {{subject}}`
- **To Email**: Your email address (where you want to receive messages)
- **From Name**: `{{from_name}}`
- **Reply To**: `{{from_email}}`

**Email Body Template:**
```
You have a new message from your portfolio website!

👤 **Contact Details:**
Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

📝 **Message:**
{{message}}

---
🌐 Sent from your portfolio website
📅 {{sent_date}}
```

4. **Important**: Note down your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `user_abc123def456`)
3. Copy this key

### Step 5: Update Configuration
Open `script.js` and update the `EMAILJS_CONFIG` object:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_abc123',     // Your Service ID from Step 2
    templateID: 'template_xyz789',   // Your Template ID from Step 3
    publicKey: 'user_abc123def456'   // Your Public Key from Step 4
};
```

### Step 6: Test the Contact Form
1. Save your changes
2. Refresh your website
3. Fill out the contact form
4. Submit and check your email!

## 🔧 Advanced Configuration

### Custom Email Templates
You can create multiple templates for different purposes:
- Contact inquiries
- Collaboration requests
- Speaking engagements

### Email Validation
The form includes built-in validation:
- Required fields check
- Email format validation
- Message length limits

### Error Handling
The system handles:
- Network errors
- Invalid configurations
- Rate limiting
- Service downtime

## 📊 EmailJS Free Plan Limits
- **200 emails/month** (free tier)
- **50KB** per email
- **2MB** total attachments
- Basic analytics

## 🛡️ Security Features
- No backend server required
- No API keys exposed to users
- Built-in spam protection
- Rate limiting

## 🔍 Troubleshooting

### Common Issues:

**1. "Email service not configured" message**
- Check that all three IDs are correctly set in `EMAILJS_CONFIG`
- Ensure no typos in Service ID, Template ID, or Public Key

**2. Emails not being received**
- Check your spam/junk folder
- Verify the "To Email" in your EmailJS template
- Test with EmailJS dashboard first

**3. "Failed to send" error**
- Check browser console for detailed error messages
- Verify your EmailJS service is active
- Check EmailJS usage limits

**4. Template variables not working**
- Ensure template uses exact variable names: `{{from_name}}`, `{{from_email}}`, etc.
- Check for typos in template variables

### Testing Steps:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Submit a test message
4. Check for any error messages
5. Verify EmailJS dashboard shows the sent email

## 📞 Support
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Available in their dashboard

---

**✅ Once configured, your contact form will send real emails directly to your inbox!**