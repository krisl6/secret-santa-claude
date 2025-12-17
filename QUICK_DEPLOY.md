# Quick Netlify Deployment Guide

## ✅ GitHub Repo Created!
Your code is now at: **https://github.com/krisl6/secret-santa-claude**

## 🚀 Deploy to Netlify (5 minutes)

### Step 1: Connect GitHub to Netlify
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"** and authorize Netlify
4. Select repository: **`krisl6/secret-santa-claude`**

### Step 2: Configure Build Settings
Netlify should auto-detect Next.js, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `20` (set in Environment variables)

### Step 3: Set Environment Variables
Go to **Site settings** → **Environment variables** → **Add variable**

Add these 3 variables:

1. **DATABASE_URL**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   ```
   **Replace `[YOUR-PASSWORD]` with your actual Supabase database password**

2. **NEXT_PUBLIC_SUPABASE_URL**
   ```
   https://svfnztjyrswfgzjvgypn.supabase.co
   ```

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Zm56dGp5cnN3Zmd6anZneXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDE3ODQsImV4cCI6MjA4MTQ3Nzc4NH0.rgdYDbcDyCVHfgYVTK9xbCw_c8fxALWSEkQD0ld6aPE
   ```

### Step 4: Deploy!
1. Click **"Deploy site"**
2. Wait for build to complete (~2-3 minutes)

### Step 5: Run Database Migration (IMPORTANT!)
After first deployment, run this locally:

```bash
# Get your Netlify site URL (e.g., https://your-site.netlify.app)
# Then run migration (replace [YOUR-PASSWORD] with your actual password):
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1" npx prisma migrate deploy
```

Or use Netlify CLI:
```bash
netlify env:get DATABASE_URL
# Copy the output and run:
DATABASE_URL="[paste-here]" npx prisma migrate deploy
```

## 🎉 Done!
Your Secret Santa app will be live at: `https://your-site-name.netlify.app`

## 📝 Notes
- The build will automatically run `prisma generate` (via postinstall script)
- Make sure to run migrations after first deployment
- Future pushes to GitHub will auto-deploy

