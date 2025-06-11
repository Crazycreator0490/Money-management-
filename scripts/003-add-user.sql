-- Add specific user to the database
-- First, check if the user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE email = 'jinuthomas6985@gmail.com') INTO user_exists;
  
  IF NOT user_exists THEN
    -- Hash the password 'Antonyoyo' using bcrypt
    -- Note: In a real script, we'd generate this hash dynamically
    -- This is a pre-computed bcrypt hash for 'Antonyoyo'
    INSERT INTO users (name, email, password_hash)
    VALUES ('Jinu Thomas', 'jinuthomas6985@gmail.com', '$2a$12$Ht0vQh7NNF8s9Yd.Ov.Dte9XFEt9vxdHCYIw9XQ5XFbRGMQwjEKHy');
    
    RAISE NOTICE 'User jinuthomas6985@gmail.com added successfully!';
  ELSE
    RAISE NOTICE 'User jinuthomas6985@gmail.com already exists!';
  END IF;
END $$;

-- Confirm the user exists
SELECT email, name FROM users WHERE email = 'jinuthomas6985@gmail.com';
