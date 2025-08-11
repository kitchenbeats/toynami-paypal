-- ======================================
-- 🖼️ Add banner image field to brands table
-- ======================================

-- Add banner_url columns to brands table
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url_2 TEXT;

-- Add comments for clarity
COMMENT ON COLUMN brands.logo_url IS 'Small logo image for brand listings and cards';
COMMENT ON COLUMN brands.banner_url IS 'Primary banner image (e.g., for home page features)';
COMMENT ON COLUMN brands.banner_url_2 IS 'Secondary banner image (e.g., for brand detail pages)';