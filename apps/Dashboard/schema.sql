-- ═══════════════════════════════════════════════════════════════════════════
-- RLS AUDIT (April 2026)
-- All tables verified for org_id scoping via get_my_org_id().
-- Tables with role-restricted access:
--   org_settings  — admin/manager only (ALL operations)
--   activity_log  — admin/manager read; staff INSERT restricted (see below)
--   notification_settings — admin/manager only
--   notifications_log     — admin/manager read only (service role writes)
-- Booking insert: anon allowed (public form); read/update: staff (admin/manager/staff) only
-- Placeholder: floor_zones, seat_assignments — add org_id scoping + staff-only policies
-- Placeholder: intake_form_templates, intake_form_submissions — add org_id scoping;
--   templates: admin/manager write, staff/patient read;
--   submissions: patient INSERT, staff/admin read
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- BRIDGEWAY — Unified Database Schema
-- Version 1.0 · March 2026
--
-- Run this in the Supabase SQL Editor for the shared project.
-- All four apps (Dashboard, Portal, Booking, Admin) point at this project.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── HELPER FUNCTION ─────────────────────────────────────────────────────────
-- Returns the org_id for the currently authenticated user.
-- Used in RLS policies to avoid repeated subqueries.
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT org_id FROM profiles WHERE user_id = auth.uid() LIMIT 1
$$;

-- Returns the role for the currently authenticated user.
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1
$$;


-- ── ORGS ────────────────────────────────────────────────────────────────────
-- One row per practice. Created by Bridgeway staff on new client onboarding.
CREATE TABLE IF NOT EXISTS orgs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text        NOT NULL,
  slug            text        UNIQUE,           -- used in booking URLs: /book/{slug}
  address         text,
  phone           text,
  website         text,
  logo_url        text,                         -- Supabase Storage URL
  primary_color   text        DEFAULT '#f59e0b', -- hex, applies to Portal + Booking App
  subscription_tier text      DEFAULT 'base'
                              CHECK (subscription_tier IN ('base', 'pro', 'enterprise')),
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;

-- Org members can read their own org
CREATE POLICY "Org members can read their org"
  ON orgs FOR SELECT TO authenticated
  USING (id = get_my_org_id());

