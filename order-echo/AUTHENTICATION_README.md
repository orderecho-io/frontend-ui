# Authentication System Documentation

## Overview

This React application now includes a comprehensive, highly secure authentication system with the following features:

- **User Registration & Login** with form validation
- **Password Reset** functionality with email tokens
- **JWT-based Authentication** with secure token management
- **Protected Routes** with automatic redirects
- **Rate Limiting** to prevent brute force attacks
- **Security Headers** and CSRF protection
- **Input Sanitization** to prevent XSS attacks
- **Password Strength Validation** with real-time feedback

## Security Features

### 🔐 Authentication Security
- **JWT Tokens**: Secure, stateless authentication with configurable expiration
- **Password Hashing**: bcrypt with 12 rounds for secure password storage
- **Rate Limiting**: Prevents brute force attacks on authentication endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Password Requirements**: Strong password policy enforcement

### 🛡️ Security Headers
- **Helmet.js**: Comprehensive security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Built-in CSRF token validation
- **Content Security Policy**: Strict CSP rules

### 🚦 Rate Limiting
- **Authentication**: 5 attempts per 15 minutes per IP
- **Password Reset**: 3 attempts per hour per IP
- **General API**: 100 requests per 15 minutes per IP
- **API Endpoints**: 50 requests per 15 minutes per IP

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Authentication state management
├── components/
│   └── auth/
│       └── ProtectedRoute.jsx   # Route protection component
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Signup.jsx              # Registration page
│   ├── ForgotPassword.jsx      # Password reset request
│   ├── ResetPassword.jsx       # Password reset form
│   └── Dashboard.jsx           # Protected dashboard
└── components/layout/
    └── Header.jsx              # Updated with auth navigation

server/
├── auth.js                     # Authentication logic
├── security.js                 # Security configurations
└── index.js                    # Updated server with auth routes
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/signup` | User registration | 5/15min |
| POST | `/api/auth/login` | User login | 5/15min |
| GET | `/api/auth/verify` | Token verification | - |
| POST | `/api/auth/forgot-password` | Request password reset | 3/hour |
| POST | `/api/auth/reset-password` | Reset password | 3/hour |

### Protected Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/user/profile` | User profile | Required |

## Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Server Configuration
PORT=5174
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Start the Development Server

```bash
# Start the backend server
npm run server

# Start the frontend (in another terminal)
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5174
- **Health Check**: http://localhost:5174/api/health

## Usage Examples

### User Registration

```javascript
const { signup } = useAuth();

const handleSignup = async (userData) => {
  const result = await signup({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'SecurePass123!'
  });
  
  if (result.success) {
    // Redirect to login or dashboard
  }
};
```

### User Login

```javascript
const { login } = useAuth();

const handleLogin = async (email, password) => {
  const result = await login(email, password);
  
  if (result.success) {
    // User is logged in, redirect to dashboard
  }
};
```

### Password Reset

```javascript
const { requestPasswordReset } = useAuth();

const handleForgotPassword = async (email) => {
  const result = await requestPasswordReset(email);
  
  if (result.success) {
    // Email sent with reset link
  }
};
```

### Protected Routes

```jsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Protect a route
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requireAuth={true}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Redirect authenticated users away from auth pages
<Route 
  path="/login" 
  element={
    <ProtectedRoute requireAuth={false}>
      <Login />
    </ProtectedRoute>
  } 
/>
```

## Password Requirements

The system enforces strong password requirements:

- **Minimum 8 characters**
- **At least one uppercase letter**
- **At least one lowercase letter**
- **At least one number**
- **At least one special character**

## Security Best Practices

### For Development
1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** in production
3. **Enable HTTPS** in production
4. **Regular security audits** of dependencies

### For Production
1. **Use environment-specific configurations**
2. **Implement proper logging and monitoring**
3. **Set up database persistence** (replace in-memory storage)
4. **Configure email service** for password reset
5. **Enable additional security headers**
6. **Implement session management**

## Database Integration

Currently, the system uses in-memory storage for demo purposes. For production, integrate with a proper database:

```javascript
// Example with PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Replace in-memory storage with database queries
const createUser = async (userData) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, phone, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name, email, phone, created_at
  `;
  
  const result = await pool.query(query, [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.phone,
    userData.password
  ]);
  
  return result.rows[0];
};
```

## Email Integration

For password reset functionality, integrate with an email service:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
```

## Testing

### Manual Testing

1. **Registration Flow**:
   - Navigate to `/signup`
   - Fill out the form with valid data
   - Verify account creation

2. **Login Flow**:
   - Navigate to `/login`
   - Enter credentials
   - Verify successful login and redirect

3. **Password Reset Flow**:
   - Navigate to `/forgot-password`
   - Enter email address
   - Check console for reset token (in development)
   - Use token to reset password

4. **Protected Routes**:
   - Try accessing `/dashboard` without login
   - Verify redirect to login page
   - Login and verify access to dashboard

### Automated Testing

```javascript
// Example test with Jest
import request from 'supertest';
import app from '../server/index.js';

describe('Authentication', () => {
  test('POST /api/auth/signup should create a new user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      password: 'TestPass123!'
    };
    
    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `ALLOWED_ORIGIN` in environment variables
2. **JWT Errors**: Verify `JWT_SECRET` is set and consistent
3. **Rate Limiting**: Check if you've exceeded rate limits
4. **Validation Errors**: Ensure all required fields are provided

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Contributing

When adding new authentication features:

1. **Follow security best practices**
2. **Add proper input validation**
3. **Include rate limiting**
4. **Write comprehensive tests**
5. **Update documentation**

## License

This authentication system is part of the OrderEcho application and follows the same licensing terms.
