# 🚀 Deployment Guide

## Prerequisites

1. **Neon Database Account**: Sign up at [neon.tech](https://neon.tech)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Code pushed to GitHub/GitLab/Bitbucket

## Step 1: Setup Neon Database

1. Create a new project in Neon
2. Copy the connection string from the dashboard
3. It should look like: `postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

## Step 2: Deploy to Vercel

### Option A: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variable
vercel env add DATABASE_URL

# Deploy
vercel --prod
\`\`\`

### Option B: Vercel Dashboard
1. Connect your Git repository to Vercel
2. Add environment variable `DATABASE_URL` in project settings
3. Deploy automatically on push

## Step 3: Environment Variables

Set these in Vercel project settings:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Neon connection string | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `NEXTAUTH_URL` | Your Vercel app URL | ✅ Yes |

## Step 4: Verify Deployment

1. Visit your deployed app
2. Check `/api/health` endpoint
3. Test user registration and login
4. Verify database connectivity

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Ensure SSL mode is enabled
- Check Neon dashboard for connection limits

### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

### Runtime Errors
- Check function logs in Vercel
- Verify environment variables
- Test API endpoints individually

## Monitoring

- Use Vercel Analytics for performance monitoring
- Monitor Neon dashboard for database metrics
- Set up alerts for critical errors

## Security Checklist

- ✅ Environment variables are secure
- ✅ Database uses SSL connections
- ✅ Session cookies are httpOnly and secure
- ✅ Password hashing uses bcrypt
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive data

## Performance Optimization

- ✅ Connection pooling enabled
- ✅ Database indexes created
- ✅ Session cleanup automated
- ✅ Error handling with retries
- ✅ Health checks implemented
\`\`\`

## 🎉 Success!

Your application is now fully deployed and production-ready!
