# Database Setup Guide for Production

## Main Setup Files (Execute in Order)

### 1. database_setup.sql ⭐ **REQUIRED**
**Purpose**: Complete database schema setup including all tables, RLS policies, triggers, and storage
**Contains**:
- All table definitions (profiles, categories, items, transformations, etc.)
- Row Level Security (RLS) policies
- Triggers for updated_at timestamps
- Profile creation trigger for new users
- Storage bucket setup for item images
- Admin user setup

**Execute first** in your Supabase SQL Editor

### 2. categories_catalog.sql ⭐ **REQUIRED**
**Purpose**: Populate the categories table with all mountain sports equipment categories
**Contains**:
- Ropes (dynamic, static, cord, webbing)
- Carabiners and connectors
- Harnesses
- Protection devices
- Helmets
- Headlamps
- And many more categories with metadata schemas

**Execute second** after database_setup.sql

## Production Deployment Steps

1. Create your Supabase project
2. Open SQL Editor in Supabase Dashboard
3. Execute `database_setup.sql` (paste entire file and run)
4. Execute `categories_catalog.sql` (paste entire file and run)
5. Update the admin email in database_setup.sql line 418 if needed:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
6. Done! ✅

## Environment Variables (.env.local)

Make sure to set these in your Next.js application:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Important Notes

- ⚠️ The `category` column issue has been fixed - database_setup.sql only creates `category_id` (not the legacy `category` text column)
- ✅ All temporary/debugging SQL files have been removed
- ✅ All RLS policies are properly configured
- ✅ Storage policies are set up for item images
