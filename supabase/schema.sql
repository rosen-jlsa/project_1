-- Create Specialists Table
CREATE TABLE specialists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  phone TEXT,
  instagram TEXT,
  twitter TEXT,
  facebook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create Bookings Table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
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
-- Create Services Table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Women', 'Men', 'Children', 'Piercing')),
  price NUMERIC NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Create Service Specialists Relationship Table
CREATE TABLE service_specialists (
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, specialist_id)
);
-- Create Gallery Images Table
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
-- Policies for user_roles
CREATE POLICY "Read own role" ON user_roles FOR
SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Sysadmins manage roles" ON user_roles FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    WHERE user_id = auth.uid()
      AND role = 'sysadmin'
  )
);
-- Policies for Services and Service Specialists
-- Public can view services
CREATE POLICY "Public read services" ON services FOR
SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read service_specialists" ON service_specialists FOR
SELECT TO anon, authenticated USING (true);
-- Only admins/moderators can manage services
CREATE POLICY "Admins manage services" ON services FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('sysadmin', 'moderator')
  )
);
CREATE POLICY "Admins manage service_specialists" ON service_specialists FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('sysadmin', 'moderator')
  )
);
-- Policies for Gallery Images
-- Public can view gallery images
CREATE POLICY "Public read gallery_images" ON gallery_images FOR
SELECT TO anon, authenticated USING (true);
-- Only admins/moderators can manage gallery images
CREATE POLICY "Admins manage gallery_images" ON gallery_images FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('sysadmin', 'moderator')
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
  );

-- Create Product Images Table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_images" ON product_images FOR
SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage product_images" ON product_images FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('sysadmin', 'moderator')
  )
);