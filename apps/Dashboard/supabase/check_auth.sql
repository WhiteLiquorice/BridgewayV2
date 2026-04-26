SELECT id, email, email_confirmed_at IS NOT NULL AS confirmed
  FROM auth.users WHERE email = 'owner@maisonluxespa.com';
