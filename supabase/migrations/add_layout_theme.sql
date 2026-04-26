-- Add layout theme column to orgs table
-- Allows org admins to choose a UI layout theme that applies across all apps

ALTER TABLE orgs
  ADD COLUMN IF NOT EXISTS layout_theme text NOT NULL DEFAULT 'modern';

ALTER TABLE orgs
  ADD CONSTRAINT orgs_layout_theme_check
  CHECK (layout_theme IN ('modern', 'executive', 'minimal', 'classic'));
