# Netlify Deployment Guide

## Prerequisites

1. **Create `.env` file** (copy from `.env.example` and fill in your Supabase password)
2. **Run initial migration** locally:
   ```bash
   npx prisma migrate deploy
   ```

## Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Netlify site**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Choose your team
   - Site name: (choose a name or press enter for random)
   - Build command: `npm run build` (or use the one in netlify.toml)
   - Publish directory: `.next`

4. **Set environment variables**:
   ```bash
   netlify env:set DATABASE_URL "postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://svfnztjyrswfgzjvgypn.supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Zm56dGp5cnN3Zmd6anZneXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDE3ODQsImV4cCI6MjA4MTQ3Nzc4NH0.rgdYDbcDyCVHfgYVTK9xbCw_c8fxALWSEkQD0ld6aPE"
   ```
   **Replace `[YOUR-PASSWORD]` with your actual Supabase database password**

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via GitHub + Netlify Dashboard

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Go to Netlify Dashboard**:
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20`

4. **Set environment variables** (in Site settings → Environment variables):
   - `DATABASE_URL`: `postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://svfnztjyrswfgzjvgypn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Zm56dGp5cnN3Zmd6anZneXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDE3ODQsImV4cCI6MjA4MTQ3Nzc4NH0.rgdYDbcDyCVHfgYVTK9xbCw_c8fxALWSEkQD0ld6aPE`

5. **Run database migration** (one-time setup):
   - After first deployment, go to Netlify Functions or use Netlify CLI:
   ```bash
   netlify functions:invoke migrate --no-identity
   ```
   - Or manually run migration via Netlify CLI:
   ```bash
   netlify env:get DATABASE_URL
   # Then run locally with that URL:
   DATABASE_URL="..." npx prisma migrate deploy
   ```

## Important Notes

⚠️ **Before deploying, make sure to:**
1. Fill in your Supabase database password in `.env` file
2. Run `npx prisma migrate deploy` locally first to create tables
3. Set all environment variables in Netlify dashboard

⚠️ **After deployment:**
- The database tables need to exist before the app can work
- Run migrations using Netlify CLI or create a one-time migration script

## Troubleshooting

**Build fails with Prisma errors:**
- Make sure `DATABASE_URL` is set correctly in Netlify environment variables
- Check that `postinstall` script runs: `prisma generate`

**Database connection errors:**
- Verify your Supabase password is correct
- Check Supabase dashboard for connection limits
- Ensure the connection string uses `pgbouncer=true` for connection pooling

**Migration issues:**
- Run migrations manually: `DATABASE_URL="..." npx prisma migrate deploy`
- Or create a Netlify function to run migrations on deploy

