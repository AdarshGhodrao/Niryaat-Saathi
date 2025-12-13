/*
  # Niryaat Saathi - Complete Database Schema
  
  ## Overview
  Professional import-export intelligence platform database with comprehensive tables
  for market intelligence, trade data, government schemes, and user management.
  
  ## New Tables
  
  ### 1. profiles
  Extended user profile with business information
  - id (uuid, references auth.users)
  - full_name (text)
  - role (enum: exporter, importer, admin)
  - company_name (text)
  - iec_code (text, unique)
  - country (text)
  - phone_number (text)
  - business_type (enum: msme, startup, enterprise)
  - created_at, updated_at (timestamps)
  
  ### 2. user_hs_codes
  User's product HS codes (many-to-many)
  - user_id (uuid)
  - hs_code (text)
  
  ### 3. products
  Master product catalog
  - id (uuid)
  - hs_code (text)
  - product_name (text)
  - category (text)
  - description (text)
  - trending_status (enum: hot, stable, cold)
  
  ### 4. trade_statistics
  Historical trade data
  - id (uuid)
  - hs_code (text)
  - country (text)
  - year (integer)
  - export_value (bigint)
  - import_value (bigint)
  - growth_rate (decimal)
  
  ### 5. country_relations
  Country trade agreements and relations
  - id (uuid)
  - country_code (text)
  - country_name (text)
  - trade_agreement_type (text)
  - fta_status (boolean)
  - trade_balance (bigint)
  
  ### 6. tariffs
  Tariff information by HS code and country
  - id (uuid)
  - hs_code (text)
  - country (text)
  - mfn_tariff (decimal)
  - preferential_tariff (decimal)
  - required_certifications (text[])
  
  ### 7. government_schemes
  Government benefit schemes
  - id (uuid)
  - scheme_name (text)
  - scheme_type (text)
  - eligible_hs_codes (text[])
  - eligible_countries (text[])
  - eligible_business_types (text[])
  - description (text)
  - official_link (text)
  - is_active (boolean)
  
  ### 8. news_feed
  Trade news and notifications
  - id (uuid)
  - title (text)
  - content (text)
  - category (text)
  - source (text)
  - published_at (timestamp)
  - is_featured (boolean)
  
  ### 9. importer_ratings
  Importer trust ratings
  - id (uuid)
  - importer_id (uuid)
  - rated_by (uuid)
  - overall_score (decimal)
  - payment_reliability (integer)
  - compliance_score (integer)
  - dispute_history (integer)
  - review_text (text)
  - is_verified (boolean)
  
  ### 10. service_providers
  CHA, logistics, insurance services
  - id (uuid)
  - service_type (text)
  - provider_name (text)
  - description (text)
  - contact_info (jsonb)
  - rating (decimal)
  - review_count (integer)
  
  ### 11. notifications
  User notifications
  - id (uuid)
  - user_id (uuid)
  - title (text)
  - message (text)
  - type (text)
  - is_read (boolean)
  - created_at (timestamp)
  
  ## Security
  - RLS enabled on all tables
  - Policies for role-based access (exporter, importer, admin)
  - Authentication required for most operations
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('exporter', 'importer', 'admin');
CREATE TYPE business_type AS ENUM ('msme', 'startup', 'enterprise');
CREATE TYPE trending_status AS ENUM ('hot', 'stable', 'cold');

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role user_role NOT NULL,
  company_name text NOT NULL,
  iec_code text UNIQUE NOT NULL,
  country text NOT NULL DEFAULT 'India',
  phone_number text NOT NULL,
  business_type business_type NOT NULL,
  avatar_url text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. User HS codes (many-to-many)
CREATE TABLE IF NOT EXISTS user_hs_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  hs_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, hs_code)
);

-- 3. Products catalog
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hs_code text NOT NULL,
  product_name text NOT NULL,
  category text,
  description text,
  trending_status trending_status DEFAULT 'stable',
  market_size bigint,
  estimated_margin_min decimal,
  estimated_margin_max decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Trade statistics
CREATE TABLE IF NOT EXISTS trade_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hs_code text NOT NULL,
  country text NOT NULL,
  year integer NOT NULL,
  export_value bigint DEFAULT 0,
  import_value bigint DEFAULT 0,
  growth_rate decimal,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hs_code, country, year)
);

-- 5. Country relations
CREATE TABLE IF NOT EXISTS country_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text UNIQUE NOT NULL,
  country_name text NOT NULL,
  trade_agreement_type text,
  fta_status boolean DEFAULT false,
  trade_balance bigint,
  last_updated timestamptz DEFAULT now()
);

-- 6. Tariffs
CREATE TABLE IF NOT EXISTS tariffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hs_code text NOT NULL,
  country text NOT NULL,
  mfn_tariff decimal,
  preferential_tariff decimal,
  required_certifications text[],
  import_documents text[],
  last_updated timestamptz DEFAULT now(),
  UNIQUE(hs_code, country)
);

-- 7. Government schemes
CREATE TABLE IF NOT EXISTS government_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name text NOT NULL,
  scheme_type text NOT NULL,
  eligible_hs_codes text[],
  eligible_countries text[],
  eligible_business_types text[],
  description text,
  official_link text,
  benefits text,
  eligibility_criteria text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. News feed
CREATE TABLE IF NOT EXISTS news_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category text,
  sector text,
  source text,
  source_url text,
  published_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 9. Importer ratings
CREATE TABLE IF NOT EXISTS importer_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  importer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rated_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  overall_score decimal CHECK (overall_score >= 0 AND overall_score <= 5),
  payment_reliability integer CHECK (payment_reliability >= 1 AND payment_reliability <= 5),
  compliance_score integer CHECK (compliance_score >= 1 AND compliance_score <= 5),
  dispute_history integer CHECK (dispute_history >= 1 AND dispute_history <= 5),
  review_text text,
  is_verified boolean DEFAULT false,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(importer_id, rated_by)
);

-- 10. Service providers
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  provider_name text NOT NULL,
  description text,
  contact_info jsonb,
  rating decimal DEFAULT 0,
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_iec ON profiles(iec_code);
CREATE INDEX IF NOT EXISTS idx_user_hs_codes_user ON user_hs_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_products_hs_code ON products(hs_code);
CREATE INDEX IF NOT EXISTS idx_trade_stats_hs ON trade_statistics(hs_code);
CREATE INDEX IF NOT EXISTS idx_trade_stats_country ON trade_statistics(country);
CREATE INDEX IF NOT EXISTS idx_tariffs_hs ON tariffs(hs_code);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_feed(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hs_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE importer_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all approved profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_approved = true OR id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RLS Policies for user_hs_codes
CREATE POLICY "Users can view own HS codes"
  ON user_hs_codes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own HS codes"
  ON user_hs_codes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own HS codes"
  ON user_hs_codes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for public reference data
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view trade statistics"
  ON trade_statistics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view country relations"
  ON country_relations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view tariffs"
  ON tariffs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view active schemes"
  ON government_schemes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view news"
  ON news_feed FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view service providers"
  ON service_providers FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for importer_ratings
CREATE POLICY "Users can view ratings for approved importers"
  ON importer_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = importer_ratings.importer_id
      AND profiles.is_approved = true
    )
  );

CREATE POLICY "Exporters can create ratings"
  ON importer_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    rated_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'exporter'
    )
  );

CREATE POLICY "Users can update own ratings"
  ON importer_ratings FOR UPDATE
  TO authenticated
  USING (rated_by = auth.uid())
  WITH CHECK (rated_by = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin policies for content management
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage schemes"
  ON government_schemes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage news"
  ON news_feed FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON government_schemes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON importer_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();