-- Org admins can update their org
CREATE POLICY "Admins can update their org"
  ON orgs FOR UPDATE TO authenticated
  USING (id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Public read for booking page: anyone can look up an org by slug
CREATE POLICY "Public can read org by slug"
  ON orgs FOR SELECT TO anon
  USING (slug IS NOT NULL);

-- Session idle-timeout per role (minutes). Enforced client-side by AuthContext.
-- Defaults: staff 30 min, manager 480 min, admin 480 min, patient 480 min.
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS session_timeout_admin_min   integer DEFAULT 480;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS session_timeout_manager_min integer DEFAULT 480;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS session_timeout_staff_min   integer DEFAULT 30;
-- Optional: patient portal idle timeout
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS session_timeout_patient_min integer DEFAULT 480;
-- Patient self check-in: controls whether the "I'm Here" button appears in the portal
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS patient_checkin_enabled boolean DEFAULT true;


-- ── PROFILES ────────────────────────────────────────────────────────────────
-- One row per user (staff or patient). Extends auth.users.
-- Role determines which app(s) the user can access.
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE, -- null until invite accepted
  org_id      uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  role        text        NOT NULL DEFAULT 'staff'
                          CHECK (role IN ('admin', 'manager', 'staff', 'patient')),
  full_name   text,
  email       text,                       -- denormalized for display before invite accepted
  phone       text,
  is_active   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own profile (name, phone)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin/Manager can read all profiles in their org
CREATE POLICY "Admins can read org profiles"
  ON profiles FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Admin/Manager can insert new profiles (invite users)
CREATE POLICY "Admins can invite users"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Admin/Manager can update profiles in their org (role changes, deactivation)
CREATE POLICY "Admins can update org profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

-- Trigger: auto-link auth.users to profiles on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- If a profile row exists with this email (pre-created by admin invite),
  -- link it to the new auth user. Otherwise do nothing — admin creates profiles.
  UPDATE profiles
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── CLIENTS ─────────────────────────────────────────────────────────────────
-- Patient/client records. No clinical data — strictly administrative.
CREATE TABLE IF NOT EXISTS clients (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  name          text        NOT NULL,
  email         text,
  phone         text,
  date_of_birth date,
  address       text,
  notes         text,                       -- admin notes only — no PHI
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- All staff roles can read clients in their org
CREATE POLICY "Staff can read org clients"
  ON clients FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

-- Admin/Manager can insert clients
CREATE POLICY "Admins can create clients"
  ON clients FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Admin/Manager can update clients
CREATE POLICY "Admins can update clients"
  ON clients FOR UPDATE TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

-- Patients can read their own client record
-- NOTE: this requires linking auth.uid() → profiles.user_id → clients.email match.
-- Conservative decision: patient reads their own row by email match.
CREATE POLICY "Patients can read own client record"
  ON clients FOR SELECT TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  );


-- ── SERVICES ────────────────────────────────────────────────────────────────
-- Service catalog defined per org. Feeds Booking App and Appointments.
CREATE TABLE IF NOT EXISTS services (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  name             text        NOT NULL,
  description      text,
  duration_minutes integer     DEFAULT 60,
  price            numeric(10,2) DEFAULT 0,
  is_archived      boolean     DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- All org members (including patients) can read active services
CREATE POLICY "Org members can read active services"
  ON services FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND is_archived = false);

-- Admin/Manager can manage services
CREATE POLICY "Admins can manage services"
  ON services FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

-- Public (anon) can read active services for booking page
CREATE POLICY "Public can read active services"
  ON services FOR SELECT TO anon
  USING (is_archived = false);


-- ── APPOINTMENTS ────────────────────────────────────────────────────────────
-- Scheduled events. Central table — fed by both manual creation and booking conversion.
CREATE TABLE IF NOT EXISTS appointments (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  client_id        uuid        REFERENCES clients(id) ON DELETE SET NULL,
  service_id       uuid        REFERENCES services(id) ON DELETE SET NULL,
  staff_id         uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_at     timestamptz NOT NULL,
  duration_minutes integer     DEFAULT 60,
  status           text        NOT NULL DEFAULT 'confirmed'
                               CHECK (status IN ('pending', 'confirmed', 'arrived', 'with_provider', 'completed', 'cancelled')),
  amount           numeric(10,2) DEFAULT 0,
  notes            text,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- All staff can read appointments in their org
CREATE POLICY "Staff can read org appointments"
  ON appointments FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

-- Admin/Manager can create/update appointments
CREATE POLICY "Admins can manage appointments"
  ON appointments FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

-- Staff can update appointment status (confirm, complete, cancel)
CREATE POLICY "Staff can update appointment status"
  ON appointments FOR UPDATE TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'staff')
  WITH CHECK (org_id = get_my_org_id());

-- Patients can read their own appointments (matched by client email)
CREATE POLICY "Patients can read own appointments"
  ON appointments FOR SELECT TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
  );

-- Patients can cancel their own upcoming appointments
CREATE POLICY "Patients can cancel own appointments"
  ON appointments FOR UPDATE TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
    AND status IN ('pending', 'confirmed')
  )
  WITH CHECK (status = 'cancelled');       -- patients can only set status to cancelled


-- ── DOCUMENTS ───────────────────────────────────────────────────────────────
-- File metadata for portal documents. Actual files in Supabase Storage.
-- No PHI — intake forms, post-visit summaries, general admin docs only.
CREATE TABLE IF NOT EXISTS documents (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  client_id    uuid        REFERENCES clients(id) ON DELETE CASCADE,
  title        text        NOT NULL,                    -- display name shown in Portal
  file_url     text        NOT NULL,                    -- full Supabase Storage URL
  uploaded_by  uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Admin/Manager/Staff can read all org documents
CREATE POLICY "Staff can read org documents"
  ON documents FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

-- Admin/Manager can upload and delete documents
CREATE POLICY "Admins can manage documents"
  ON documents FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

-- Patients can read documents shared with them
CREATE POLICY "Patients can read own documents"
  ON documents FOR SELECT TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
  );


-- ── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
-- Org-wide announcements posted by managers, visible to all staff on any device.
CREATE TABLE IF NOT EXISTS announcements (
  id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id    uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  message   text        NOT NULL,
  posted_by uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  posted_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- All org members can read announcements
CREATE POLICY "Org members can read announcements"
  ON announcements FOR SELECT TO authenticated
  USING (org_id = get_my_org_id());

-- Admin/Manager can post announcements
CREATE POLICY "Managers can post announcements"
  ON announcements FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Admin/Manager can delete announcements
CREATE POLICY "Managers can delete announcements"
  ON announcements FOR DELETE TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));


-- ── SLOTS ────────────────────────────────────────────────────────────────────
-- Available booking windows for the public Booking App.
CREATE TABLE IF NOT EXISTS slots (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  staff_id    uuid        REFERENCES profiles(id) ON DELETE SET NULL,  -- optional assigned staff
  start_time  timestamptz NOT NULL,
  end_time    timestamptz NOT NULL,
  status      text        NOT NULL DEFAULT 'available'
                          CHECK (status IN ('available', 'booked', 'blocked')),
  created_at  timestamptz DEFAULT now()
);

-- Add staff_id if table already exists (safe re-run)
ALTER TABLE slots ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

-- Staff can manage slots
CREATE POLICY "Staff can manage slots"
  ON slots FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (org_id = get_my_org_id());

-- Patients can read available slots for their org
CREATE POLICY "Patients can read available slots"
  ON slots FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'patient' AND status = 'available');

-- Public can read available slots for booking
CREATE POLICY "Public can read available slots"
  ON slots FOR SELECT TO anon
  USING (status = 'available');


-- ── BOOKINGS ─────────────────────────────────────────────────────────────────
-- Public intake submissions. No account required to submit.
-- Staff confirm → booking converts to an appointment row.
CREATE TABLE IF NOT EXISTS bookings (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  service_id     uuid        REFERENCES services(id) ON DELETE SET NULL,
  slot_id        uuid        REFERENCES slots(id) ON DELETE SET NULL,   -- selected availability slot
  appointment_id uuid        REFERENCES appointments(id) ON DELETE SET NULL, -- set on confirmation
  name           text        NOT NULL,    -- submitted by patient
  email          text,
  phone          text,
  preferred_date date,                    -- patient's requested date (used when no slot selected)
  preferred_time time,                    -- patient's requested time (used when no slot selected)
  notes          text,
  status         text        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at     timestamptz DEFAULT now()
);

-- Add slot_id if table already exists (safe re-run)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS slot_id uuid REFERENCES slots(id) ON DELETE SET NULL;

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public (anon) can submit bookings
CREATE POLICY "Public can submit bookings"
  ON bookings FOR INSERT TO anon
  WITH CHECK (true);

-- Staff can read and manage bookings in their org
CREATE POLICY "Staff can manage bookings"
  ON bookings FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (org_id = get_my_org_id());

-- Authenticated patients can submit booking requests for their org
CREATE POLICY "Patients can submit bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() = 'patient');

-- Trigger: when a booking with a slot_id is inserted, mark that slot as booked.
-- Uses SECURITY DEFINER so patients (who have no UPDATE on slots) can still
-- trigger the status change via the server-side function.
CREATE OR REPLACE FUNCTION handle_booking_slot()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NEW.slot_id IS NOT NULL THEN
    UPDATE slots SET status = 'booked' WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_booking_inserted
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_slot();


