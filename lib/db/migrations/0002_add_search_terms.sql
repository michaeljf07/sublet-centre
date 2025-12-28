-- Add search terms column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS search_terms text;

-- Create index for faster text search
CREATE INDEX IF NOT EXISTS listings_search_terms_idx ON listings USING gin(to_tsvector('english', search_terms));
