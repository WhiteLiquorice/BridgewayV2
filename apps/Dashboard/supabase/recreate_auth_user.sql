-- Step 1: Delete the broken auth user and their auto-created profile
-- (The profile was created by handle_new_user trigger on the original bad INSERT)
DELETE FROM profiles
  WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001'
    AND role = 'admin'
    AND (user_id = 'dddddddd-0000-0000-0000-000000000001' OR user_id IS NULL);

DELETE FROM auth.users WHERE id = 'dddddddd-0000-0000-0000-000000000001';

SELECT 'Bad auth user removed. Now run fix-auth-user.js to recreate via Admin API.' AS next_step;
