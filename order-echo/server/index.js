import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { appendLeadToSheet } from './googleSheets.js';
import {
  signup,
  login,
  verifyToken,
  forgotPassword,
  resetPassword,
  authenticateToken,
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from './auth.js';
import {
  securityConfig,
  sanitizeInput,
  securityHeaders,
  corsConfig,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from './security.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5174;

// Security middleware
app.use(securityConfig.helmet);
app.use(securityHeaders);
app.use(cors(corsConfig));
app.use(requestLogger);
app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Apply general rate limiting
app.use(securityConfig.generalRateLimit);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'order-echo-api' });
});

// Authentication routes with rate limiting
app.post('/api/auth/signup', securityConfig.authRateLimit, signupValidation, signup);
app.post('/api/auth/login', securityConfig.authRateLimit, loginValidation, login);
app.get('/api/auth/verify', authenticateToken, verifyToken);
app.post('/api/auth/forgot-password', securityConfig.passwordResetRateLimit, forgotPasswordValidation, forgotPassword);
app.post('/api/auth/reset-password', securityConfig.passwordResetRateLimit, resetPasswordValidation, resetPassword);

// Protected routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'User profile endpoint',
    user: req.user,
  });
});

// Lead capture endpoint (existing)
app.post('/api/leads', securityConfig.apiRateLimit, async (req, res) => {
  try {
    const lead = req.body || {};
    await appendLeadToSheet(lead);
    res.json({ ok: true });
  } catch (err) {
    console.error('Lead append failed:', err);
    res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
  }
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 API server listening on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🔐 Authentication endpoints available`);
  console.log(`🛡️  Security middleware enabled`);
});

