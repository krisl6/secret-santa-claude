# Supabase Database Setup Guide

## Step 1: Get Your Database Password

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `svfnztjyrswfgzjvgypn`
3. Navigate to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Under **URI**, copy the connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres
   ```
6. **Important**: Copy the password from the connection string (the part after `postgres:` and before `@`)

## Step 2: Create .env File

Create a `.env` file in the root directory with:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.svfnztjyrswfgzjvgypn.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Optional: For future Supabase client features
NEXT_PUBLIC_SUPABASE_URL="https://svfnztjyrswfgzjvgypn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Zm56dGp5cnN3Zmd6anZneXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDE3ODQsImV4cCI6MjA4MTQ3Nzc4NH0.rgdYDbcDyCVHfgYVTK9xbCw_c8fxALWSEkQD0ld6aPE"
```

**Replace `[YOUR-PASSWORD]` with your actual database password from Step 1.**

## Step 3: Run Migrations

After creating the `.env` file, run:

```bash
npx prisma migrate dev --name init_postgresql
```

This will:
- Create all tables in your Supabase PostgreSQL database
- Generate the Prisma client

## Step 4: Verify Connection

Test the connection by running:

```bash
npx prisma studio
```

This will open Prisma Studio where you can view and manage your database.

## Benefits of Supabase PostgreSQL

✅ **Hosted & Scalable**: No need to manage database files  
✅ **Production Ready**: Better for deploying to Vercel/Netlify  
✅ **Backups**: Automatic backups included  
✅ **Monitoring**: Built-in database monitoring  
✅ **Future Features**: Can use Supabase Auth, Storage, etc.

## Migration Notes

- Your existing SQLite data won't automatically transfer
- You'll need to manually migrate data if you have existing teams
- All new data will be stored in Supabase PostgreSQL

