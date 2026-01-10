-- Create Specialists Table
CREATE TABLE specialists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  -- 'Hairdresser', 'Beautician', 'Manicurist'
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create Services Table
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    specialist_ids UUID[], -- Array of specialist IDs who can perform this service
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  -- Made optional in types but good to keep
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID,
  notes TEXT
);
-- Create User Roles Table (RBAC)
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sysadmin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);
-- Enable Row Level Security (RLS)
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
-- Policies for user_roles
CREATE POLICY "Read own role" ON user_roles FOR
SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Sysadmins manage roles" ON user_roles FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
      AND role = 'sysadmin'
  )
);
-- Policies for Specialists
-- Public can view specialists
CREATE POLICY "Public read specialists" ON specialists FOR
SELECT TO anon,
  authenticated USING (true);
-- Only admins/moderators can manage specialists
CREATE POLICY "Admins manage specialists" ON specialists FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
      AND role IN ('sysadmin', 'moderator')
  )
);
-- Policies for Bookings
-- Public can create bookings
CREATE POLICY "Public insert bookings" ON bookings FOR
INSERT TO anon,
  authenticated WITH CHECK (true);
-- Only admins/moderators can view bookings
CREATE POLICY "Admins view all bookings" ON bookings FOR
SELECT TO authenticated USING (
    EXISTS (
      SELECT 1
      FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('sysadmin', 'moderator')
    )
  );
-- Only admins/moderators can update bookings
CREATE POLICY "Admins update bookings" ON bookings FOR
UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1
      FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('sysadmin', 'moderator')
    )
  );
-- Insert Mock Data (Only for local dev validation if needed)
INSERT INTO specialists (name, role, email)
VALUES (
    'Miglena Todorova',
    'Hairdresser',
    'miglena.todorova75@gmail.com'
  ),
  ('Monika', 'Beautician', 'monika@salon.com'),
  ('Galina', 'Manicurist', 'galina@salon.com');