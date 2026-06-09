-- Add low_stock_threshold to products table
-- Allows setting custom warning levels for low inventory. Defaults to 10.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer DEFAULT 10;
