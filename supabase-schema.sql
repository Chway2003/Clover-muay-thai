-- Supabase Database Schema for Clover Muay Thai
-- Run this in your Supabase SQL Editor

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reset_token TEXT,
  reset_token_expiry TIMESTAMP WITH TIME ZONE
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  class_type TEXT NOT NULL,
  max_spots INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  class_id TEXT NOT NULL,
  class_name TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON bookings(class_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default timetable data
INSERT INTO timetable (id, day, time, end_time, class_type, max_spots, description) VALUES
('mon-630', 'Monday', '18:30', '19:30', 'Beginner Muay Thai', 8, 'Perfect for beginners. Learn basic techniques, footwork, and conditioning.'),
('mon-745', 'Monday', '19:45', '20:45', 'Intermediate Training', 8, 'Build on fundamentals with advanced combinations and sparring drills.'),
('tue-630', 'Tuesday', '18:30', '19:30', 'Beginner Muay Thai', 8, 'Perfect for beginners. Learn basic techniques, footwork, and conditioning.'),
('tue-745', 'Tuesday', '19:45', '20:45', 'Intermediate Training', 8, 'Build on fundamentals with advanced combinations and sparring drills.'),
('wed-630', 'Wednesday', '18:30', '19:30', 'Beginner Muay Thai', 8, 'Perfect for beginners. Learn basic techniques, footwork, and conditioning.'),
('wed-745', 'Wednesday', '19:45', '20:45', 'Intermediate Training', 8, 'Build on fundamentals with advanced combinations and sparring drills.'),
('thu-630', 'Thursday', '18:30', '19:30', 'Beginner Muay Thai', 8, 'Perfect for beginners. Learn basic techniques, footwork, and conditioning.'),
('thu-745', 'Thursday', '19:45', '20:45', 'Intermediate Training', 8, 'Build on fundamentals with advanced combinations and sparring drills.'),
('fri-630', 'Friday', '18:30', '20:00', 'Sparring Session', 8, 'Advanced sparring session for intermediate and advanced students.')
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user (you'll need to update the password hash)
INSERT INTO users (id, email, name, password, is_admin, created_at) VALUES
('1756320631381', 'clovermuaythai@gmail.com', 'admin', '$2b$12$DHl2ETNoX4mW0OuagNJVWuZqMS/7s3o.AlxvfGb4bcnmbmlU0FPq.', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Anyone can read timetable
CREATE POLICY "Anyone can read timetable" ON timetable FOR SELECT USING (true);

-- Only admins can modify timetable
CREATE POLICY "Admins can modify timetable" ON timetable FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.is_admin = true
  )
);

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete own bookings" ON bookings FOR DELETE USING (auth.uid()::text = user_id);

-- Admins can read all bookings
CREATE POLICY "Admins can read all bookings" ON bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.is_admin = true
  )
);

-- Admins can delete any booking
CREATE POLICY "Admins can delete any booking" ON bookings FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.is_admin = true
  )
);
