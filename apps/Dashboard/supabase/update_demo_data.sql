-- Update demo org: Wellness Co with midnight green + gold
UPDATE orgs SET
  name            = 'Wellness Co',
  slug            = 'wellness-co',
  primary_color   = '#203536',
  secondary_color = '#c9a84c'
WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';

-- Update org_settings welcome text to match new name
UPDATE org_settings SET
  booking_config = booking_config || '{"welcome_text":"Welcome to Wellness Co. Your wellbeing starts here.","confirmation_text":"Your reservation has been received. We will reach out within 2 hours to confirm. Please arrive 10 minutes early."}'::jsonb
WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001';

-- Rename practitioners to normal English names
UPDATE profiles SET full_name = 'Sarah Mitchell' WHERE id = 'bbbbbbbb-0000-0000-0000-000000000001';
UPDATE profiles SET full_name = 'Emily Chen'     WHERE id = 'bbbbbbbb-0000-0000-0000-000000000002';
UPDATE profiles SET full_name = 'James Okafor'   WHERE id = 'bbbbbbbb-0000-0000-0000-000000000003';

-- Update owner profile name too
UPDATE profiles SET full_name = 'Alex Winters'
  WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND role = 'admin';

SELECT 'Demo data updated.' AS result,
  (SELECT name FROM orgs WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001') AS org_name,
  (SELECT primary_color FROM orgs WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001') AS primary_color,
  (SELECT secondary_color FROM orgs WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001') AS accent_color;
