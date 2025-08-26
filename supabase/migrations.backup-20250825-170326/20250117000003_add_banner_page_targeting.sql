-- Add page targeting to banners
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS target_pages JSONB DEFAULT '["*"]',
ADD COLUMN IF NOT EXISTS exclude_pages JSONB DEFAULT '[]';

-- Update position check to include 'top'
ALTER TABLE banners 
DROP CONSTRAINT IF EXISTS banners_position_check;

ALTER TABLE banners 
ADD CONSTRAINT banners_position_check 
CHECK (position IN ('top', 'upper', 'middle', 'lower', 'hero'));

-- Add comments
COMMENT ON COLUMN banners.target_pages IS 'Array of page paths where banner should show. Use ["*"] for all pages, ["/", "/products"] for specific pages';
COMMENT ON COLUMN banners.exclude_pages IS 'Array of page paths where banner should NOT show';

-- Add index for page targeting queries
CREATE INDEX IF NOT EXISTS banners_page_targeting_idx 
ON banners USING gin(target_pages);