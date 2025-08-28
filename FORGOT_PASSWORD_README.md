# 🔐 Forgot Password System

## Overview
The Clover Muay Thai application now includes a complete forgot password system that allows users to reset their passwords securely.

## Features

### ✅ **What's Included:**
1. **Forgot Password Link** - Added to the login page
2. **Forgot Password Page** - Where users enter their email
3. **Reset Password Page** - Where users set their new password
4. **Secure Token System** - Time-limited reset tokens
5. **API Endpoints** - Complete backend implementation

### 🔒 **Security Features:**
- **Secure Tokens**: 32-character random hex tokens
- **Time Limitation**: Tokens expire after 1 hour
- **One-time Use**: Tokens are invalidated after use
- **Password Validation**: Minimum 6 characters required
- **Secure Hashing**: Passwords are hashed with bcrypt

## How It Works

### 1. **User Requests Password Reset**
- User clicks "Forgot your password?" on login page
- User enters their email address
- System generates a secure reset token
- Token is stored with 1-hour expiration

### 2. **Password Reset Process**
- User receives reset link (in production, this would be via email)
- User clicks link and is taken to reset password page
- System validates the token
- User enters new password and confirms it
- Password is updated and token is invalidated

### 3. **API Endpoints**

#### `POST /api/auth/forgot-password`
- Accepts email address
- Generates reset token
- Stores token with expiration
- Returns success message

#### `POST /api/auth/validate-reset-token`
- Validates reset token
- Checks if token is expired
- Returns token validity status

#### `POST /api/auth/reset-password`
- Accepts token and new password
- Validates token and password
- Updates user password
- Invalidates used token

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── forgot-password/
│   │   │   └── page.tsx          # Forgot password form
│   │   ├── reset-password/
│   │   │   └── page.tsx          # Reset password form
│   │   └── login/
│   │       └── page.tsx          # Updated with forgot password link
│   └── api/
│       └── auth/
│           ├── forgot-password/
│           │   └── route.ts      # Generate reset token
│           ├── validate-reset-token/
│           │   └── route.ts      # Validate token
│           └── reset-password/
│               └── route.ts      # Reset password
├── contexts/
│   └── AuthContext.tsx           # Updated with forgot password function
└── lib/
    └── bookingUtils.ts           # Existing utility functions

data/
└── reset-tokens.json             # Stores reset tokens
```

## Usage Examples

### **Frontend Integration**
```tsx
import { useAuth } from '@/contexts/AuthContext';

const { forgotPassword } = useAuth();

const handleForgotPassword = async (email: string) => {
  try {
    await forgotPassword(email);
    // Show success message
  } catch (error) {
    // Handle error
  }
};
```

### **Direct API Usage**
```typescript
// Request password reset
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// Validate token
const validateResponse = await fetch('/api/auth/validate-reset-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'reset-token-here' })
});

// Reset password
const resetResponse = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    token: 'reset-token-here',
    password: 'new-password-123'
  })
});
```

## Production Considerations

### **Email Integration**
Currently, the system generates tokens but doesn't send emails. For production:

1. **Add Email Service**: Integrate with services like:
   - SendGrid
   - AWS SES
   - Nodemailer with SMTP

2. **Email Template**: Create professional email templates
3. **Environment Variables**: Store email credentials securely

### **Security Enhancements**
1. **Rate Limiting**: Prevent abuse of forgot password endpoint
2. **Audit Logging**: Log all password reset attempts
3. **IP Tracking**: Track reset requests by IP address
4. **Email Verification**: Ensure email ownership before reset

### **Token Storage**
For production, consider using:
- **Database**: Store tokens in a proper database
- **Redis**: Use Redis for token storage with TTL
- **Vercel KV**: If deploying on Vercel

## Testing

### **Development Mode**
In development, the system returns the reset token in the API response for testing purposes. This should be removed in production.

### **Test Flow**
1. Go to `/auth/login`
2. Click "Forgot your password?"
3. Enter email address
4. Check console for reset token
5. Visit `/auth/reset-password?token=YOUR_TOKEN`
6. Set new password
7. Try logging in with new password

## Troubleshooting

### **Common Issues**
1. **Token Not Found**: Check if token file exists and has correct permissions
2. **Token Expired**: Tokens expire after 1 hour, generate new one
3. **Password Too Short**: Ensure password is at least 6 characters
4. **User Not Found**: Verify user exists in users.json

### **Debug Mode**
Enable debug logging by checking console output for:
- Token generation
- Token validation
- Password update success
- File operations

## Future Enhancements

1. **Email Integration**: Send actual password reset emails
2. **SMS Support**: Add SMS-based password reset
3. **Security Questions**: Implement security questions for additional verification
4. **Password History**: Prevent reuse of recent passwords
5. **Multi-factor Authentication**: Add 2FA support

---

**Note**: This system is designed for development and testing. For production use, implement proper email delivery and consider additional security measures.
