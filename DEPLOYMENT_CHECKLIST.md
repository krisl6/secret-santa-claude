# Deployment Checklist

## Pre-Deployment Checks ✅

### 1. Build Verification
- [x] `npm run build` completes successfully
- [x] No TypeScript errors
- [x] No linting errors
- [x] Prisma client generates correctly

### 2. Database Setup
- [x] Prisma schema configured for PostgreSQL
- [x] All models have `@@schema("public")` attribute
- [x] Migration files created and tested
- [x] Database tables created in Supabase

### 3. Environment Variables
- [x] `DATABASE_URL` - Set in Netlify (with Supabase password)
- [x] `NEXT_PUBLIC_SUPABASE_URL` - Set in Netlify
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set in Netlify
- [ ] `RESEND_API_KEY` - Set in Netlify (for email notifications)
- [ ] `RESEND_FROM_EMAIL` - (Optional) Custom sender email
- [ ] `NEXT_PUBLIC_APP_URL` - Set to your Netlify site URL
- [x] `.env` file not committed to git

### 4. Code Quality
- [x] All API routes have proper error handling
- [x] Prisma client properly configured for serverless
- [x] No hardcoded secrets in code
- [x] Client-side code properly checks for `window`/`localStorage`
- [x] Font fallbacks configured

### 5. Netlify Configuration
- [x] `netlify.toml` configured correctly
- [x] Build command: `npm run build`
- [x] Using `@netlify/plugin-nextjs` (no publish directory needed)
- [x] Node version: `20`
- [x] Secrets scanner configured for `NEXT_PUBLIC_*` variables

## Post-Deployment Verification

### 1. Test Endpoints
- [ ] Health check: `https://your-site.netlify.app/api/health`
- [ ] Create team: Test team creation flow
- [ ] Join team: Test joining with token
- [ ] Wishlist: Test adding/editing items
- [ ] Draw: Test Secret Santa draw (if organizer)

### 2. Database Connection
- [ ] Verify database connection works
- [ ] Check that tables exist and are accessible
- [ ] Test CRUD operations

### 3. Function Logs
- [ ] Check Netlify function logs for errors
- [ ] Verify no connection pool exhaustion
- [ ] Check for timeout issues

## Common Issues & Solutions

### Build Fails
- Check Prisma schema validation
- Verify all environment variables are set
- Check build logs for specific errors

### Functions Crash
- Verify database connection string
- Check that migrations have been run
- Review function logs for specific errors

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check Supabase database is not paused
- Verify connection string uses `pgbouncer=true`

## Files Modified for Deployment

1. **Prisma Configuration**
   - `prisma/schema.prisma` - Added `@@schema("public")` to all models
   - `prisma/migrations/` - PostgreSQL migration files

2. **Error Handling**
   - All API routes now have consistent error handling
   - Better error messages in development mode

3. **Serverless Optimization**
   - Prisma client properly configured for serverless
   - Removed problematic `$connect()` call
   - Global Prisma instance for connection reuse

4. **Font Configuration**
   - Added fallbacks for Christmas font
   - Prevents build warnings

5. **Netlify Configuration**
   - `netlify.toml` - Build settings and secrets scanner config
   - `next.config.ts` - Serverless optimizations

