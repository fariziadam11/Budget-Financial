-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to handle new user signup with detailed logging
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  error_message text;
BEGIN
  -- Log the start of the function
  RAISE LOG 'Starting handle_new_user for user: %', NEW.id;
  
  -- Get the name from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_app_meta_data->>'name',
    NEW.email
  );
  
  RAISE LOG 'Extracted user_name: %', user_name;

  -- Insert into users table
  INSERT INTO users (id, name)
  VALUES (NEW.id, user_name);
  
  RAISE LOG 'Successfully inserted user profile';
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Get detailed error information
  GET STACKED DIAGNOSTICS error_message = PG_EXCEPTION_DETAIL;
  
  -- Log the error with full details
  RAISE LOG 'Error in handle_new_user: %', error_message;
  RAISE LOG 'SQLSTATE: %, SQLERRM: %', SQLSTATE, SQLERRM;
  
  -- Re-raise the error
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure the users table exists and has the correct structure
DO $$ 
BEGIN
  -- Create users table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions to the service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON users TO service_role; 