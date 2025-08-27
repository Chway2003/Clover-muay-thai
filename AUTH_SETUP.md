# Authentication System Setup

## Overview
The Clover Muay Thai website now includes a complete authentication system with user registration and login functionality.

## Features
- ✅ User registration with email, name, and password
- ✅ Secure password hashing using bcryptjs
- ✅ User login with JWT token authentication
- ✅ Automatic login after successful registration
- ✅ Form validation and error handling
- ✅ Responsive design matching the site's theme
- ✅ Persistent authentication state

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change the JWT_SECRET to a strong, random string in production!

### 2. Dependencies
The required packages are already installed:
- `bcryptjs` - for password hashing
- `jsonwebtoken` - for JWT token generation
- `@types/bcryptjs` and `@types/jsonwebtoken` - TypeScript types

### 3. Data Storage
User data is stored in `data/users.json`. The system will automatically create this file if it doesn't exist.

## API Endpoints

### POST /api/auth/register
Registers a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-21T10:00:00.000Z"
  }
}
```

### POST /api/auth/login
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-21T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Features

### Password Requirements
- Minimum 6 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number

### Data Protection
- Passwords are hashed using bcryptjs with 12 salt rounds
- JWT tokens expire after 7 days
- User passwords are never stored in plain text
- Input validation on both frontend and backend

## Usage

### Registration Flow
1. User visits `/auth/register`
2. Fills out the registration form
3. System validates input and creates account
4. User is automatically logged in
5. Redirected to home page

### Login Flow
1. User visits `/auth/login`
2. Enters email and password
3. System validates credentials
4. JWT token is generated and stored
5. User is redirected to home page

### Authentication State
- User authentication state is managed by `AuthContext`
- Tokens are stored in localStorage
- Authentication persists across page refreshes
- Header automatically shows login/logout options based on auth state

## Testing

### Test User
A test user is already created in `data/users.json`:
- Email: `test@test.com`
- Password: `test123`

### Manual Testing
1. Start the development server: `npm run dev`
2. Visit `/auth/register` to test registration
3. Visit `/auth/login` to test login
4. Check that the header updates based on authentication state

## Future Enhancements

### Recommended Improvements
- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add user profile management
- [ ] Integrate with a real database (PostgreSQL, MongoDB, etc.)
- [ ] Add rate limiting for API endpoints
- [ ] Implement refresh token rotation
- [ ] Add social authentication (Google, Facebook, etc.)

### Database Migration
When ready to move to a production database:
1. Update the API routes to use database queries instead of file operations
2. Add proper database connection handling
3. Implement database migrations for user schema
4. Add connection pooling and optimization

## Troubleshooting

### Common Issues

**"Module not found" errors:**
- Ensure all dependencies are installed: `npm install`

**JWT token errors:**
- Check that JWT_SECRET is set in `.env.local`
- Verify the secret is the same across server restarts

**User registration fails:**
- Check that `data/` directory exists and is writable
- Verify the users.json file format is correct

**Login not working:**
- Ensure the user exists in users.json
- Check that passwords match the hashed versions

## Support
For issues or questions about the authentication system, check the console logs and network tab in your browser's developer tools for detailed error information.
