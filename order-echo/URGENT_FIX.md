# URGENT: Cache-Busting Fix Applied

## Issue
Website was broken with blank page and error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script 
but the server responded with a MIME type of "text/html"
```

## Root Cause
The previous cache-busting implementation added query strings to the **file names** instead of just the HTML references:

❌ **Wrong:** File path was `assets/index-ABC123.js?v=20241003`
- Server didn't recognize `?v=20241003` as part of the extension
- Returned `text/html` MIME type instead of `application/javascript`
- Browser rejected the module due to strict MIME type checking

## Fix Applied
Changed strategy to add query strings to **HTML references only**:

✅ **Correct:** 
- File on disk: `assets/index-ABC123.js`
- HTML reference: `<script src="/assets/index-ABC123.js?v=20241003">`
- Server correctly identifies `.js` extension
- Returns proper `application/javascript` MIME type
- Browser loads module successfully

## Implementation
```javascript
// vite.config.js - Custom plugin
function versionPlugin() {
  return {
    name: 'html-version-transform',
    transformIndexHtml(html) {
      // Add ?v= to src/href attributes in HTML
      return html.replace(
        /(href|src)="([^"]+\.(js|css|png|jpg|jpeg|svg|gif|webp))"/g,
        `$1="$2?v=${version}"`
      )
    }
  }
}
```

## What Changed
- ❌ Removed: `rollupOptions.output` file name configuration
- ✅ Added: Custom Vite plugin to transform HTML
- ✅ Result: Query strings in HTML, clean file names

## To Fix Deployed Site

### Step 1: Rebuild
```bash
cd /Users/maulikpatel/GitHub/frontend-ui/order-echo
npm run build
```

### Step 2: Verify Build
```bash
# Check that files have clean names
ls -la dist/assets/
# Should see: index-ABC123.js (not index-ABC123.js?v=...)

# Check that HTML has version query strings
cat dist/index.html | grep "v="
# Should see: <script src="/assets/index-ABC123.js?v=20241003">
```

### Step 3: Deploy
```bash
SERVER_IP=3.99.0.53 SERVER_USER=ubuntu ./deploy.sh
```

Or manually:
```bash
rsync -avz --delete dist/ ubuntu@3.99.0.53:/var/www/orderecho/
```

### Step 4: Test
1. Clear browser cache: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Visit `https://orderecho.io`
3. Page should load correctly
4. Check browser console - no MIME type errors

## Cache-Busting Still Works

✅ **Yes!** Cache-busting still works perfectly:

1. Browser requests: `/assets/index-ABC123.js?v=20241003`
2. Server serves: `/assets/index-ABC123.js` (ignores query string)
3. Browser caches with full URL including `?v=20241003`
4. Next build generates new version: `?v=20241004`
5. Browser sees different URL, fetches new file
6. Old cached version is bypassed

## Testing
```bash
# Build and preview locally
npm run build
npm run preview

# Open http://localhost:4173
# Should work without MIME type errors
```

## Summary

🔴 **Problem:** Query strings in file names broke MIME type detection  
🟢 **Solution:** Query strings only in HTML references  
✅ **Result:** Website loads correctly + cache-busting works  

⚡ **Action Required:** Rebuild and redeploy immediately!

```bash
# Quick fix command
npm run build && SERVER_IP=3.99.0.53 ./deploy.sh
```

