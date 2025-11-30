-- =====================================================
-- GEAR HUB - Complete Database Setup Script
-- Material Lifecycle Management System
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table (NEW)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  requires_unique_numbering BOOLEAN DEFAULT true,
  can_be_composite BOOLEAN DEFAULT true,
  can_be_subdivided BOOLEAN DEFAULT false,
  metadata_schema JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items Table (MODIFIED)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  model TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN (
    'available', 'reserved', 'in_use', 'maintenance', 
    'subdivided', 'donated', 'discarded', 'lost', 'disassembled'
  )),
  image_url TEXT,
  identifier TEXT UNIQUE,
  has_unique_numbering BOOLEAN DEFAULT true,
  is_composite BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  origin_transformation_id UUID,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deletion_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transformations Table (NEW)
CREATE TABLE IF NOT EXISTS transformations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN (
    'subdivision', 'disassembly', 'assembly', 
    'deterioration', 'donation', 'loss', 'recovery'
  )),
  performed_by UUID NOT NULL REFERENCES profiles(id),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transformation Items Table (NEW)
CREATE TABLE IF NOT EXISTS transformation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transformation_id UUID NOT NULL REFERENCES transformations(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('source', 'result')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transformation_id, item_id, role)
);

-- Item Components Table (NEW)
CREATE TABLE IF NOT EXISTS item_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  component_item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_item_id, component_item_id)
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  purpose TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'cancelled', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservation Items Table
CREATE TABLE IF NOT EXISTS reservation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  checked_out BOOLEAN DEFAULT false,
  checked_in BOOLEAN DEFAULT false,
  condition_on_return TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(reservation_id, item_id)
);

-- Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false
);

-- Add FK for origin_transformation after transformations table exists
ALTER TABLE items 
DROP CONSTRAINT IF EXISTS items_origin_transformation_fk,
ADD CONSTRAINT items_origin_transformation_fk 
  FOREIGN KEY (origin_transformation_id) 
  REFERENCES transformations(id);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- Profiles Policies
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
CREATE POLICY "Enable read access for users to own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
CREATE POLICY "Enable update for users based on id" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Categories Policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Items Policies
DROP POLICY IF EXISTS "Anyone can view available items" ON items;
CREATE POLICY "Anyone can view available items" ON items
  FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Only admins can insert items" ON items;
CREATE POLICY "Only admins can insert items" ON items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can update items" ON items;
CREATE POLICY "Only admins can update items" ON items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can delete items" ON items;
CREATE POLICY "Only admins can delete items" ON items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transformations Policies
DROP POLICY IF EXISTS "Anyone can view transformations" ON transformations;
CREATE POLICY "Anyone can view transformations" ON transformations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can create transformations" ON transformations;
CREATE POLICY "Only admins can create transformations" ON transformations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transformation Items Policies
DROP POLICY IF EXISTS "Anyone can view transformation items" ON transformation_items;
CREATE POLICY "Anyone can view transformation items" ON transformation_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage transformation items" ON transformation_items;
CREATE POLICY "Only admins can manage transformation items" ON transformation_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Item Components Policies
DROP POLICY IF EXISTS "Anyone can view item components" ON item_components;
CREATE POLICY "Anyone can view item components" ON item_components
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage item components" ON item_components;
CREATE POLICY "Only admins can manage item components" ON item_components
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reservations Policies
DROP POLICY IF EXISTS "Users can view their own reservations" ON reservations;
CREATE POLICY "Users can view their own reservations" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create reservations" ON reservations;
CREATE POLICY "Users can create reservations" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all reservations" ON reservations;
CREATE POLICY "Admins can view all reservations" ON reservations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update reservations" ON reservations;
CREATE POLICY "Admins can update reservations" ON reservations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reservation Items Policies
DROP POLICY IF EXISTS "Users can view their reservation items" ON reservation_items;
CREATE POLICY "Users can view their reservation items" ON reservation_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM reservations WHERE id = reservation_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all reservation items" ON reservation_items;
CREATE POLICY "Admins can view all reservation items" ON reservation_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage reservation items" ON reservation_items;
CREATE POLICY "Admins can manage reservation items" ON reservation_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Incidents Policies
DROP POLICY IF EXISTS "Admins can view all incidents" ON incidents;
CREATE POLICY "Admins can view all incidents" ON incidents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can create incidents" ON incidents;
CREATE POLICY "Admins can create incidents" ON incidents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update incidents" ON incidents;
CREATE POLICY "Admins can update incidents" ON incidents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- 5. CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_status_active ON items(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_items_deleted ON items(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transformations_type ON transformations(type);
CREATE INDEX IF NOT EXISTS idx_transformations_performed_by ON transformations(performed_by);
CREATE INDEX IF NOT EXISTS idx_transformations_performed_at ON transformations(performed_at);
CREATE INDEX IF NOT EXISTS idx_transformation_items_transformation ON transformation_items(transformation_id);
CREATE INDEX IF NOT EXISTS idx_transformation_items_item ON transformation_items(item_id);
CREATE INDEX IF NOT EXISTS idx_item_components_parent ON item_components(parent_item_id);
CREATE INDEX IF NOT EXISTS idx_item_components_component ON item_components(component_item_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservation_items_reservation_id ON reservation_items(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_items_item_id ON reservation_items(item_id);
CREATE INDEX IF NOT EXISTS idx_incidents_item_id ON incidents(item_id);

-- =====================================================
-- 7. SETUP STORAGE FOR ITEM IMAGES
-- =====================================================

-- Create a storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;
CREATE POLICY "Authenticated users can upload item images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Create policy to allow public read access to images
DROP POLICY IF EXISTS "Public can view item images" ON storage.objects;
CREATE POLICY "Public can view item images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');

-- Create policy to allow admins to delete images
DROP POLICY IF EXISTS "Admins can delete item images" ON storage.objects;
CREATE POLICY "Admins can delete item images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'item-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 8. SET YOUR USER AS ADMIN
-- =====================================================

-- Update your user to be admin (replace with your email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'vgpastor08@gmail.com';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready to use.
-- Next step: Run categories_catalog.sql to populate categories
-- =====================================================
