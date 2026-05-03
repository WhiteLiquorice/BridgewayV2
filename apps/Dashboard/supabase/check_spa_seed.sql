-- Verify spa demo data integrity
SELECT
  (SELECT COUNT(*) FROM profiles WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS profiles,
  (SELECT COUNT(*) FROM services WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS services,
  (SELECT COUNT(*) FROM slots    WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS slots;

-- Show the auth user that was created
SELECT id, email, email_confirmed_at IS NOT NULL AS confirmed
  FROM auth.users WHERE email = 'owner@wellnessco.com';

-- Show profiles
SELECT id, user_id, role, full_name FROM profiles
  WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  ORDER BY role;
