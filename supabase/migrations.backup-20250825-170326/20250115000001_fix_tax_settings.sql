-- Remove sensitive API key fields from tax_settings table
-- API keys should ONLY be stored in environment variables

ALTER TABLE tax_settings 
  DROP COLUMN IF EXISTS taxcloud_api_key,
  DROP COLUMN IF EXISTS taxcloud_api_login_id,
  DROP COLUMN IF EXISTS taxcloud_usps_user_id;

-- Add comment explaining security best practice
COMMENT ON TABLE tax_settings IS 'Configuration for tax calculation. API credentials are stored in environment variables for security.';