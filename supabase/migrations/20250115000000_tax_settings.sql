-- Create tax settings table for admin configuration
CREATE TABLE IF NOT EXISTS tax_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  provider TEXT DEFAULT 'taxcloud' CHECK (provider IN ('taxcloud', 'none')),
  
  -- TaxCloud credentials (encrypted in production)
  taxcloud_api_key TEXT,
  taxcloud_api_login_id TEXT,
  taxcloud_usps_user_id TEXT,
  
  -- Business origin address for tax calculation
  origin_address TEXT,
  origin_city TEXT,
  origin_state TEXT,
  origin_zip TEXT,
  origin_country TEXT DEFAULT 'US',
  
  -- Tax settings
  tax_shipping BOOLEAN DEFAULT true, -- Whether to tax shipping costs
  tax_enabled_states TEXT[], -- Array of states where tax collection is enabled
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Only one row should exist (singleton pattern)
CREATE UNIQUE INDEX idx_tax_settings_singleton ON tax_settings ((TRUE));

-- Create RLS policies
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;

-- Admin can view and update tax settings
CREATE POLICY "Admin can view tax settings" ON tax_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admin can update tax settings" ON tax_settings
  FOR UPDATE
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

CREATE POLICY "Admin can insert tax settings" ON tax_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Public read-only access for tax calculation status
CREATE POLICY "Public can check if tax is enabled" ON tax_settings
  FOR SELECT
  TO anon
  USING (TRUE);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_tax_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_tax_settings_timestamp
  BEFORE UPDATE ON tax_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_settings_updated_at();

-- Insert default settings (tax disabled by default for safety)
INSERT INTO tax_settings (
  enabled,
  provider,
  tax_shipping,
  tax_enabled_states
) VALUES (
  false,
  'taxcloud',
  true,
  ARRAY[]::TEXT[]
) ON CONFLICT DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE tax_settings IS 'Singleton table for tax calculation configuration. Only one row should exist.';
COMMENT ON COLUMN tax_settings.enabled IS 'Master switch for tax calculation. Set to false to disable all tax calculations.';
COMMENT ON COLUMN tax_settings.tax_enabled_states IS 'List of state codes where tax should be collected. Empty array means all states.';