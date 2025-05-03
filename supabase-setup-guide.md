# Supabase Setup Guide for DPIA Tool

This guide will walk you through setting up a Supabase project for the DPIA Tool application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Enter project details:
   - **Name**: DPIA Tool (or your preferred name)
   - **Database Password**: Create a strong password (save this somewhere secure)
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to be created (this may take a few minutes)

## Step 2: Get Your API Keys

1. In your new project dashboard, go to the "Settings" icon in the sidebar
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Copy this as your `VITE_SUPABASE_URL`
   - **anon/public** key: Copy this as your `VITE_SUPABASE_ANON_KEY`

## Step 3: Update Your .env File

1. Open your project's `.env` file
2. Replace the placeholder values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
3. Save the file

## Step 4: Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" in the sidebar
2. Under "Providers", ensure "Email" is enabled
3. Optional: Configure additional settings:
   - Under "URL Configuration", set your site URL (for local development, you can use http://localhost:5173)
   - Under "Email Templates", you can customize the emails sent to users

## Step 5: Create Database Tables

Now we'll create the database tables needed for the DPIA Tool. Go to the "SQL Editor" in the Supabase dashboard and run the following SQL:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  organization TEXT,
  role TEXT
);

-- Create dpias table
CREATE TABLE IF NOT EXISTS dpias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Create dpia_sections table
CREATE TABLE IF NOT EXISTS dpia_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dpia_id UUID REFERENCES dpias(id) ON DELETE CASCADE NOT NULL,
  section_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS dpias_user_id_idx ON dpias(user_id);
CREATE INDEX IF NOT EXISTS dpia_sections_dpia_id_idx ON dpia_sections(dpia_id);
```

## Step 6: Set Up Row Level Security (RLS)

To secure your data, enable Row Level Security and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpias ENABLE ROW LEVEL SECURITY;
ALTER TABLE dpia_sections ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- DPIAs table policies
CREATE POLICY "Users can view their own DPIAs"
  ON dpias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DPIAs"
  ON dpias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DPIAs"
  ON dpias FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DPIAs"
  ON dpias FOR DELETE
  USING (auth.uid() = user_id);

-- DPIA sections policies
CREATE POLICY "Users can view sections of their own DPIAs"
  ON dpia_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dpias
    WHERE dpias.id = dpia_sections.dpia_id
    AND dpias.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert sections to their own DPIAs"
  ON dpia_sections FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM dpias
    WHERE dpias.id = dpia_sections.dpia_id
    AND dpias.user_id = auth.uid()
  ));

CREATE POLICY "Users can update sections of their own DPIAs"
  ON dpia_sections FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM dpias
    WHERE dpias.id = dpia_sections.dpia_id
    AND dpias.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete sections of their own DPIAs"
  ON dpia_sections FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM dpias
    WHERE dpias.id = dpia_sections.dpia_id
    AND dpias.user_id = auth.uid()
  ));
```

## Step 7: Create a Database Trigger for Profile Creation

Create a trigger to automatically create a profile when a user signs up:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 8: Test Your Setup

1. Restart your application with the new environment variables
2. Try to register a new user through the application
3. Check the Supabase dashboard to confirm:
   - A new user appears in the Authentication > Users section
   - A new profile is created in the Database > Table editor > profiles table

## Troubleshooting

- **Authentication Issues**: Check that your environment variables are correctly set and that email authentication is enabled
- **Database Errors**: Verify that all tables and policies are created correctly
- **CORS Errors**: Make sure your site URL is configured in the Authentication settings
- **Missing Profile Data**: Ensure the trigger for new user creation is working properly

## Next Steps

Once your basic setup is complete, you might want to:

1. Add more authentication providers (Google, GitHub, etc.)
2. Set up email verification requirements
3. Create additional database tables for more complex DPIA features
4. Configure storage for file uploads (if needed)