-- ── WIDGET_CONFIGS ────────────────────────────────────────────────────────────
-- Per-user dashboard widget layout and visibility. One row per user.
CREATE TABLE IF NOT EXISTS widget_configs (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  org_id     uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  config     jsonb       NOT NULL DEFAULT '{}',  -- { order: [...], hidden: [...] }
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;

-- Users manage only their own widget config
CREATE POLICY "Users manage own widget config"
  ON widget_configs FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ── NOTIFICATION_SETTINGS ─────────────────────────────────────────────────────
-- Per-org notification preferences (toggles + timing).
CREATE TABLE IF NOT EXISTS notification_settings (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  sms_enabled              boolean     DEFAULT false, -- master SMS toggle (costs money)
  email_enabled            boolean     DEFAULT true,  -- master email toggle
  sms_confirmed            boolean     DEFAULT true,  -- SMS on appointment confirm
  email_confirmed          boolean     DEFAULT true,  -- email on appointment confirm
  sms_cancelled            boolean     DEFAULT true,  -- SMS on cancellation
  email_cancelled          boolean     DEFAULT true,  -- email on cancellation
  reminder_24h             boolean     DEFAULT true,  -- 24h reminder
  reminder_2h              boolean     DEFAULT true,  -- 2h reminder
  notify_new_booking       boolean     DEFAULT true,  -- notify staff on new public booking
  cancellation_policy_text text,                      -- shown in confirmation emails
  updated_at               timestamptz DEFAULT now()
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Admin/Manager can read and update notification settings
CREATE POLICY "Admins can manage notification settings"
  ON notification_settings FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());


-- ── NOTIFICATIONS_LOG ─────────────────────────────────────────────────────────
-- Audit log of every sent SMS and email. Never deleted.
CREATE TABLE IF NOT EXISTS notifications_log (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid        REFERENCES appointments(id) ON DELETE SET NULL,
  type           text        NOT NULL CHECK (type IN ('sms', 'email')),
  template       text        NOT NULL, -- 'appointment_confirmed', 'reminder_24h', 'reminder_2h', 'appointment_cancelled', 'new_booking'
  recipient      text        NOT NULL, -- phone number or email address
  status         text        NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'error')),
  error          text,                 -- populated on failure
  sent_at        timestamptz DEFAULT now()
);

ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Admin/Manager can read notification logs for their org
CREATE POLICY "Admins can read notification log"
  ON notifications_log FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Edge Functions (service role) write to this table — no authenticated INSERT policy needed
-- (service_role key bypasses RLS)


-- ── STORAGE BUCKETS ───────────────────────────────────────────────────────────
-- Run these in the Supabase Storage section or via API after creating the buckets.
--
-- Bucket: 'org-assets'   (public: false) — org logos
--   Path pattern: {org_id}/logo
--
-- Bucket: 'documents'    (public: false) — patient documents
--   Path pattern: {org_id}/{client_id}/{filename}
--
-- Storage RLS policies should be set via the Supabase dashboard:
--   org-assets: authenticated users in the org can read; admin/manager can write
--   documents:  staff can read/write; patients can read their own folder


-- ── ACTIVITY_LOG ────────────────────────────────────────────────────────────
-- Audit trail of significant actions. Viewable in Admin App by admin/manager.
CREATE TABLE IF NOT EXISTS activity_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text        NOT NULL,        -- 'created_appointment', 'updated_status', etc.
  entity_type text,                        -- 'appointment', 'client', 'booking', 'service'
  entity_id   uuid,
  metadata    jsonb       DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/Manager can read activity log"
  ON activity_log FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'));

-- Only staff roles (not patients) may write to the activity log.
-- Service role (Edge Functions) bypasses RLS and can always insert.
CREATE POLICY "Staff can insert activity log"
  ON activity_log FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));


-- ── IN_APP_NOTIFICATIONS ────────────────────────────────────────────────────
-- Real-time notification feed for the Dashboard notification bell.
CREATE TABLE IF NOT EXISTS in_app_notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  type       text        NOT NULL,  -- 'new_booking', 'status_change', 'check_in', 'new_client'
  title      text        NOT NULL,
  message    text,
  link       text,
  is_read    boolean     DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read org notifications"
  ON in_app_notifications FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Staff can update org notifications"
  ON in_app_notifications FOR UPDATE TO authenticated
  USING (org_id = get_my_org_id())
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Authenticated can insert notifications"
  ON in_app_notifications FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id());


-- ── ONBOARDING FLAG ─────────────────────────────────────────────────────────
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;


