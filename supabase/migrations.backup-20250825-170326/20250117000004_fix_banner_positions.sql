-- Fix banner positions to only be upper, middle, lower
ALTER TABLE banners 
DROP CONSTRAINT IF EXISTS banners_position_check;

ALTER TABLE banners 
ADD CONSTRAINT banners_position_check 
CHECK (position IN ('upper', 'middle', 'lower'));