#!/bin/bash
# Frontend deployment script with automatic cache-busting

set -e

echo "🚀 OrderEcho Frontend Deployment"
echo "=================================="

# Get version (YYYYMMDD format)
VERSION=$(date +%Y%m%d)
echo "📅 Version: $VERSION"

# API Base URL (optional override)
if [ ! -z "$API_BASE_URL" ]; then
  echo "🔗 API Base URL: $API_BASE_URL (override)"
  export VITE_API_BASE_URL=$API_BASE_URL
else
  echo "🔗 API Base URL: Dynamic (will use window.location)"
fi

# Build with version
echo ""
echo "📦 Building frontend with cache-busting..."
VITE_VERSION=$VERSION npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not found"
  exit 1
fi

echo "✅ Build complete!"
echo ""
echo "📂 Built files:"
ls -lh dist/

# If SERVER_IP is provided, deploy to server
if [ ! -z "$SERVER_IP" ]; then
  echo ""
  echo "🌐 Deploying to server: $SERVER_IP"
  
  # Use rsync to deploy
  rsync -avz --delete dist/ ${SERVER_USER:-ubuntu}@$SERVER_IP:/var/www/orderecho/
  
  echo "✅ Deployment complete!"
  echo ""
  echo "🔗 Your site should now be live with version: $VERSION"
else
  echo ""
  echo "ℹ️  To deploy to server, run:"
  echo "   SERVER_IP=your.server.ip ./deploy.sh"
  echo ""
  echo "ℹ️  To deploy with custom API URL:"
  echo "   API_BASE_URL=https://api.orderecho.io SERVER_IP=your.server.ip ./deploy.sh"
fi

echo ""
echo "✅ Done!"