-- ─── POS / Checkout ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid REFERENCES orgs NOT NULL,
  name        text NOT NULL,
  price_cents integer NOT NULL,
  stock_count integer,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage products"
  ON products FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE TABLE IF NOT EXISTS pos_transactions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid REFERENCES orgs NOT NULL,
  client_id                uuid REFERENCES clients,
  items                    jsonb NOT NULL,
  tip_cents                integer DEFAULT 0,
  total_cents              integer NOT NULL,
  stripe_payment_intent_id text,
  status                   text DEFAULT 'pending',
  created_at               timestamptz DEFAULT now()
);
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage pos_transactions"
  ON pos_transactions FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));


-- ── CLASSES ────────────────────────────────────────────────────────────────
-- Group sessions: yoga, group therapy, fitness classes, workshops, etc.
CREATE TABLE IF NOT EXISTS classes (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  name             text        NOT NULL,
  description      text,
  instructor_id    uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  service_id       uuid        REFERENCES services(id) ON DELETE SET NULL,
  day_of_week      integer     NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun
  start_time       time        NOT NULL,
  duration_minutes integer     DEFAULT 60,
  capacity         integer     DEFAULT 10,
  location         text,
  is_active        boolean     DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read org classes"
  ON classes FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Admins can manage classes"
  ON classes FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Patients can read active classes"
  ON classes FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'patient' AND is_active = true);

CREATE POLICY "Public can read active classes"
  ON classes FOR SELECT TO anon
  USING (is_active = true);


-- ── CLASS_REGISTRATIONS ───────────────────────────────────────────────────
-- Per-occurrence sign-ups for a class session.
CREATE TABLE IF NOT EXISTS class_registrations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  class_id     uuid        REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  client_id    uuid        REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  class_date   date        NOT NULL,
  status       text        NOT NULL DEFAULT 'registered'
                           CHECK (status IN ('registered', 'waitlisted', 'attended', 'no_show', 'cancelled')),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE class_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read org registrations"
  ON class_registrations FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Admins can manage registrations"
  ON class_registrations FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Staff can update registrations"
  ON class_registrations FOR UPDATE TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'staff')
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Patients can read own registrations"
  ON class_registrations FOR SELECT TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
  );

CREATE POLICY "Patients can register for classes"
  ON class_registrations FOR INSERT TO authenticated
  WITH CHECK (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
  );


-- ── QUEUE_ENTRIES ─────────────────────────────────────────────────────────
-- Walk-in / live queue for businesses that use a queue system.
CREATE TABLE IF NOT EXISTS queue_entries (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  client_id      uuid        REFERENCES clients(id) ON DELETE SET NULL,
  client_name    text        NOT NULL,
  service_id     uuid        REFERENCES services(id) ON DELETE SET NULL,
  staff_id       uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  status         text        NOT NULL DEFAULT 'waiting'
                             CHECK (status IN ('waiting', 'serving', 'completed', 'no_show')),
  position       integer     NOT NULL DEFAULT 0,
  notes          text,
  joined_at      timestamptz DEFAULT now(),
  called_at      timestamptz,
  completed_at   timestamptz
);

ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read org queue"
  ON queue_entries FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Staff can manage queue"
  ON queue_entries FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'))
  WITH CHECK (org_id = get_my_org_id());


-- ── CLIENT_PACKAGES ──────────────────────────────────────────────────────
-- Prepaid session packages (e.g. "10 sessions for $400", "Monthly unlimited").
CREATE TABLE IF NOT EXISTS client_packages (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  client_id         uuid        REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  name              text        NOT NULL,
  total_sessions    integer     NOT NULL DEFAULT 1,
  used_sessions     integer     NOT NULL DEFAULT 0,
  price             numeric(10,2) DEFAULT 0,
  purchased_at      timestamptz DEFAULT now(),
  expires_at        timestamptz,
  status            text        NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active', 'exhausted', 'expired', 'cancelled')),
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE client_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read org packages"
  ON client_packages FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));

