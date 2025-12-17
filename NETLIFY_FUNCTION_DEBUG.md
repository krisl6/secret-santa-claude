# Netlify Function Crash Debugging Guide

## Common Causes of "Unknown Error" Crashes

### 1. Database Connection Issues

**Symptoms:**
- Function crashes with "An unknown error has occurred"
- No specific error message in logs

**Diagnosis:**
1. Check if `DATABASE_URL` is set in Netlify environment variables
2. Visit `https://your-site.netlify.app/api/health` to test database connection
3. Check Netlify function logs for Prisma errors

**Solution:**
- Verify `DATABASE_URL` format:
  ```
  postgresql://postgres:[PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
  ```
- Ensure password is correct (no special characters need URL encoding)
- Check Supabase dashboard to ensure database is running

### 2. Prisma Client Not Generated

**Symptoms:**
- Build succeeds but functions crash
- Errors about missing Prisma client

**Solution:**
- The `postinstall` script should auto-generate, but verify in build logs
- Check that `src/generated/prisma/client.ts` exists after build
- If missing, add explicit generation step in `package.json` build script

### 3. Missing Database Tables

**Symptoms:**
- Functions crash when accessing database
- Errors about "relation does not exist"

**Solution:**
- Run migrations: `DATABASE_URL="..." npx prisma migrate deploy`
- Verify tables exist in Supabase dashboard → Table Editor

### 4. Connection Pool Exhaustion

**Symptoms:**
- Intermittent crashes
- "Too many connections" errors

**Solution:**
- Ensure connection string uses `pgbouncer=true&connection_limit=1`
- Prisma client is now configured to reuse connections in serverless

### 5. Unhandled Promise Rejections

**Symptoms:**
- Function crashes without error details
- "Unknown error" message

**Solution:**
- All API routes now have try-catch blocks
- Prisma client has graceful error handling
- Check function logs for unhandled rejections

## Debugging Steps

1. **Check Health Endpoint:**
   ```
   curl https://your-site.netlify.app/api/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Check Netlify Function Logs:**
   - Go to Netlify Dashboard → Functions
   - Click on the crashed function
   - Look for error messages, stack traces

3. **Test Database Connection Locally:**
   ```bash
   DATABASE_URL="your-netlify-database-url" npx prisma studio
   ```

4. **Verify Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Ensure all required variables are set:
     - `DATABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Check Build Logs:**
   - Look for Prisma generation errors
   - Verify build completes successfully
   - Check for TypeScript compilation errors

## Recent Fixes Applied

1. ✅ Improved Prisma client initialization for serverless
2. ✅ Added graceful error handling in all API routes
3. ✅ Fixed assignment query to use `findFirst` instead of `findUnique`
4. ✅ Added process signal handlers for graceful shutdown
5. ✅ Enhanced error messages with development details

## Next Steps if Still Crashing

1. Enable detailed logging:
   - Set `NODE_ENV=development` temporarily in Netlify
   - Check function logs for detailed error messages

2. Test individual endpoints:
   - `/api/health` - Database connection
   - `/api/teams?token=...` - Basic query
   - `/api/teams` (POST) - Create operation

3. Check Supabase:
   - Database is not paused
   - Connection pooling is enabled
   - No IP restrictions blocking Netlify

4. Contact Support:
   - Share Netlify function logs
   - Share health endpoint response
   - Share any Prisma error messages

