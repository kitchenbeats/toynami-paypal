-- ======================================
-- Add media_id fields to existing tables
-- ======================================

-- Add media_id fields to brands table
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS logo_media_id UUID REFERENCES media_library(id),
ADD COLUMN IF NOT EXISTS banner_media_id UUID REFERENCES media_library(id),
ADD COLUMN IF NOT EXISTS banner_media_id_2 UUID REFERENCES media_library(id);

-- REMOVED: product_images table no longer exists - using media_library instead
-- ALTER TABLE product_images 
-- ADD COLUMN IF NOT EXISTS media_id UUID REFERENCES media_library(id);

-- Add media_id to carousel_slides table
ALTER TABLE carousel_slides 
ADD COLUMN IF NOT EXISTS media_id UUID REFERENCES media_library(id);

-- Add media_id to banners table
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS media_id UUID REFERENCES media_library(id);

-- Add media_id to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS featured_image_media_id UUID REFERENCES media_library(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_logo_media_id ON brands(logo_media_id);
CREATE INDEX IF NOT EXISTS idx_brands_banner_media_id ON brands(banner_media_id);
CREATE INDEX IF NOT EXISTS idx_brands_banner_media_id_2 ON brands(banner_media_id_2);
-- CREATE INDEX IF NOT EXISTS idx_product_images_media_id ON product_images(media_id); -- REMOVED
CREATE INDEX IF NOT EXISTS idx_carousel_slides_media_id ON carousel_slides(media_id);
CREATE INDEX IF NOT EXISTS idx_banners_media_id ON banners(media_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured_image_media_id ON blog_posts(featured_image_media_id);

-- Add comments
COMMENT ON COLUMN brands.logo_media_id IS 'Reference to media library for brand logo';
COMMENT ON COLUMN brands.banner_media_id IS 'Reference to media library for primary brand banner';
COMMENT ON COLUMN brands.banner_media_id_2 IS 'Reference to media library for secondary brand banner';
-- COMMENT ON COLUMN product_images.media_id IS 'Reference to media library for product image'; -- REMOVED
COMMENT ON COLUMN carousel_slides.media_id IS 'Reference to media library for carousel slide image';
COMMENT ON COLUMN banners.media_id IS 'Reference to media library for banner image';
COMMENT ON COLUMN blog_posts.featured_image_media_id IS 'Reference to media library for blog post featured image';