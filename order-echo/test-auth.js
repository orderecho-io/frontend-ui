#!/usr/bin/env node

/**
 * Authentication System Test Script
 * 
 * This script tests the authentication endpoints to ensure they're working correctly.
 * Run with: node test-auth.js
 */

const API_BASE = 'http://localhost:5174/api';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '1234567890',
  password: 'TestPass123!'
};

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, data: { error: error.message } };
  }
}

async function testHealthCheck() {
  log('\n🔍 Testing Health Check...', 'blue');
  const result = await makeRequest('/health');
  
  if (result.status === 200 && result.data.ok) {
    log('✅ Health check passed', 'green');
    return true;
  } else {
    log('❌ Health check failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return false;
  }
}

async function testSignup() {
  log('\n📝 Testing User Signup...', 'blue');
  const result = await makeRequest('/auth/signup', 'POST', testUser);
  
  if (result.status === 201 && result.data.user) {
    log('✅ Signup successful', 'green');
    log(`User ID: ${result.data.user.id}`, 'green');
    return result.data.token;
  } else {
    log('❌ Signup failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return null;
  }
}

async function testLogin() {
  log('\n🔑 Testing User Login...', 'blue');
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await makeRequest('/auth/login', 'POST', loginData);
  
  if (result.status === 200 && result.data.token) {
    log('✅ Login successful', 'green');
    log(`Token: ${result.data.token.substring(0, 20)}...`, 'green');
    return result.data.token;
  } else {
    log('❌ Login failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return null;
  }
}

async function testTokenVerification(token) {
  log('\n🔐 Testing Token Verification...', 'blue');
  const result = await makeRequest('/auth/verify', 'GET', null, token);
  
  if (result.status === 200 && result.data.user) {
    log('✅ Token verification successful', 'green');
    log(`User: ${result.data.user.firstName} ${result.data.user.lastName}`, 'green');
    return true;
  } else {
    log('❌ Token verification failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return false;
  }
}

async function testProtectedRoute(token) {
  log('\n🛡️ Testing Protected Route...', 'blue');
  const result = await makeRequest('/user/profile', 'GET', null, token);
  
  if (result.status === 200 && result.data.user) {
    log('✅ Protected route access successful', 'green');
    return true;
  } else {
    log('❌ Protected route access failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return false;
  }
}

async function testForgotPassword() {
  log('\n📧 Testing Forgot Password...', 'blue');
  const result = await makeRequest('/auth/forgot-password', 'POST', { email: testUser.email });
  
  if (result.status === 200) {
    log('✅ Forgot password request successful', 'green');
    log('Check server console for reset token', 'yellow');
    return true;
  } else {
    log('❌ Forgot password request failed', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return false;
  }
}

async function testInvalidCredentials() {
  log('\n🚫 Testing Invalid Credentials...', 'blue');
  const invalidLoginData = {
    email: testUser.email,
    password: 'wrongpassword'
  };
  
  const result = await makeRequest('/auth/login', 'POST', invalidLoginData);
  
  if (result.status === 401) {
    log('✅ Invalid credentials properly rejected', 'green');
    return true;
  } else {
    log('❌ Invalid credentials not properly rejected', 'red');
    log(`Status: ${result.status}`, 'red');
    log(`Response: ${JSON.stringify(result.data)}`, 'red');
    return false;
  }
}

async function testRateLimiting() {
  log('\n⏱️ Testing Rate Limiting...', 'blue');
  log('Making multiple rapid requests...', 'yellow');
  
  const promises = [];
  for (let i = 0; i < 6; i++) {
    promises.push(makeRequest('/auth/login', 'POST', { email: 'test@example.com', password: 'wrong' }));
  }
  
  const results = await Promise.all(promises);
  const rateLimited = results.some(result => result.status === 429);
  
  if (rateLimited) {
    log('✅ Rate limiting working correctly', 'green');
    return true;
  } else {
    log('❌ Rate limiting not working', 'red');
    return false;
  }
}

async function runTests() {
  log('🚀 Starting Authentication System Tests', 'bold');
  log('=====================================', 'bold');
  
  const results = {
    healthCheck: false,
    signup: false,
    login: false,
    tokenVerification: false,
    protectedRoute: false,
    forgotPassword: false,
    invalidCredentials: false,
    rateLimiting: false
  };
  
  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();
  if (!results.healthCheck) {
    log('\n❌ Server is not running. Please start the server first.', 'red');
    process.exit(1);
  }
  
  // Test 2: Signup
  const signupToken = await testSignup();
  results.signup = signupToken !== null;
  
  // Test 3: Login
  const loginToken = await testLogin();
  results.login = loginToken !== null;
  
  // Test 4: Token Verification
  if (loginToken) {
    results.tokenVerification = await testTokenVerification(loginToken);
  }
  
  // Test 5: Protected Route
  if (loginToken) {
    results.protectedRoute = await testProtectedRoute(loginToken);
  }
  
  // Test 6: Forgot Password
  results.forgotPassword = await testForgotPassword();
  
  // Test 7: Invalid Credentials
  results.invalidCredentials = await testInvalidCredentials();
  
  // Test 8: Rate Limiting
  results.rateLimiting = await testRateLimiting();
  
  // Summary
  log('\n📊 Test Results Summary', 'bold');
  log('======================', 'bold');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${test}: ${passed ? 'PASSED' : 'FAILED'}`, color);
  });
  
  log(`\n🎯 Overall: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Authentication system is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please check the server logs and configuration.', 'yellow');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ or a fetch polyfill', 'red');
  process.exit(1);
}

// Run the tests
runTests().catch(error => {
  log(`\n💥 Test runner error: ${error.message}`, 'red');
  process.exit(1);
});
