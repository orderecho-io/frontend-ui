# API Configuration Guide

## Overview

The frontend now uses **dynamic API URL detection** based on `window.location` instead of hardcoded IPs. This means:

✅ No hardcoded IPs in the source code  
✅ Works on any domain without rebuilding  
✅ Automatically handles HTTP/HTTPS  
✅ Can be overridden with environment variables  

## How It Works

### Priority Order

The API base URL is determined in this order:

1. **Environment Variable** (highest priority)
   - `VITE_API_BASE_URL` - if set, this is used
   
2. **Development Detection**
   - If hostname is `localhost` or `127.0.0.1` → `http://localhost:8000`
   
3. **Production - Same Origin**
   - Uses `window.location.protocol` and `window.location.hostname`
   - For `orderecho.io` → `https://orderecho.io:8000`
   - For `3.99.0.53` → `http://3.99.0.53:8000`

### Code Implementation

```javascript
// src/config/api.js
const getApiBaseUrl = () => {
  // 1. Environment variable override
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Development
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  
  // 3. Production - dynamic
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:8000`;
};
```

## Usage Examples

### Example 1: Development
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000 ✅ (automatically detected)
```

### Example 2: Production with IP
```
Frontend: http://3.99.0.53
Backend:  http://3.99.0.53:8000 ✅ (automatically detected)
```

### Example 3: Production with Domain (HTTP)
```
Frontend: http://orderecho.io
Backend:  http://orderecho.io:8000 ✅ (automatically detected)
```

### Example 4: Production with Domain (HTTPS)
```
Frontend: https://orderecho.io
Backend:  https://orderecho.io:8000 ✅ (automatically detected)
```

### Example 5: With Environment Variable Override
```bash
# .env or .env.production
VITE_API_BASE_URL=https://api.orderecho.io

# Result: Uses https://api.orderecho.io (no port 8000)
```

## Environment Variable Setup

### Local Development

Create `.env.local` (not committed to git):

```bash
# Optional: Override default localhost:8000
VITE_API_BASE_URL=http://localhost:8000
```

### Production Deployment

Option A: **No environment variable** (recommended)
- Automatically uses same domain/IP with port 8000
- No configuration needed

Option B: **With environment variable**
```bash
# .env.production
VITE_API_BASE_URL=https://api.orderecho.io
```

Then build:
```bash
npm run build
# or
VITE_API_BASE_URL=https://api.orderecho.io npm run build
```

## Deployment Scenarios

### Scenario 1: Direct IP Access (Current Setup)

**Frontend:** Served on `http://3.99.0.53` (port 80)  
**Backend:** Running on `http://3.99.0.53:8000`

✅ **Works automatically** - No configuration needed

### Scenario 2: Domain with Separate Ports

**Frontend:** Served on `https://orderecho.io` (port 443)  
**Backend:** Running on `https://orderecho.io:8000`

✅ **Works automatically** - No configuration needed  
⚠️ Requires SSL on backend (port 8000)

### Scenario 3: Domain with API Subdomain

**Frontend:** Served on `https://orderecho.io`  
**Backend:** Proxied through `https://api.orderecho.io`

🔧 **Requires configuration:**
```bash
# Set environment variable
VITE_API_BASE_URL=https://api.orderecho.io npm run build
```

Or update code in `src/config/api.js`:
```javascript
if (hostname === 'orderecho.io' || hostname === 'www.orderecho.io') {
  return `${protocol}//api.orderecho.io`; // Uncomment this line
}
```

### Scenario 4: Nginx Reverse Proxy

**Frontend:** `https://orderecho.io`  
**Backend:** Proxied through `https://orderecho.io/api/`

🔧 **Requires configuration:**
```bash
VITE_API_BASE_URL=https://orderecho.io npm run build
```

And Nginx config:
```nginx
location /api/ {
  proxy_pass http://localhost:8000/api/;
}
```

## Benefits of Dynamic Configuration

### Before (Hardcoded IP)
```javascript
// ❌ BAD: Hardcoded IP
return 'http://3.99.0.53:8000';

// Problems:
// - Doesn't work on different servers
// - Requires manual rebuild for each environment
// - Can't handle HTTPS automatically
// - Manual tweaks needed to deployed bundles
```

### After (Dynamic Detection)
```javascript
// ✅ GOOD: Dynamic detection
const protocol = window.location.protocol;
const hostname = window.location.hostname;
return `${protocol}//${hostname}:8000`;

// Benefits:
// - Works on any server automatically
// - No rebuilds needed per environment
// - Handles HTTP/HTTPS automatically
// - No manual tweaks to built files
```

## Debugging

### Check Current Configuration

Open browser console on your deployed site:

```javascript
// See the detected API URL
console.log('API Base URL:', API_BASE_URL);

// Check window.location values
console.log('Protocol:', window.location.protocol);
console.log('Hostname:', window.location.hostname);
console.log('Origin:', window.location.origin);
```

The API configuration automatically logs this on page load.

### Common Issues

#### Issue: Mixed Content Error (HTTPS → HTTP)
```
Frontend: https://orderecho.io
Backend:  http://orderecho.io:8000 ❌
```

**Solution:** Set up SSL on backend or use environment variable:
```bash
VITE_API_BASE_URL=http://3.99.0.53:8000 npm run build
```

#### Issue: CORS Error

**Solution:** Make sure backend CORS includes your frontend domain:
```python
# backend/app/main.py
allow_origins=[
    "http://localhost:5173",
    "https://orderecho.io",
    "https://www.orderecho.io",
]
```

## Migration from Old Config

### Old Code (Removed)
```javascript
// ❌ Hardcoded IPs
if (window.location.hostname === 'orderecho.io') {
  return 'http://3.99.0.53:8000';
}
```

### New Code (Current)
```javascript
// ✅ Dynamic detection
const protocol = window.location.protocol;
const hostname = window.location.hostname;
return `${protocol}//${hostname}:8000`;
```

### What Changed

1. **Removed hardcoded IP addresses**
2. **Added `window.location.protocol` detection** (HTTP/HTTPS)
3. **Added `import.meta.env.VITE_API_BASE_URL` override**
4. **Simplified logic** - works on any domain

## Next Steps

1. ✅ **Current Setup:** Build and deploy - it will work automatically
2. 🔒 **Recommended:** Set up SSL on backend (port 8000) for HTTPS
3. 🌐 **Optional:** Set up `api.orderecho.io` subdomain with DNS
4. 🔄 **Optional:** Set up Nginx reverse proxy to avoid exposing port 8000

## Summary

The API configuration is now **environment-aware** and **domain-agnostic**. It:

- ✅ Automatically detects the correct backend URL
- ✅ Works on localhost, IP addresses, and custom domains
- ✅ Handles HTTP and HTTPS automatically
- ✅ Can be overridden with `VITE_API_BASE_URL` if needed
- ✅ No more manual tweaks to built bundles
- ✅ No more hardcoded IPs in source code

Just build once and deploy anywhere! 🚀

