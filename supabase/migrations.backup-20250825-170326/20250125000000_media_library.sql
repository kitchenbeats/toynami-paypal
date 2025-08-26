-- ======================================
-- 📸 Media Library System
-- WordPress-style media management
-- ======================================

-- Media library table
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File information
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in storage bucket
  file_url TEXT NOT NULL, -- Full URL for direct access
  file_size INTEGER, -- Size in bytes
  mime_type TEXT,
  file_extension TEXT,
  
  -- Media metadata
  title TEXT,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  
  -- Image specific metadata
  width INTEGER,
  height INTEGER,
  
  -- Organization
  folder TEXT DEFAULT 'uncategorized', -- Virtual folders for organization
  tags TEXT[], -- Array of tags for searching
  sort_order INTEGER DEFAULT 0, -- For ordering items within context
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0, -- Track how many times it's used
  last_used_at TIMESTAMPTZ,
  
  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Search vector (will be updated via trigger)
  search_vector tsvector
);

-- Indexes for performance
CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX idx_media_library_search ON media_library USING GIN (search_vector);
CREATE INDEX idx_media_library_tags ON media_library USING GIN (tags);
CREATE INDEX idx_media_library_uploaded_by ON media_library(uploaded_by);

-- Media usage tracking (which entities use which media)
CREATE TABLE IF NOT EXISTS media_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'product', 'banner', 'blog_post', 'brand', etc.
  entity_id TEXT NOT NULL, -- ID of the entity using this media
  field_name TEXT, -- Which field is using this media (e.g., 'hero_image', 'gallery_image_1')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(media_id, entity_type, entity_id, field_name)
);

-- Index for finding all usage of a media item
CREATE INDEX idx_media_usage_media_id ON media_usage(media_id);
CREATE INDEX idx_media_usage_entity ON media_usage(entity_type, entity_id);

-- ======================================
-- 🔒 RLS Policies
-- ======================================

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_usage ENABLE ROW LEVEL SECURITY;

-- Media library policies
CREATE POLICY "Public can view media" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON media_library
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own media" ON media_library
  FOR UPDATE TO authenticated
  USING (auth.uid() = uploaded_by OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can delete media" ON media_library
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- Media usage policies
CREATE POLICY "Public can view media usage" ON media_usage
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage media usage" ON media_usage
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
  ));

-- ======================================
-- 🔧 Helper Functions
-- ======================================

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_media_usage(media_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE media_library 
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = media_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement usage count
CREATE OR REPLACE FUNCTION decrement_media_usage(media_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE media_library 
  SET 
    usage_count = GREATEST(usage_count - 1, 0)
  WHERE id = media_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track media usage
CREATE OR REPLACE FUNCTION track_media_usage(
  p_media_id UUID,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_field_name TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO media_usage (media_id, entity_type, entity_id, field_name)
  VALUES (p_media_id, p_entity_type, p_entity_id, p_field_name)
  ON CONFLICT (media_id, entity_type, entity_id, field_name) DO NOTHING;
  
  -- Update usage count
  PERFORM increment_media_usage(p_media_id);
END;
$$ LANGUAGE plpgsql;

-- Function to untrack media usage
CREATE OR REPLACE FUNCTION untrack_media_usage(
  p_media_id UUID,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_field_name TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  DELETE FROM media_usage 
  WHERE 
    media_id = p_media_id AND 
    entity_type = p_entity_type AND 
    entity_id = p_entity_id AND 
    (field_name = p_field_name OR (field_name IS NULL AND p_field_name IS NULL));
  
  -- Update usage count
  PERFORM decrement_media_usage(p_media_id);
END;
$$ LANGUAGE plpgsql;

-- Function to search media
CREATE OR REPLACE FUNCTION search_media(
  search_term TEXT DEFAULT NULL,
  folder_filter TEXT DEFAULT NULL,
  mime_type_filter TEXT DEFAULT NULL,
  tag_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  filename TEXT,
  file_url TEXT,
  title TEXT,
  alt_text TEXT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  folder TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.filename,
    m.file_url,
    m.title,
    m.alt_text,
    m.mime_type,
    m.width,
    m.height,
    m.file_size,
    m.folder,
    m.tags,
    m.created_at
  FROM media_library m
  WHERE 
    (search_term IS NULL OR m.search_vector @@ plainto_tsquery('english', search_term))
    AND (folder_filter IS NULL OR m.folder = folder_filter)
    AND (mime_type_filter IS NULL OR m.mime_type LIKE mime_type_filter || '%')
    AND (tag_filter IS NULL OR m.tags && tag_filter)
  ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_media_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.alt_text, '') || ' ' || 
    COALESCE(NEW.caption, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.original_name, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search vector
CREATE TRIGGER update_media_search_vector_trigger
  BEFORE INSERT OR UPDATE ON media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_media_search_vector();

-- Trigger to update updated_at
CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE media_library IS 'Central media library for all uploaded files and images';
COMMENT ON TABLE media_usage IS 'Tracks which entities are using which media files';
COMMENT ON FUNCTION search_media IS 'Search media library with filters';