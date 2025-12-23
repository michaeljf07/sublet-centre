-- Add missing columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "userId" text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "moveIn" timestamp with time zone;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "moveOut" timestamp with time zone;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "amenities" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "image" text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS "posterName" text;
