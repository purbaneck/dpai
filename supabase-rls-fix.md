# Fixing the RLS Policy Issue

The error message `new row violates row-level security policy for table "profiles"` indicates that the trigger function is trying to insert a profile, but the RLS policies are preventing it.

## Solution: Update the Trigger Function and RLS Policies

Follow these steps in your Supabase SQL Editor:

### 1. First, modify the trigger function to use SECURITY DEFINER

```sql
-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Add a special RLS policy for the trigger function

```sql
-- Add a policy to allow the trigger function to insert profiles
CREATE POLICY "Trigger can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);
```

### 3. Alternatively, you can temporarily disable RLS for testing

```sql
-- Temporarily disable RLS on profiles table (only for testing)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable it
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 4. Check if any profiles were created

```sql
-- Check if any profiles exist
SELECT * FROM profiles;
```

### 5. If you have existing users without profiles, create them manually

```sql
-- For any existing users without profiles, create them manually
INSERT INTO profiles (id, email, full_name)
SELECT id, email, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

## Testing the Fix

1. After applying these changes, try registering a new user again
2. Check the Authentication > Users section to confirm the user was created
3. Check the Database > Table editor > profiles table to confirm the profile was created

If you're still having issues, you might need to adjust your approach based on your specific Supabase project configuration.
