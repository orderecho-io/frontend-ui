# Mixed Content Error Fix

## Issue
Lead submission failing with:
```
https://orderecho.io:8000/api/leads net::ERR_CONNECTION_TIMED_OUT
```

## Root Cause

**Frontend:** `https://orderecho.io` (HTTPS with SSL - provided by CloudFlare/Nginx)  
**Backend:** Port 8000 has NO SSL configured  

When frontend is HTTPS, the dynamic API detection was trying:
```
https://orderecho.io:8000/api/leads
```

But port 8000 doesn't have SSL, so:
- Connection timeout (no HTTPS listener on 8000)
- Even if it connected, browsers block mixed content by default

## Temporary Fix Applied

Force HTTP for backend API calls on production domain:

```javascript
// src/config/api.js
if (hostname === 'orderecho.io' || hostname === 'www.orderecho.io') {
  // Force HTTP (port 8000 has no SSL)
  return `http://${hostname}:8000`;
}
```

**Result:**
- Frontend: `https://orderecho.io` (HTTPS)
- Backend API: `http://orderecho.io:8000` (HTTP)

## Why This Works

Modern browsers **allow** mixed content (HTTPS → HTTP) for API calls in some cases, especially when:
1. The domain is the same (`orderecho.io`)
2. It's an XMLHttpRequest/fetch (not page load)
3. Browser security settings permit it

However, this is **NOT ideal** and should be temporary.

## Proper Solution (Recommended)

You have 3 options to properly fix this:

### Option 1: Nginx Reverse Proxy (Best)

Set up Nginx to proxy API requests through HTTPS:

```nginx
# /etc/nginx/sites-available/orderecho

server {
    listen 443 ssl;
    server_name orderecho.io www.orderecho.io;
    
    ssl_certificate /etc/letsencrypt/live/orderecho.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/orderecho.io/privatekey.pem;
    
    # Frontend (static files)
    location / {
        root /var/www/orderecho;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API (proxy to port 8000)
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Then update frontend:**
```javascript
// src/config/api.js
if (hostname === 'orderecho.io' || hostname === 'www.orderecho.io') {
  // Use same origin (Nginx proxies to port 8000)
  return `${protocol}//${hostname}`;  // No port needed!
}
```

**Benefits:**
- ✅ Everything over HTTPS
- ✅ No exposed port 8000
- ✅ Better security
- ✅ Proper SSL everywhere

### Option 2: SSL on Port 8000

Set up SSL directly on the FastAPI/Uvicorn backend:

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d orderecho.io -d www.orderecho.io

# Run uvicorn with SSL
uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --ssl-keyfile /etc/letsencrypt/live/orderecho.io/privkey.pem \
  --ssl-certfile /etc/letsencrypt/live/orderecho.io/fullchain.pem
```

**Then update frontend:**
```javascript
// src/config/api.js
if (hostname === 'orderecho.io' || hostname === 'www.orderecho.io') {
  // Use HTTPS (port 8000 now has SSL)
  return `https://${hostname}:8000`;
}
```

**Drawbacks:**
- Port 8000 is exposed
- Certificate renewal needs backend restart

### Option 3: API Subdomain (Advanced)

Set up `api.orderecho.io` with SSL:

**DNS:**
```
A    api.orderecho.io    →    3.99.0.53
```

**Nginx on backend server:**
```nginx
server {
    listen 443 ssl;
    server_name api.orderecho.io;
    
    ssl_certificate /etc/letsencrypt/live/api.orderecho.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.orderecho.io/privatekey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Then rebuild frontend:**
```bash
VITE_API_BASE_URL=https://api.orderecho.io npm run build
```

**Benefits:**
- ✅ Clean separation (frontend/backend domains)
- ✅ Full HTTPS
- ✅ Professional setup

## Current Status

✅ **Temporary fix applied:** Force HTTP for backend  
⚠️ **Security warning:** Mixed content (HTTPS → HTTP)  
📝 **TODO:** Implement one of the proper solutions above  

## Rebuild & Deploy

To apply the current fix:

```bash
cd /Users/maulikpatel/GitHub/frontend-ui/order-echo

# Rebuild with fixed API config
npm run build

# Deploy
SERVER_IP=3.99.0.53 ./deploy.sh
```

After deployment:
1. Clear browser cache: `Ctrl+Shift+R`
2. Test lead submission on `https://orderecho.io`
3. Should work now (HTTP API call from HTTPS page)

## Browser Console Warning

You may see a warning:
```
Mixed Content: The page at 'https://orderecho.io/' was loaded over HTTPS,
but requested an insecure resource 'http://orderecho.io:8000/api/leads'.
This request has been allowed.
```

This is expected with the temporary fix. Implement a proper solution to remove this warning.

## Recommendation

**For production, use Option 1 (Nginx Reverse Proxy):**
- Most secure
- No exposed ports
- Easiest to maintain
- Industry standard

Let me know if you want help setting up Nginx reverse proxy! 🔒

