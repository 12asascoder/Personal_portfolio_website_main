# Deployment Guide

This guide covers deploying the Arnav Portfolio project to Render (backend) and Vercel (frontend).

## Architecture

- **Backend**: Node.js/Express API deployed on Render
- **Frontend**: React/Vite app deployed on Vercel
- **Communication**: Frontend makes API calls to backend via CORS-enabled endpoints

## Backend Deployment (Render)

### Prerequisites
1. GitHub repository with the code
2. Render account (free tier available)

### Steps

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **IMPORTANT**: Set the "Root Directory" to `backend` (this is crucial!)

2. **Configure Service**
   - **Name**: `arnav-portfolio-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Environment Variables**
   Set the following environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   GITHUB_USERNAME=your-github-username
   AVATAR_URL=https://your-avatar-url.com
   LINKEDIN_URL=https://linkedin.com/in/your-profile
   CV_URL=https://your-cv-url.com
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Note the service URL (e.g., `https://arnav-portfolio-backend.onrender.com`)https://personal-portfolio-website-main-1.onrender.com/

## Frontend Deployment (Vercel)

### Prerequisites
1. GitHub repository with the code
2. Vercel account (free tier available)

### Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   Set the following environment variable in Vercel:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend
   - Note the deployment URL (e.g., `https://arnav-portfolio.vercel.app`)

## Post-Deployment Configuration

### Update CORS Settings
After both services are deployed:

1. **Update Backend CORS**
   - Go to your Render service settings
   - Update the `ALLOWED_ORIGINS` environment variable with your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
   - Redeploy the backend service

2. **Update Frontend API URL**
   - Go to your Vercel project settings
   - Update the `VITE_API_URL` environment variable with your Render backend URL
   - Redeploy the frontend

### Custom Domain (Optional)

#### Backend (Render)
1. Go to your Render service settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

#### Frontend (Vercel)
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your domain and configure DNS

## Environment Variables Reference

### Backend (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `GITHUB_USERNAME` | GitHub username for API | `your-username` |
| `AVATAR_URL` | Profile avatar URL | `https://example.com/avatar.jpg` |
| `LINKEDIN_URL` | LinkedIn profile URL | `https://linkedin.com/in/your-profile` |
| `CV_URL` | Resume/CV URL | `https://example.com/resume.pdf` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://your-app.vercel.app` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

## Troubleshooting

### Common Issues

1. **"Could not read package.json" Error**
   - **Cause**: Root directory not set correctly in Render
   - **Solution**: Set "Root Directory" to `backend` in Render service settings
   - **Alternative**: Use the `render.yaml` file with `rootDir: backend`

2. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your Vercel domain
   - Check that the frontend is using the correct API URL

3. **API Connection Issues**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Check that the backend is running and accessible

4. **Build Failures**
   - Check build logs in Render/Vercel dashboards
   - Ensure all dependencies are listed in `package.json`

5. **Environment Variables Not Loading**
   - Restart services after updating environment variables
   - Check variable names match exactly (case-sensitive)

### Health Checks

- Backend health: `https://your-backend.onrender.com/api/health`
- Frontend: Visit your Vercel deployment URL

## Monitoring

### Render
- Monitor service health in the Render dashboard
- Check logs for any errors
- Monitor resource usage

### Vercel
- Monitor deployments in the Vercel dashboard
- Check function logs for any issues
- Monitor performance metrics

## Cost Considerations

### Free Tier Limits
- **Render**: 750 hours/month, services sleep after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth/month, unlimited deployments

### Upgrading
- Consider upgrading to paid plans for production use
- Paid plans remove sleep limitations and provide better performance

## Security Notes

1. **Environment Variables**: Never commit sensitive data to the repository
2. **CORS**: Only allow necessary origins
3. **HTTPS**: Both Render and Vercel provide HTTPS by default
4. **API Keys**: Store any API keys in environment variables, not in code

## Support

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Project Issues**: Check the repository issues section
