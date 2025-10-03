# OrderEcho Frontend Deployment Guide

## Quick Deploy

### Standard Deployment (Recommended)
```bash
# Uses dynamic API URL detection (window.location)
SERVER_IP=3.99.0.53 SERVER_USER=ubuntu ./deploy.sh
```

This will:
1. ✅ Build with today's date as cache-busting version (YYYYMMDD)
2. ✅ Use dynamic API URL (automatically detects from window.location)
3. ✅ Deploy to `/var/www/orderecho/` on the server

### Deploy with Custom API URL
```bash
# Override to use specific API endpoint
API_BASE_URL=https://api.orderecho.io SERVER_IP=3.99.0.53 ./deploy.sh
```

### Deploy with Timestamp Version
```bash
# Use YYYYMMDDHHMM version for multiple deploys per day
SERVER_IP=3.99.0.53 npm run build:prod && rsync -avz --delete dist/ ubuntu@3.99.0.53:/var/www/orderecho/
```

## Manual Build & Deploy

### Step 1: Build
```bash
# Standard build (daily version)
npm run build

# Production build (timestamp version)
npm run build:prod

# Build with custom API URL
VITE_API_BASE_URL=https://api.orderecho.io npm run build

# Build with custom version
VITE_VERSION=v2.0.0 npm run build
```

### Step 2: Verify Build
```bash
ls -la dist/
cat dist/index.html | grep "v="  # Check cache-busting version
```

### Step 3: Deploy to Server
```bash
# Using rsync
rsync -avz --delete dist/ ubuntu@3.99.0.53:/var/www/orderecho/

# Or using scp
scp -r dist/* ubuntu@3.99.0.53:/var/www/orderecho/
```

## API URL Configuration

### How It Works

The frontend automatically detects the API URL:

```
Frontend URL           → Backend API URL
──────────────────────────────────────────────────
localhost:5173         → http://localhost:8000
3.99.0.53              → http://3.99.0.53:8000
orderecho.io           → https://orderecho.io:8000
```

### Environment Variable Override

Create `.env.production` to override:
```bash
VITE_API_BASE_URL=https://api.orderecho.io
```

Or pass as environment variable:
```bash
VITE_API_BASE_URL=https://api.orderecho.io npm run build
```

See [API_CONFIGURATION.md](./API_CONFIGURATION.md) for details.

## Cache-Busting

All assets automatically get version query strings:

```html
<!-- Before (source) -->
<script type="module" src="/src/main.jsx"></script>

<!-- After (built) -->
<script type="module" src="/assets/index-ABC123.js?v=20241003"></script>
<link rel="stylesheet" href="/assets/index-DEF456.css?v=20241003">
```

See [CACHE_BUSTING.md](./CACHE_BUSTING.md) for details.

## Deployment Checklist

Before deploying:

- [ ] Test locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Check `dist/index.html` for version tags
- [ ] Verify API configuration in console
- [ ] Test built version: `npm run preview`

Deploy:

- [ ] Run deploy script or manual rsync
- [ ] Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- [ ] Test on production URL
- [ ] Check console for API URL
- [ ] Test a feature (e.g., submit lead)

## Common Scenarios

### Scenario 1: Deploy to Production Domain

```bash
# Frontend at https://orderecho.io
# Backend at https://orderecho.io:8000 (same domain)
SERVER_IP=3.99.0.53 ./deploy.sh
```

✅ Works automatically with dynamic API detection

### Scenario 2: Deploy with API Subdomain

```bash
# Frontend at https://orderecho.io
# Backend at https://api.orderecho.io (subdomain)
API_BASE_URL=https://api.orderecho.io SERVER_IP=3.99.0.53 ./deploy.sh
```

Requires:
- DNS A record: `api.orderecho.io` → `3.99.0.53`
- SSL on backend

### Scenario 3: Deploy for Testing (IP)

```bash
# Frontend at http://3.99.0.53
# Backend at http://3.99.0.53:8000
SERVER_IP=3.99.0.53 ./deploy.sh
```

✅ Works automatically with dynamic API detection

## Troubleshooting

### Issue: Users see old version

**Solution:** Rebuild and redeploy
```bash
npm run build:prod  # New timestamp version
SERVER_IP=3.99.0.53 ./deploy.sh
```

Users may need to hard refresh: Ctrl+Shift+R

### Issue: API calls fail (404 or Network Error)

**Check 1:** Open browser console, look for API URL
```javascript
console.log('API Base URL:', API_BASE_URL);
```

**Check 2:** Verify backend is running
```bash
ssh ubuntu@3.99.0.53
sudo systemctl status orderecho-backend
curl http://localhost:8000/api/health
```

**Check 3:** Verify CORS settings in backend
```python
# backend/app/main.py
allow_origins=[
    "http://localhost:5173",
    "https://orderecho.io",
    # Add your domain here
]
```

### Issue: Mixed Content Error (HTTPS → HTTP)

```
Blocked: The page at 'https://orderecho.io/' was loaded over HTTPS,
but requested an insecure resource 'http://orderecho.io:8000/api/...'
```

**Solution 1:** Set up SSL on backend (recommended)
- Use Nginx reverse proxy with Let's Encrypt
- Or use CloudFlare for SSL termination

**Solution 2:** Override to use HTTP backend
```bash
API_BASE_URL=http://3.99.0.53:8000 SERVER_IP=3.99.0.53 ./deploy.sh
```

### Issue: 404 for static assets

**Check:** Verify deployment location
```bash
ssh ubuntu@3.99.0.53
ls -la /var/www/orderecho/
```

Should see:
```
index.html
assets/
OrderEcho_logo.jpg
```

## Rollback

If deployment fails, rollback to previous version:

```bash
# Re-deploy from git
git checkout <previous-commit>
npm run build
rsync -avz --delete dist/ ubuntu@3.99.0.53:/var/www/orderecho/
```

Or keep backups:
```bash
# Before deploy
ssh ubuntu@3.99.0.53 "cp -r /var/www/orderecho /var/www/orderecho.backup"

# Rollback
ssh ubuntu@3.99.0.53 "rm -rf /var/www/orderecho && mv /var/www/orderecho.backup /var/www/orderecho"
```

## CI/CD Setup (Optional)

GitHub Actions example:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: VITE_VERSION=$(date +%Y%m%d%H%M) npm run build
      
      - name: Deploy
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SERVER_IP: ${{ secrets.SERVER_IP }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          rsync -avz --delete dist/ ubuntu@$SERVER_IP:/var/www/orderecho/
```

## Summary

### Standard Workflow

1. Make changes to source code
2. Run `npm run build` (or use `deploy.sh`)
3. Deploy to server
4. Test on production URL
5. Users automatically get new version (cache-busting)

### Key Features

✅ **Automatic cache-busting** - users always get latest version  
✅ **Dynamic API detection** - works on any domain  
✅ **No hardcoded IPs** - no manual bundle editing  
✅ **Environment-aware** - dev vs production  
✅ **SSL-ready** - automatically handles HTTPS  

🚀 **Ready to deploy!**
