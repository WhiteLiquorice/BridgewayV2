/*
 * ═══════════════════════════════════════════════════════════════════
 * SUPABASE SCHEMA — paste into SQL Editor and run
 * ═══════════════════════════════════════════════════════════════════
 *
 * -- ── PROFILES ──────────────────────────────────────────────────
 * CREATE TABLE profiles (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
 *   role        text NOT NULL DEFAULT 'client' CHECK (role IN ('admin','client')),
 *   full_name   text NOT NULL DEFAULT '',
 *   email       text,
 *   phone       text,
 *   business_id uuid,  -- set to admin profile.id for clients
 *   created_at  timestamptz DEFAULT now()
 * );
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * -- Admins: full access to profiles in their business
 * CREATE POLICY "Admins manage business profiles"
 *   ON profiles FOR ALL TO authenticated
 *   USING (
 *     auth.uid() = user_id
 *     OR business_id = (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
 *   )
 *   WITH CHECK (
 *     auth.uid() = user_id
 *     OR business_id = (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
 *   );
 *
 * -- ── APPOINTMENTS ────────────────────────────────────────────────
 * CREATE TABLE appointments (
 *   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   business_id  uuid NOT NULL,  -- references profiles.id of admin
 *   client_id    uuid NOT NULL,  -- references profiles.id of client
 *   service_name text NOT NULL DEFAULT '',
 *   scheduled_at timestamptz NOT NULL,
 *   status       text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','completed','cancelled')),
 *   amount       numeric(10,2) DEFAULT 0,
 *   notes        text,
 *   created_at   timestamptz DEFAULT now()
 * );
 * ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Business access to appointments"
 *   ON appointments FOR ALL TO authenticated
 *   USING (
 *     business_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
 *     OR client_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
 *   )
 *   WITH CHECK (
 *     business_id = (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
 *   );
 *
 * -- ── DOCUMENTS ───────────────────────────────────────────────────
 * CREATE TABLE documents (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   business_id uuid NOT NULL,
 *   client_id   uuid NOT NULL,
 *   file_name   text NOT NULL,
 *   file_path   text NOT NULL,  -- storage path, e.g. "documents/{client_id}/{filename}"
 *   uploaded_at timestamptz DEFAULT now()
 * );
 * ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Business access to documents"
 *   ON documents FOR ALL TO authenticated
 *   USING (
 *     business_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
 *     OR client_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
 *   )
 *   WITH CHECK (
 *     business_id = (SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
 *   );
 *
 * -- ── CANCELLATION_SETTINGS ───────────────────────────────────────
 * CREATE TABLE cancellation_settings (
 *   id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   business_id          uuid NOT NULL UNIQUE,
 *   pickup_window_hours  integer DEFAULT 18,
 *   created_at           timestamptz DEFAULT now()
 * );
 * ALTER TABLE cancellation_settings ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Admin manages own cancellation settings"
 *   ON cancellation_settings FOR ALL TO authenticated
 *   USING (business_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));
 * CREATE POLICY "Clients can read cancellation settings"
 *   ON cancellation_settings FOR SELECT TO authenticated
 *   USING (true);
 *
 * -- ── STORAGE BUCKET ──────────────────────────────────────────────
 * -- In Supabase dashboard > Storage > New bucket:
 * -- Name: documents, Public: false
 * -- Then add storage policy:
 * -- Authenticated users can upload to their business folder
 * -- Authenticated users can read files in their business folder
 *
 * -- ── SEED DATA ────────────────────────────────────────────────────
 * -- 1. Create auth users in Supabase Auth dashboard:
 * --    admin@portal.com (password: admin123) → get UUID → <ADMIN_UID>
 * --    client1@portal.com (password: client123) → <CLIENT1_UID>
 * --    client2@portal.com (password: client123) → <CLIENT2_UID>
 * --    client3@portal.com (password: client123) → <CLIENT3_UID>
 * --
 * -- 2. Insert profiles:
 * INSERT INTO profiles (id, user_id, role, full_name, email, phone) VALUES
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<ADMIN_UID>',   'admin',  'Admin User',       'admin@portal.com',   '(417) 555-0100');
 * INSERT INTO profiles (user_id, role, full_name, email, phone, business_id) VALUES
 *   ('<CLIENT1_UID>', 'client', 'Sarah Mitchell', 'client1@portal.com', '555-0201', 'aaaaaaaa-0000-0000-0000-000000000001'),
 *   ('<CLIENT2_UID>', 'client', 'James Thornton', 'client2@portal.com', '555-0202', 'aaaaaaaa-0000-0000-0000-000000000001'),
 *   ('<CLIENT3_UID>', 'client', 'Rachel Kim',     'client3@portal.com', '555-0203', 'aaaaaaaa-0000-0000-0000-000000000001');
 * --
 * -- 3. Get client profile IDs: SELECT id, full_name FROM profiles WHERE role = 'client';
 * -- Then insert appointments and documents using those IDs.
 * --
 * INSERT INTO appointments (business_id, client_id, service_name, scheduled_at, status, amount) VALUES
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<sarah_id>', 'Facial Treatment',   now()+interval'2 days',  'confirmed', 120.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<sarah_id>', 'Hydration Therapy',  now()+interval'14 days', 'confirmed',  85.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<james_id>', 'Botox Consultation', now()+interval'3 days',  'confirmed', 250.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<james_id>', 'Facial Treatment',   now()-interval'10 days', 'completed', 120.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<rachel_id>','Hydration Therapy',  now()+interval'5 days',  'confirmed',  85.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<rachel_id>','Botox Consultation', now()-interval'5 days',  'completed', 250.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<sarah_id>', 'Facial Treatment',   now()-interval'30 days', 'completed', 120.00),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<james_id>', 'Hydration Therapy',  now()-interval'20 days', 'completed',  85.00);
 * --
 * INSERT INTO documents (business_id, client_id, file_name, file_path) VALUES
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<sarah_id>', 'Intake Form.pdf',     'documents/<sarah_id>/intake-form.pdf'),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<james_id>', 'Treatment Plan.pdf',  'documents/<james_id>/treatment-plan.pdf'),
 *   ('aaaaaaaa-0000-0000-0000-000000000001', '<rachel_id>','Welcome Packet.pdf',  'documents/<rachel_id>/welcome-packet.pdf');
 *
 * INSERT INTO cancellation_settings (business_id, pickup_window_hours)
 * VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 18);
 */

import { createClient } from '@supabase/supabase-js'
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