CREATE POLICY "Admins can manage packages"
  ON client_packages FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Patients can read own packages"
  ON client_packages FOR SELECT TO authenticated
  USING (
    org_id = get_my_org_id()
    AND get_my_role() = 'patient'
    AND client_id IN (
      SELECT id FROM clients
      WHERE email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        AND org_id = get_my_org_id()
    )
  );


-- ── ORG_SETTINGS ──────────────────────────────────────────────────────────
-- Per-org settings that should NOT be exposed to the frontend (e.g. secret keys).
CREATE TABLE IF NOT EXISTS org_settings (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_secret_key    text,
  payment_required     boolean     DEFAULT false,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage org_settings"
  ON org_settings FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());


-- ── PACKAGE_TEMPLATES ────────────────────────────────────────────────────
-- Defines what memberships/packages a business offers.
CREATE TABLE IF NOT EXISTS package_templates (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  name              text        NOT NULL,
  type              text        NOT NULL CHECK (type IN ('sessions', 'membership')),
  session_count     integer,
  price             numeric(10,2) NOT NULL,
  billing_interval  text        CHECK (billing_interval IN ('weekly', 'monthly', 'yearly')),
  expiry_days       integer,
  is_active         boolean     DEFAULT true,
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE package_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/manager can manage package_templates"
  ON package_templates FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Staff can read package_templates"
  ON package_templates FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'staff');


-- ── STAFF_SHIFTS ─────────────────────────────────────────────────────────
-- Staff scheduling: who works when.
CREATE TABLE IF NOT EXISTS staff_shifts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  staff_id    uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shift_date  date        NOT NULL,
  start_time  time        NOT NULL,
  end_time    time        NOT NULL,
  notes       text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE staff_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/manager can manage staff_shifts"
  ON staff_shifts FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
  WITH CHECK (org_id = get_my_org_id());

CREATE POLICY "Staff can read own shifts"
  ON staff_shifts FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'staff' AND staff_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));


-- ── Stripe publishable key on orgs ───────────────────────────────────────
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS stripe_publishable_key text;

-- ── created_at on class_registrations (fix) ──────────────────────────────
ALTER TABLE class_registrations ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- ── payment_status on bookings ───────────────────────────────────────────
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed'));

-- ── Anon insert policy for queue_entries (kiosk mode) ────────────────────
-- Allows public kiosk check-in without authentication.
CREATE POLICY "Anon can insert queue_entries"
  ON queue_entries FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can read orgs for kiosk
-- (already exists: "Public can read org by slug")

-- ── Stripe billing columns on org_settings (Bridgeway subscription) ─────
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE org_settings ADD COLUMN IF NOT EXISTS payment_past_due boolean DEFAULT false;

-- ── Org status (active/inactive based on subscription) ──────────────────
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'
  CHECK (status IN ('active', 'inactive'));


-- ── FUTURE TABLE RLS TEMPLATES ───────────────────────────────────────────
-- When floor_zones and seat_assignments are added, apply this pattern:
--
-- ALTER TABLE floor_zones  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE seat_assignments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Staff can read floor_zones"
--   ON floor_zones FOR SELECT TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));
-- CREATE POLICY "Admins can manage floor_zones"
--   ON floor_zones FOR ALL TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
--   WITH CHECK (org_id = get_my_org_id());
-- (repeat same pattern for seat_assignments)
--
-- When intake_form_templates and intake_form_submissions are added:
--
-- ALTER TABLE intake_form_templates   ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE intake_form_submissions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can manage intake_form_templates"
--   ON intake_form_templates FOR ALL TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager'))
--   WITH CHECK (org_id = get_my_org_id());
-- CREATE POLICY "Staff can read intake_form_templates"
--   ON intake_form_templates FOR SELECT TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));
-- CREATE POLICY "Patients can read intake_form_templates"
--   ON intake_form_templates FOR SELECT TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() = 'patient');
-- CREATE POLICY "Patients can submit intake_form_submissions"
--   ON intake_form_submissions FOR INSERT TO authenticated
--   WITH CHECK (org_id = get_my_org_id() AND get_my_role() = 'patient');
-- CREATE POLICY "Staff can read intake_form_submissions"
--   ON intake_form_submissions FOR SELECT TO authenticated
--   USING (org_id = get_my_org_id() AND get_my_role() IN ('admin', 'manager', 'staff'));
-- Public (anon) submissions allowed if intake form is embedded in Booking App:
-- CREATE POLICY "Anon can submit intake_form_submissions"
--   ON intake_form_submissions FOR INSERT TO anon
--   WITH CHECK (true);


