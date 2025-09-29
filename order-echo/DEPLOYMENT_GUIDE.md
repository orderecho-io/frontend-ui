# Production Deployment Guide for OrderEcho Frontend

## 🚀 AWS Deployment Configuration

### 1. Backend Server Setup
Before deploying the frontend, you need to deploy your backend server to AWS. Here are the options:

#### Option A: AWS EC2 Instance
1. Launch an EC2 instance (t2.micro for testing)
2. Install Node.js and your backend dependencies
3. Run your backend server on port 80 or 443
4. Configure security groups to allow HTTP/HTTPS traffic

#### Option B: AWS Elastic Beanstalk
1. Package your backend server
2. Deploy to Elastic Beanstalk
3. Get the provided URL (e.g., `https://your-app.elasticbeanstalk.com`)

#### Option C: AWS Lambda + API Gateway
1. Convert your Express server to Lambda functions
2. Set up API Gateway
3. Get the API Gateway URL

### 2. Frontend Configuration

#### Update API Configuration
Edit `src/config/api.js` and replace the production URL:

```javascript
const getApiBaseUrl = () => {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Replace with your actual AWS backend URL
    return 'https://your-backend-server.com'; // ← UPDATE THIS
  }
  return 'http://localhost:5174';
};
```

#### Environment Variables (Alternative)
You can also use environment variables. Create a `.env.production` file:

```bash
VITE_API_BASE_URL=https://your-backend-server.com
```

Then update `src/config/api.js`:
```javascript
const getApiBaseUrl = () => {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-server.com';
  }
  return 'http://localhost:5174';
};
```

### 3. Frontend Deployment Options

#### Option A: AWS S3 + CloudFront
1. Build the frontend: `npm run build`
2. Upload `dist/` folder to S3 bucket
3. Configure S3 bucket for static website hosting
4. Set up CloudFront distribution for better performance

#### Option B: AWS Amplify
1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
3. Deploy automatically on git push

#### Option C: Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### 4. CORS Configuration

Make sure your backend server allows CORS from your frontend domain:

```javascript
// In your backend server
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'https://your-frontend-domain.com' // Production
  ],
  credentials: true
}));
```

### 5. Testing Checklist

- [ ] Backend server is running on AWS
- [ ] Frontend can connect to backend API
- [ ] Authentication works (login/signup)
- [ ] Lead forms submit successfully
- [ ] Dashboard loads with data
- [ ] All pages navigate correctly

### 6. Common Issues

#### CORS Errors
- Check backend CORS configuration
- Ensure frontend domain is whitelisted

#### 404 Errors
- Verify API endpoints match between frontend and backend
- Check if backend routes are properly configured

#### Authentication Issues
- Verify JWT token handling
- Check if backend auth endpoints are working
- Ensure HTTPS is used in production

### 7. Security Considerations

- Use HTTPS for all production URLs
- Implement proper CORS policies
- Use environment variables for sensitive data
- Enable security headers
- Consider using AWS WAF for additional protection

## 🔧 Quick Fix Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Check for hardcoded URLs
grep -r "localhost" src/

# Verify API configuration
grep -r "API_BASE_URL" src/
```
