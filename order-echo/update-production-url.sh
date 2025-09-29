#!/bin/bash

# Production URL Update Script
# Usage: ./update-production-url.sh https://your-backend-server.com

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backend-url>"
    echo "Example: $0 https://your-backend-server.com"
    exit 1
fi

BACKEND_URL=$1
CONFIG_FILE="src/config/api.js"

echo "Updating production URL to: $BACKEND_URL"

# Update the API configuration file
sed -i.bak "s|return 'https://your-backend-server.com';|return '$BACKEND_URL';|g" "$CONFIG_FILE"

echo "✅ Updated $CONFIG_FILE"
echo "🔍 Current configuration:"
grep -A 5 -B 5 "your-backend-server" "$CONFIG_FILE" || echo "Configuration updated successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Build the frontend: npm run build"
echo "2. Deploy the dist/ folder to your hosting service"
echo "3. Test authentication and forms"
echo ""
echo "🧪 Test locally with production build:"
echo "npm run preview"
