# Troubleshooting Netlify Function Errors

## Common Issues and Solutions

### 1. Function Crashes / Unknown Errors

**Symptoms:**
- "An unknown error has occurred" in Netlify functions
- Functions return 500 errors

**Possible Causes:**

#### Database Connection Issues
- **Check:** Visit `https://your-site.netlify.app/api/health` to test database connection
- **Solution:** Ensure `DATABASE_URL` is correctly set in Netlify environment variables
- **Verify:** The connection string format is correct:
  ```
  postgresql://postgres:[PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
  ```

#### Prisma Client Not Generated
- **Check:** Build logs should show "Generated Prisma Client"
- **Solution:** The `postinstall` script should auto-generate, but you can verify:
  ```bash
  npx prisma generate
  ```

#### Database Migrations Not Run
- **Check:** Tables might not exist in Supabase
- **Solution:** Run migrations:
  ```bash
  DATABASE_URL="your-connection-string" npx prisma migrate deploy
  ```

### 2. Environment Variables

**Verify in Netlify Dashboard:**
1. Go to Site Settings → Environment Variables
2. Ensure these are set:
   - `DATABASE_URL` (with your Supabase password)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Check Function Logs

1. Go to Netlify Dashboard → Functions
2. Click on the failed function
3. Check the logs for specific error messages

### 4. Test Database Connection

Visit: `https://your-site.netlify.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

If you see `"database": "disconnected"`, check:
- DATABASE_URL is set correctly
- Supabase database is running
- Network/firewall allows connections

### 5. Common Error Messages

**"Can't reach database server"**
- Check Supabase dashboard - is the database paused?
- Verify connection string format
- Check if IP restrictions are enabled in Supabase

**"relation does not exist"**
- Run database migrations: `npx prisma migrate deploy`
- Verify migrations ran successfully

**"Connection limit exceeded"**
- Supabase free tier has connection limits
- The connection string uses `pgbouncer=true` to help with this
- Consider upgrading Supabase plan if needed

## Getting More Details

To see detailed error messages in development:
1. Check Netlify function logs
2. The health endpoint will show connection status
3. API routes now return more detailed errors in development mode

## Still Having Issues?

1. Check Netlify build logs for Prisma generation errors
2. Verify all environment variables are set
3. Test database connection using the health endpoint
4. Run migrations locally with your Netlify DATABASE_URL to verify it works

