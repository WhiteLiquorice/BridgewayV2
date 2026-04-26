-- Add secondary_color column to orgs (for guest booking accent color)
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#c9a84c';
SELECT 'secondary_color column added.' AS result;
