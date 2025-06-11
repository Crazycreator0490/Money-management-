# 🔧 Environment Variables Setup Guide

## Required Environment Variables

Based on your available environment variables, here are the ones needed for the Financial Journey application:

### 1. Database Configuration (Required)
Choose ONE of these database URL variables:

\`\`\`bash
# Primary option (recommended)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Alternative options (the app will auto-detect)
POSTGRES_URL="postgresql://username:password@host:5432/database?sslmode=require"
KONLY_DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
KONLY_POSTGRES_URL="postgresql://username:password@host:5432/database?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/database?sslmode=require"
\`\`\`

### 2. Application Configuration

\`\`\`bash
# Application environment
NODE_ENV="production"

# Application URL (auto-detected on Vercel)
NEXTAUTH_URL="https://your-domain.vercel.app"

# Custom application key
CUSTOM_KEY="your-custom-application-key"
\`\`\`

### 3. Security Configuration

\`\`\`bash
# Session security (choose one)
SESSION_SECRET="your-super-secret-session-key"
NEXTAUTH_SECRET="your-nextauth-secret"
VERCEL_SECRET="your-vercel-secret"
\`\`\`

### 4. Optional Database Details
If you need individual database connection details:

\`\`\`bash
POSTGRES_HOST="your-postgres-host"
POSTGRES_USER="your-postgres-user" 
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"

# Alternative naming (auto-detected)
KONLY_POSTGRES_HOST="your-postgres-host"
KONLY_POSTGRES_USER="your-postgres-user"
KONLY_POSTGRES_USERNAME="your-postgres-username"
KONLY_POSTGRES_PASSWORD="your-postgres-password"
KONLY_POSTGRES_DATABASE="your-postgres-database"
\`\`\`

## 🚀 Quick Setup for Vercel

### Minimum Required Variables:
1. **DATABASE_URL** (or any of the postgres URL alternatives)
2. **CUSTOM_KEY** 
3. **NODE_ENV** (set to "production")

### Recommended Additional Variables:
4. **NEXTAUTH_URL** (your Vercel app URL)
5. **SESSION_SECRET** (for enhanced security)

## 🔍 Environment Variable Priority

The application will automatically detect and use variables in this order:

### Database URL:
1. `DATABASE_URL`
2. `POSTGRES_URL` 
3. `KONLY_DATABASE_URL`
4. `KONLY_POSTGRES_URL`
5. `POSTGRES_PRISMA_URL`

### Session Secret:
1. `SESSION_SECRET`
2. `NEXTAUTH_SECRET`
3. `VERCEL_SECRET`
4. Default fallback

### Database Connection Details:
1. `POSTGRES_HOST` / `KONLY_POSTGRES_HOST`
2. `POSTGRES_USER` / `KONLY_POSTGRES_USER` / `KONLY_POSTGRES_USERNAME`
3. `POSTGRES_PASSWORD` / `KONLY_POSTGRES_PASSWORD`
4. `POSTGRES_DATABASE` / `KONLY_POSTGRES_DATABASE`

## ✅ Verification

After setting up environment variables, the application will:

1. **Auto-detect** the best available database URL
2. **Validate** the connection string format
3. **Test** database connectivity
4. **Log** configuration status (safely, without exposing secrets)

## 🛠️ Troubleshooting

### Common Issues:

1. **"No database URL found"**
   - Set at least one of the database URL variables
   - Ensure the URL starts with `postgresql://`

2. **"Database connection failed"**
   - Verify the database URL is correct
   - Check if the database server is accessible
   - Ensure SSL mode is properly configured

3. **"Environment validation failed"**
   - Check that required variables are set
   - Verify variable names match exactly (case-sensitive)

### Debug Commands:

\`\`\`bash
# Check if database URL is configured
node -e "console.log('Database:', process.env.DATABASE_URL ? 'configured' : 'missing')"

# Verify environment setup
curl https://your-app.vercel.app/api/health
\`\`\`

## 🔒 Security Best Practices

1. **Never commit** environment variables to version control
2. **Use strong secrets** for SESSION_SECRET and similar variables
3. **Rotate secrets** regularly in production
4. **Use SSL** for database connections in production
5. **Limit access** to environment variable configuration

## 📋 Deployment Checklist

- [ ] Database URL configured and tested
- [ ] CUSTOM_KEY set to a unique value
- [ ] NODE_ENV set to "production"
- [ ] NEXTAUTH_URL set to your domain
- [ ] SESSION_SECRET set to a strong value
- [ ] All variables verified in Vercel dashboard
- [ ] Health check endpoint returns success
- [ ] Application deploys without errors
\`\`\`

Update the health check to show environment variable status:
