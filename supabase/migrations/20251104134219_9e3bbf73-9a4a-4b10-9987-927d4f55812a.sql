-- Add latitude and longitude columns to pets table for geolocation
ALTER TABLE pets ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add index for better performance on location-based queries
CREATE INDEX IF NOT EXISTS idx_pets_location ON pets(latitude, longitude);