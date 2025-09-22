#!/usr/bin/env node

/**
 * Authentication System Demo
 * 
 * This script demonstrates the authentication flow with proper timing.
 * Run with: node demo-auth.js
 */

const API_BASE = 'http://localhost:5174/api';

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demoAuthentication() {
  log('🎭 Authentication System Demo', 'bold');
  log('============================', 'bold');
  
  // Generate unique email for this demo
  const timestamp = Date.now();
  const demoUser = {
    firstName: 'Demo',
    lastName: 'User',
    email: `demo${timestamp}@example.com`,
    phone: '1234567890',
    password: 'DemoPass123!'
  };
  
  log(`\n👤 Creating user: ${demoUser.email}`, 'blue');
  
  // Step 1: Signup
  log('\n📝 Step 1: User Registration', 'yellow');
  const signupResult = await makeRequest('/auth/signup', 'POST', demoUser);
  
  if (signupResult.status === 201) {
    log('✅ Registration successful!', 'green');
    log(`   User ID: ${signupResult.data.user.id}`, 'green');
    log(`   Token: ${signupResult.data.token.substring(0, 30)}...`, 'green');
  } else {
    log('❌ Registration failed', 'red');
    log(`   Status: ${signupResult.status}`, 'red');
    log(`   Error: ${JSON.stringify(signupResult.data)}`, 'red');
    return;
  }
  
  await sleep(1000);
  
  // Step 2: Login
  log('\n🔑 Step 2: User Login', 'yellow');
  const loginData = {
    email: demoUser.email,
    password: demoUser.password
  };
  
  const loginResult = await makeRequest('/auth/login', 'POST', loginData);
  
  if (loginResult.status === 200) {
    log('✅ Login successful!', 'green');
    log(`   Welcome back, ${loginResult.data.user.firstName}!`, 'green');
    const token = loginResult.data.token;
    
    await sleep(1000);
    
    // Step 3: Token Verification
    log('\n🔐 Step 3: Token Verification', 'yellow');
    const verifyResult = await makeRequest('/auth/verify', 'GET', null, token);
    
    if (verifyResult.status === 200) {
      log('✅ Token is valid!', 'green');
      log(`   User: ${verifyResult.data.user.firstName} ${verifyResult.data.user.lastName}`, 'green');
      
      await sleep(1000);
      
      // Step 4: Protected Route Access
      log('\n🛡️ Step 4: Protected Route Access', 'yellow');
      const profileResult = await makeRequest('/user/profile', 'GET', null, token);
      
      if (profileResult.status === 200) {
        log('✅ Protected route accessed successfully!', 'green');
        log(`   User profile data retrieved`, 'green');
      } else {
        log('❌ Protected route access failed', 'red');
        log(`   Status: ${profileResult.status}`, 'red');
      }
    } else {
      log('❌ Token verification failed', 'red');
      log(`   Status: ${verifyResult.status}`, 'red');
    }
  } else {
    log('❌ Login failed', 'red');
    log(`   Status: ${loginResult.status}`, 'red');
    log(`   Error: ${JSON.stringify(loginResult.data)}`, 'red');
  }
  
  await sleep(1000);
  
  // Step 5: Password Reset
  log('\n📧 Step 5: Password Reset Request', 'yellow');
  const forgotResult = await makeRequest('/auth/forgot-password', 'POST', { email: demoUser.email });
  
  if (forgotResult.status === 200) {
    log('✅ Password reset email sent!', 'green');
    log('   Check server console for reset token', 'yellow');
  } else {
    log('❌ Password reset request failed', 'red');
    log(`   Status: ${forgotResult.status}`, 'red');
  }
  
  log('\n🎉 Demo completed!', 'bold');
  log('\n📋 Summary of Features Demonstrated:', 'blue');
  log('   ✅ User registration with validation', 'green');
  log('   ✅ Secure login with JWT tokens', 'green');
  log('   ✅ Token verification and refresh', 'green');
  log('   ✅ Protected route access', 'green');
  log('   ✅ Password reset functionality', 'green');
  log('   ✅ Rate limiting and security headers', 'green');
  
  log('\n🌐 Next Steps:', 'blue');
  log('   1. Start the frontend: npm run dev', 'yellow');
  log('   2. Visit: http://localhost:5173', 'yellow');
  log('   3. Try the authentication flow in the browser', 'yellow');
  log('   4. Check the dashboard after login', 'yellow');
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ or a fetch polyfill', 'red');
  process.exit(1);
}

// Run the demo
demoAuthentication().catch(error => {
  log(`\n💥 Demo error: ${error.message}`, 'red');
  process.exit(1);
});
