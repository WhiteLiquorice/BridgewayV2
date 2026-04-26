-- Notify PostgREST to reload its schema cache
-- This fixes "Database error querying schema" after ALTER TABLE migrations
NOTIFY pgrst, 'reload schema';
SELECT 'Schema cache reloaded.' AS result;
