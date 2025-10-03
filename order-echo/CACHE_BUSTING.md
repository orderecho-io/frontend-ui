# Cache-Busting Setup for OrderEcho Frontend

## Overview

This project uses **automatic cache-busting** with version query strings to ensure users always get the latest version of your app after deployment.

## How It Works

### 1. Build-Time Version Injection

The `vite.config.js` uses a custom plugin to add version query strings to HTML references:

```javascript
// Plugin transforms HTML to add version query strings
function versionPlugin() {
  return {
    name: 'html-version-transform',
    transformIndexHtml(html) {
      return html.replace(
        /(href|src)="([^"]+\.(js|css|png|jpg|jpeg|svg|gif|webp))"/g,
        `$1="$2?v=${version}"`
      )
    }
  }
}

// Result: <script src="/assets/index-ABC123.js?v=20241003">
// File on disk: /assets/index-ABC123.js (no query string)
```

**Important:** The query string is added to the HTML `src` and `href` attributes, NOT to the actual file names. This ensures proper MIME type detection by the server.

### 2. Version Generation

The version is automatically generated based on the current date:

- **Format**: `YYYYMMDD` (e.g., `20241003` for October 3, 2024)
- **Source**: Set via `VITE_VERSION` environment variable or defaults to current date

### 3. Build Commands

#### Development
```bash
npm run dev
# No cache-busting in dev mode
```

#### Production Build
```bash
npm run build
# Uses version: YYYYMMDD (e.g., 20241003)
```

#### Production Build with Timestamp
```bash
npm run build:prod
# Uses version: YYYYMMDDHHMM (e.g., 202410031430)
```

#### Custom Version
```bash
VITE_VERSION=v2.0.0 npm run build
# Uses version: v2.0.0
```

## Deployment

### Option 1: Using Deploy Script

```bash
# Deploy to server with automatic versioning
SERVER_IP=3.99.0.53 SERVER_USER=ubuntu ./deploy.sh
```

The `deploy.sh` script will:
1. ✅ Generate version based on current date
2. ✅ Build the frontend with cache-busting
3. ✅ Deploy to `/var/www/orderecho/` on the server
4. ✅ Display the version deployed

### Option 2: Manual Deployment

```bash
# Build
npm run build

# Deploy
rsync -avz --delete dist/ ubuntu@3.99.0.53:/var/www/orderecho/
```

## What Gets Cache-Busted

All built assets will have version query strings:

- ✅ JavaScript files: `index-ABC123.js?v=20241003`
- ✅ CSS files: `index-DEF456.css?v=20241003`
- ✅ Images: `logo-GHI789.png?v=20241003`
- ✅ All other assets

## Example Output

After building, your `dist/index.html` will look like:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/OrderEcho_logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OrderEcho - AI-Powered Restaurant Ordering</title>
    <script type="module" crossorigin src="/assets/index-mKAwKRU-.js?v=20241003"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-CFph03l8.css?v=20241003">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Benefits

1. **Automatic**: No manual version management needed
2. **Browser Cache**: Users get fresh code after each deployment
3. **Performance**: Assets are still cached between deployments
4. **Debug-Friendly**: Version number visible in URLs
5. **Git-Friendly**: No need to commit built files with versions

## CI/CD Integration

If you set up GitHub Actions or other CI/CD:

```yaml
- name: Build Frontend
  run: |
    cd frontend-ui/order-echo
    VITE_VERSION=$(date +%Y%m%d%H%M) npm run build
    
- name: Deploy Frontend
  run: |
    rsync -avz --delete dist/ ubuntu@$SERVER_IP:/var/www/orderecho/
```

## Troubleshooting

### Issue: Users seeing old version

**Solution**: Check that the version query string is present in deployed HTML:
```bash
curl https://orderecho.io/ | grep "v="
```

### Issue: Version not changing

**Solution**: Make sure to rebuild before deploying:
```bash
npm run build  # Generates new version
# Then deploy
```

### Issue: 404 errors for assets

**Solution**: The query string doesn't change the file path. The actual files don't have `?v=` in their names:
- File on disk: `index-ABC123.js`
- URL with cache-bust: `index-ABC123.js?v=20241003`

## Source Control

The `index.html` in your **source code** (this repo) should NOT have version tags:

```html
<!-- ✅ CORRECT: Source index.html (in git) -->
<script type="module" src="/src/main.jsx"></script>

<!-- ❌ WRONG: Don't commit built HTML with versions -->
<script type="module" src="/assets/index-ABC.js?v=20241003"></script>
```

Vite automatically adds the version tags during the build process.

## Summary

✅ **You're all set!** Just run `npm run build` and deploy. The cache-busting happens automatically.

📅 Each deployment gets a unique version based on the build date.

🚀 Users always get the latest version after deployment.

