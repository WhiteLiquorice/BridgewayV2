-- ═══════════════════════════════════════════════════════════════════════════
-- Wellness Co — Demo Seed
-- Run via: npx supabase db query --linked --file supabase/seed_spa_demo.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Clean up any previous run (safe to re-run)
DELETE FROM slots        WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001';
DELETE FROM services     WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001';
DELETE FROM org_settings WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001';
DELETE FROM profiles     WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001';
DELETE FROM orgs         WHERE id     = 'aaaaaaaa-0000-0000-0000-000000000001';
DELETE FROM auth.users   WHERE email  = 'owner@wellnessco.com';

-- ── 1. Ensure columns exist ───────────────────────────────────────────────────
ALTER TABLE orgs   ADD COLUMN IF NOT EXISTS status              text    DEFAULT 'active' CHECK (status IN ('active','inactive'));
ALTER TABLE orgs   ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;
ALTER TABLE orgs   ADD COLUMN IF NOT EXISTS layout_theme        text    DEFAULT 'modern';
ALTER TABLE orgs   ADD COLUMN IF NOT EXISTS app_theme           text    DEFAULT 'modern';
ALTER TABLE slots  ADD COLUMN IF NOT EXISTS staff_id            uuid    REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS booking_config    jsonb   DEFAULT '{}';
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS payment_required  boolean DEFAULT false;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS stripe_customer_id      text;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS stripe_subscription_id  text;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS payment_past_due boolean DEFAULT false;

-- ── 2. Org ────────────────────────────────────────────────────────────────────
INSERT INTO orgs (id, name, slug, address, phone, website, primary_color, status, onboarding_complete, layout_theme, app_theme)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Wellness Co',
  'wellness-co',
  '402 Magnolia Lane, Suite 100, Nashville, TN 37201',
  '(615) 555-0142',
  'https://wellnessco.com',
  '#9b7561',
  'active', true, 'minimal', 'luxury'
);

-- ── 3. Auth user (owner login: owner@wellnessco.com / SpaDemo2026!) ────────
-- Pass org_id + role in metadata so handle_new_user() trigger creates the
-- profile correctly — no manual profile insert needed for the owner.
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_sso_user, is_super_admin
) VALUES (
  'dddddddd-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'owner@wellnessco.com',
  crypt('SpaDemo2026!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Claire Beaumont","org_id":"aaaaaaaa-0000-0000-0000-000000000001","role":"admin"}'::jsonb,
  false, false
);

-- ── 4. Staff profiles (no user_id — invite pending) ──────────────────────────
INSERT INTO profiles (id, org_id, role, full_name, email, is_active) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'staff', 'Margaux Delacroix', 'margaux@wellnessco.com', true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'staff', 'Isabelle Hart',     'isabelle@wellnessco.com', true),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'staff', 'Theo Kim',          'theo@wellnessco.com',     true);

-- ── 5. Services ───────────────────────────────────────────────────────────────
INSERT INTO services (id, org_id, name, description, duration_minutes, price, is_archived) VALUES
  ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Swedish Relaxation Massage',
   'Gentle flowing strokes to ease tension and quiet the mind. Perfect for first-time guests.',
   60, 95.00, false),
  ('cccccccc-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Deep Tissue Therapy',
   'Firm, targeted pressure to release chronic tension and restore mobility where you need it most.',
   60, 115.00, false),
  ('cccccccc-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Hot Stone Journey',
   'Warm volcanic basalt stones melt tension at the deepest level. Profoundly restorative.',
   75, 140.00, false),
  ('cccccccc-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Signature Facial',
   'A fully customized facial tailored to your skin''s needs — cleanse, treat, and illuminate.',
   60, 98.00, false),
  ('cccccccc-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Brightening Vitamin C Facial',
   'A radiance-boosting treatment rich in antioxidants for visibly luminous, even-toned skin.',
   50, 80.00, false),
  ('cccccccc-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Scalp & Tension Relief',
   'A focused 30-minute ritual for the scalp, neck, and shoulders. Deeply calming.',
   30, 58.00, false),
  ('cccccccc-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Couples Retreat',
   'Share a moment of peace in our private couples suite — side-by-side Swedish massage.',
   60, 185.00, false),
  ('cccccccc-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001',
   'Detox Body Wrap',
   'A full-body ritual — dry brush exfoliation, purifying mineral wrap, and a calming scalp massage.',
   90, 155.00, false);

-- ── 6. Slots (next 14 days, Mon–Sat, 3 staff rotating, 6 times/day) ──────────
DO $$
DECLARE
  org_id     uuid   := 'aaaaaaaa-0000-0000-0000-000000000001';
  staff_ids  uuid[] := ARRAY[
    'bbbbbbbb-0000-0000-0000-000000000001'::uuid,
    'bbbbbbbb-0000-0000-0000-000000000002'::uuid,
    'bbbbbbbb-0000-0000-0000-000000000003'::uuid
  ];
  times      text[] := ARRAY['09:00','10:30','12:00','13:30','15:00','16:30'];
  d          date;
  t          text;
  idx        integer := 0;
BEGIN
  FOR d IN
    SELECT gs::date FROM generate_series(CURRENT_DATE + 1, CURRENT_DATE + 14, '1 day'::interval) gs
  LOOP
    CONTINUE WHEN EXTRACT(DOW FROM d) = 0;
    FOREACH t IN ARRAY times LOOP
      INSERT INTO slots (org_id, staff_id, start_time, end_time, status)
      VALUES (
        org_id,
        staff_ids[(idx % 3) + 1],
        (d::text || ' ' || t)::timestamp AT TIME ZONE 'America/Chicago',
        (d::text || ' ' || t)::timestamp AT TIME ZONE 'America/Chicago' + interval '60 minutes',
        'available'
      );
      idx := idx + 1;
    END LOOP;
  END LOOP;
END $$;

-- ── 7. Org settings ───────────────────────────────────────────────────────────
INSERT INTO org_settings (org_id, payment_required, booking_config)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  false,
  '{"show_providers":true,"require_phone":true,"welcome_text":"Welcome to Wellness Co. Your journey to health begins here.","confirmation_text":"Your reservation has been received. We will reach out within 2 hours to confirm. Please arrive 10 minutes early to complete your guest profile."}'::jsonb
)
ON CONFLICT (org_id) DO UPDATE SET
  booking_config   = EXCLUDED.booking_config,
  payment_required = EXCLUDED.payment_required;

-- ── 8. Anon read policy for staff names in guest booking ─────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'Public can read staff profiles'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Public can read staff profiles"
        ON profiles FOR SELECT TO anon
        USING (role IN ('admin','manager','staff'))
    $pol$;
  END IF;
END $$;

-- ── Result ────────────────────────────────────────────────────────────────────
SELECT 'Seeded.' AS status,
  (SELECT COUNT(*) FROM profiles WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS profiles,
  (SELECT COUNT(*) FROM services WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS services,
  (SELECT COUNT(*) FROM slots    WHERE org_id = 'aaaaaaaa-0000-0000-0000-000000000001') AS slots;
