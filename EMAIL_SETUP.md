# Email Configuration for Password Reset

## Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# SMTP Configuration (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=clovermuaythai@gmail.com
SMTP_PASS=your_app_password_here

# Base URL for password reset links
NEXT_PUBLIC_BASE_URL=https://www.clovermuaythai.com

# JWT Secret (for token signing)
JWT_SECRET=your-secret-key-change-in-production
```

## Gmail Setup

To use Gmail for sending password reset emails:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative Email Providers

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your_app_password
```

## Testing

The system includes a test endpoint to verify email configuration:

```javascript
// Test in browser console
fetch('/api/admin/test-email', { method: 'POST' })
  .then(response => response.json())
  .then(data => console.log(data));
```

## Security Notes

- Never commit real email credentials to version control
- Use app passwords instead of your main account password
- Consider using a dedicated email service like SendGrid for production
- The system prevents email enumeration attacks by always returning success




