-- Create carousel_slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  heading text,
  text text,
  button_text text,
  link text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carousel_settings table for global carousel settings
CREATE TABLE IF NOT EXISTS carousel_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  swap_interval integer DEFAULT 5000, -- milliseconds
  is_autoplay boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default carousel settings
INSERT INTO carousel_settings (swap_interval, is_autoplay)
VALUES (5000, true)
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to carousel_slides"
  ON carousel_slides FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow public read access to carousel_settings"
  ON carousel_settings FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users with admin role to manage carousel
CREATE POLICY "Allow admin to manage carousel_slides"
  ON carousel_slides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Allow admin to manage carousel_settings"
  ON carousel_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carousel_slides_updated_at 
  BEFORE UPDATE ON carousel_slides 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousel_settings_updated_at 
  BEFORE UPDATE ON carousel_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();