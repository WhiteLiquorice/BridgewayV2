// ── PROFILES (business settings) ─────────────────────────────────────
// CREATE TABLE profiles (
//   id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id                         uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
//   business_name                   text NOT NULL DEFAULT '',
//   description                     text,
//   email                           text,
//   phone                           text,
//   hours_start                     text DEFAULT '09:00',
//   hours_end                       text DEFAULT '17:00',
//   booking_lead_time_hours         integer DEFAULT 2,
//   cancellation_pickup_window_hours integer DEFAULT 18,
//   created_at                      timestamptz DEFAULT now()
// );
// ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users manage own profile" ON profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Public can read profiles" ON profiles FOR SELECT TO anon USING (true);
//
// ── SERVICES ────────────────────────────────────────────────────────
// CREATE TABLE services (
//   id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   name             text NOT NULL,
//   duration_minutes integer DEFAULT 60,
//   price            numeric(10,2) DEFAULT 0,
//   active           boolean DEFAULT true,
//   created_at       timestamptz DEFAULT now()
// );
// ALTER TABLE services ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users manage own services" ON services FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Public can read active services" ON services FOR SELECT TO anon USING (active = true);
//
// ── BLOCKED_DATES ────────────────────────────────────────────────────
// CREATE TABLE blocked_dates (
//   id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   date       date NOT NULL,
//   reason     text,
//   created_at timestamptz DEFAULT now()
// );
// ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users manage own blocked dates" ON blocked_dates FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Public can read blocked dates" ON blocked_dates FOR SELECT TO anon USING (true);
//
// ── BOOKINGS ──────────────────────────────────────────────────────────
// CREATE TABLE bookings (
//   id                               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id                          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
//   service_id                       uuid REFERENCES services(id) ON DELETE SET NULL,
//   client_name                      text NOT NULL,
//   client_email                     text,
//   client_phone                     text,
//   scheduled_at                     timestamptz NOT NULL,
//   status                           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
//   cancellation_pickup_window_hours integer DEFAULT 18,
//   cancelled_at                     timestamptz,
//   notes                            text,
//   created_at                       timestamptz DEFAULT now()
// );
// ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users manage own bookings" ON bookings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Public can create bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
// CREATE POLICY "Public can read bookings for availability" ON bookings FOR SELECT TO anon USING (status IN ('confirmed','pending'));
//
// ── SEED DATA ─────────────────────────────────────────────────────────
// Replace <USER_ID> with your auth user id
//
// INSERT INTO profiles (user_id, business_name, description, email, phone)
// VALUES ('<USER_ID>', 'Riverside Med Spa', 'Premium skincare and wellness treatments in a serene setting.', 'hello@riversidemedspa.com', '(417) 555-0100');
//
// INSERT INTO services (user_id, name, duration_minutes, price) VALUES
//   ('<USER_ID>', 'Facial Treatment',   60, 120.00),
//   ('<USER_ID>', 'Botox Consultation', 45, 250.00),
//   ('<USER_ID>', 'Hydration Therapy',  30,  85.00);
//
// After inserting services, get their IDs with: SELECT id, name FROM services WHERE user_id = '<USER_ID>';
//
// INSERT INTO bookings (user_id, service_id, client_name, client_email, client_phone, scheduled_at, status) VALUES
//   ('<USER_ID>', '<facial_id>',     'Sarah Mitchell',  'sarah@email.com',  '555-0201', now()+interval'1 day'   + interval'9 hours',  'confirmed'),
//   ('<USER_ID>', '<botox_id>',      'James Thornton',  'james@email.com',  '555-0202', now()+interval'1 day'   + interval'11 hours', 'confirmed'),
//   ('<USER_ID>', '<hydration_id>',  'Rachel Kim',      'rachel@email.com', '555-0203', now()+interval'2 days'  + interval'10 hours', 'pending'),
//   ('<USER_ID>', '<facial_id>',     'David Larson',    'david@email.com',  '555-0204', now()+interval'3 days'  + interval'14 hours', 'confirmed'),
//   ('<USER_ID>', '<botox_id>',      'Emily Santos',    'emily@email.com',  '555-0205', now()+interval'5 days'  + interval'9 hours',  'confirmed'),
//   ('<USER_ID>', '<hydration_id>',  'Marcus Webb',     'marcus@email.com', '555-0206', now()+interval'5 days'  + interval'13 hours', 'pending'),
//   ('<USER_ID>', '<facial_id>',     'Priya Patel',     'priya@email.com',  '555-0207', now()+interval'7 days'  + interval'10 hours', 'confirmed'),
//   ('<USER_ID>', '<botox_id>',      'Tom Nguyen',      'tom@email.com',    '555-0208', now()+interval'8 days'  + interval'15 hours', 'pending'),
//   ('<USER_ID>', '<hydration_id>',  'Lisa Chen',       'lisa@email.com',   '555-0209', now()+interval'10 days' + interval'11 hours', 'confirmed'),
//   ('<USER_ID>', '<facial_id>',     'Chris Baker',     'chris@email.com',  '555-0210', now()+interval'12 days' + interval'9 hours',  'confirmed');

import { createClient } from '@supabase/supabase-js'
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