-- ─── POS / Checkout ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid REFERENCES orgs NOT NULL,
  name        text NOT NULL,
  price_cents integer NOT NULL,
  stock_count integer,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage products"
  ON products FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));

CREATE TABLE IF NOT EXISTS pos_transactions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   uuid REFERENCES orgs NOT NULL,
  client_id                uuid REFERENCES clients,
  items                    jsonb NOT NULL DEFAULT '[]',
  tip_cents                integer DEFAULT 0,
  total_cents              integer NOT NULL,
  stripe_payment_intent_id text,
  status                   text DEFAULT 'pending',
  created_at               timestamptz DEFAULT now()
);
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage pos_transactions"
  ON pos_transactions FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));

-- ─── Intake Forms ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS intake_form_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid REFERENCES orgs NOT NULL,
  name       text NOT NULL,
  fields     jsonb NOT NULL DEFAULT '[]',
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE intake_form_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage intake_form_templates"
  ON intake_form_templates FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));
CREATE POLICY "Patients can read intake_form_templates"
  ON intake_form_templates FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() = 'patient');

CREATE TABLE IF NOT EXISTS intake_form_submissions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid REFERENCES orgs NOT NULL,
  form_id        uuid REFERENCES intake_form_templates NOT NULL,
  client_id      uuid REFERENCES clients,
  appointment_id uuid REFERENCES appointments,
  responses      jsonb NOT NULL DEFAULT '{}',
  submitted_at   timestamptz DEFAULT now()
);
ALTER TABLE intake_form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read intake_form_submissions"
  ON intake_form_submissions FOR SELECT TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));
CREATE POLICY "Patients can submit intake_form_submissions"
  ON intake_form_submissions FOR INSERT TO authenticated
  WITH CHECK (org_id = get_my_org_id());

-- ─── Floor Zones & Seat Assignments ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS floor_zones (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid REFERENCES orgs NOT NULL,
  name       text NOT NULL,
  capacity   integer DEFAULT 1,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE floor_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage floor_zones"
  ON floor_zones FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));

CREATE TABLE IF NOT EXISTS seat_assignments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid REFERENCES orgs NOT NULL,
  zone_id        uuid REFERENCES floor_zones,
  zone_name      text,
  queue_entry_id uuid REFERENCES queue_entries,
  client_name    text,
  assigned_at    timestamptz DEFAULT now(),
  cleared_at     timestamptz
);
ALTER TABLE seat_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage seat_assignments"
  ON seat_assignments FOR ALL TO authenticated
  USING (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'))
  WITH CHECK (org_id = get_my_org_id() AND get_my_role() IN ('admin','manager','staff'));

-- ═══════════════════════════════════════════════════════════════════════════
-- DEMO SEED DATA
-- Replace <ORG_ID> and <ADMIN_USER_ID> after creating via Supabase Auth.
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Step 1: Create org
-- INSERT INTO orgs (id, name, slug, address, phone, primary_color) VALUES
--   ('00000000-0000-0000-0000-000000000001',
--    'Riverside Med Spa',
--    'riverside-med-spa',
--    '123 Main St, Springfield, MO 65801',
--    '(417) 555-0100',
--    '#f59e0b');
--
-- Step 2: Create admin profile (after auth user exists)
-- INSERT INTO profiles (user_id, org_id, role, full_name, email) VALUES
--   ('<ADMIN_USER_ID>',
--    '00000000-0000-0000-0000-000000000001',
--    'admin',
--    'Practice Owner',
--    'admin@riversidemedspa.com');
--
-- Full seed script with 3 months of demo data is generated in Phase 5.
