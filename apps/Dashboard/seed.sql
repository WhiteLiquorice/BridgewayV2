-- ═══════════════════════════════════════════════════════════════════════════
-- BRIDGEWAY — Demo Seed Data
-- Org: Millbrook Chiropractic & Wellness
-- Org ID: 77abc4c1-a8d8-47a5-97ad-f25b464e6d7e
-- Generated: March 2026  |  Safe to re-run (ON CONFLICT DO NOTHING)
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── STAFF PROFILES ───────────────────────────────────────────────────────────
-- user_id = NULL: display-only demo profiles, not linked to auth.users

INSERT INTO profiles (id, user_id, org_id, role, full_name, email, phone, is_active)
VALUES
  ('cc100000-0000-0000-0000-000000000001', NULL, '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'admin',   'Dr. Marcus Webb',    'marcus.webb@millbrookchiro.com',    '(630) 555-0101', true),
  ('cc100000-0000-0000-0000-000000000002', NULL, '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'manager', 'Jessica Hartley',    'jessica.hartley@millbrookchiro.com','(630) 555-0102', true),
  ('cc100000-0000-0000-0000-000000000003', NULL, '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'staff',   'Tyler Okafor',       'tyler.okafor@millbrookchiro.com',   '(630) 555-0103', true)
ON CONFLICT (id) DO NOTHING;


-- ── SERVICES ─────────────────────────────────────────────────────────────────

INSERT INTO services (id, org_id, name, description, duration_minutes, price, is_archived)
VALUES
  ('cc200000-0000-0000-0000-000000000001', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Initial Exam',
   'Comprehensive first-visit assessment including posture analysis, orthopedic testing, and treatment plan.',
   60, 150.00, false),

  ('cc200000-0000-0000-0000-000000000002', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Chiropractic Adjustment',
   'Manual spinal and extremity adjustments to restore joint mobility and reduce pain.',
   30, 75.00, false),

  ('cc200000-0000-0000-0000-000000000003', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Deep Tissue Massage',
   'Targeted massage therapy for chronic muscle tension, adhesions, and deep-layer tightness.',
   60, 95.00, false),

  ('cc200000-0000-0000-0000-000000000004', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Sports Massage',
   'Pre- or post-activity massage focused on injury prevention, recovery, and performance.',
   45, 80.00, false),

  ('cc200000-0000-0000-0000-000000000005', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Spinal Decompression',
   'Motorized traction therapy for herniated discs, sciatica, and degenerative disc disease.',
   30, 110.00, false),

  ('cc200000-0000-0000-0000-000000000006', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Wellness Consultation',
   'Ergonomics review, lifestyle coaching, and personalized home-exercise planning.',
   20, 50.00, false)
ON CONFLICT (id) DO NOTHING;


-- ── CLIENTS ──────────────────────────────────────────────────────────────────

INSERT INTO clients (id, org_id, name, email, phone, date_of_birth, address, notes, created_at)
VALUES
  ('cc300000-0000-0000-0000-000000000001', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Sarah Mitchell', 'sarah.mitchell@email.com', '(630) 555-1001',
   '1988-03-14', '412 Maple Ave, Millbrook, IL 60148',
   'Desk job, chronic lower back pain. Prefers morning appts. HSA card on file.',
   '2025-12-10 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000002', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'James Kowalski', 'james.kowalski@email.com', '(630) 555-1002',
   '1979-06-22', '88 Ridgeline Rd, Millbrook, IL 60148',
   'Marathon runner. Left knee and hip issues. Monthly maintenance plan.',
   '2025-12-12 10:00:00+00'),

  ('cc300000-0000-0000-0000-000000000003', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Maria Garcia', 'maria.garcia@email.com', '(630) 555-1003',
   '1992-11-05', '233 Oak St, Millbrook, IL 60148',
   'Neck tension and cervicogenic headaches. Responds well to upper cervical work.',
   '2025-12-14 11:00:00+00'),

  ('cc300000-0000-0000-0000-000000000004', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'David Chen', 'david.chen@email.com', '(630) 555-1004',
   '1963-08-17', '57 Birchwood Ln, Millbrook, IL 60148',
   'Post-op L4-L5 fusion follow-up. Cleared by Dr. Patel for chiro care Jan 2026.',
   '2025-12-18 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000005', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Emily Torres', 'emily.torres@email.com', '(630) 555-1005',
   '1985-01-30', '901 Willow Creek Dr, Millbrook, IL 60148',
   'Sciatica, L5-S1. Two kids — avoid scheduling after 3pm (school pickup).',
   '2025-12-19 10:30:00+00'),

  ('cc300000-0000-0000-0000-000000000006', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Robert Hayes', 'robert.hayes@email.com', '(630) 555-1006',
   '1971-09-09', '14 Crestview Ct, Millbrook, IL 60148',
   'Herniated disc C5-C6. On spinal decompression protocol, 12-visit plan (started Dec 2025).',
   '2025-12-20 14:00:00+00'),

  ('cc300000-0000-0000-0000-000000000007', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Jennifer Williams', 'jennifer.williams@email.com', '(630) 555-1007',
   '1990-04-23', '326 Elm St, Millbrook, IL 60148',
   'T-bone MVA Dec 2024. Whiplash and thoracic strain. Personal injury case open — document carefully.',
   '2025-12-22 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000008', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Michael Anderson', 'michael.anderson@email.com', '(630) 555-1008',
   '1975-12-11', '740 Pine Ridge Rd, Millbrook, IL 60148',
   'Chronic low back pain. Long-haul trucker — availability varies week to week.',
   '2025-12-28 10:00:00+00'),

  ('cc300000-0000-0000-0000-000000000009', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Lisa Nguyen', 'lisa.nguyen@email.com', '(630) 555-1009',
   '1994-07-08', '198 Sunflower Blvd, Millbrook, IL 60148',
   'Stress-related tension, remote worker. Prefers 11am-2pm window.',
   '2026-01-02 11:00:00+00'),

  ('cc300000-0000-0000-0000-000000000010', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Thomas Reynolds', 'thomas.reynolds@email.com', '(630) 555-1010',
   '1967-02-19', '55 Hawthorne Ave, Millbrook, IL 60148',
   'Construction foreman. Right shoulder and upper back. Patient since opening week.',
   '2026-01-03 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000011', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Amanda Foster', 'amanda.foster@email.com', '(630) 555-1011',
   '1993-10-31', '83 Meadow Ln, Millbrook, IL 60148',
   'New mom, 4 months postpartum. Core weakness and pelvic tilt. Brings infant — needs flexible schedule.',
   '2026-01-09 10:00:00+00'),

  ('cc300000-0000-0000-0000-000000000012', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Christopher Lee', 'christopher.lee@email.com', '(630) 555-1012',
   '1982-05-14', '212 Fairway Dr, Millbrook, IL 60148',
   'Avid golfer. Lumbar rotation issues. Seasonal flare-ups April-October.',
   '2026-01-10 13:00:00+00'),

  ('cc300000-0000-0000-0000-000000000013', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Patricia Morgan', 'patricia.morgan@email.com', '(630) 555-1013',
   '1958-08-26', '467 Rosewood Ct, Millbrook, IL 60148',
   'Osteoarthritis, hips and knees. Gentle adjustments only per referral from Dr. Ellis.',
   '2026-01-16 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000014', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Kevin Sullivan', 'kevin.sullivan@email.com', '(630) 555-1014',
   '1987-03-07', '31 Lakeview Terrace, Millbrook, IL 60148',
   'IT professional, severe forward-head posture. Standing desk recommended — still using old setup.',
   '2026-01-18 14:00:00+00'),

  ('cc300000-0000-0000-0000-000000000015', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Rachel Kim', 'rachel.kim@email.com', '(630) 555-1015',
   '1995-09-16', '120 Spruce St, Millbrook, IL 60148',
   'Bilateral tension headaches, cervicogenic origin. Responds well to C1-C2 work.',
   '2026-01-24 10:00:00+00'),

  ('cc300000-0000-0000-0000-000000000016', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Brian Hoffman', 'brian.hoffman@email.com', '(630) 555-1016',
   '1981-11-28', '589 Timber Trail, Millbrook, IL 60148',
   'Triathlete. Hip flexor and IT band tightness. Race season starts April — increase frequency then.',
   '2026-02-01 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000017', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Stephanie Davis', 'stephanie.davis@email.com', '(630) 555-1017',
   '1976-06-04', '774 Clover Hill Rd, Millbrook, IL 60148',
   'Fibromyalgia diagnosis. Very pressure-sensitive — light touch protocols only, avoid deep work.',
   '2026-02-06 11:00:00+00'),

  ('cc300000-0000-0000-0000-000000000018', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Daniel Martinez', 'daniel.martinez@email.com', '(630) 555-1018',
   '1989-12-21', '22 Overlook Dr, Millbrook, IL 60148',
   'Slip-and-fall Jan 2026. Right hip and lumbar. Workers'' comp case — all notes billable.',
   '2026-02-10 09:00:00+00'),

  ('cc300000-0000-0000-0000-000000000019', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Nicole Johnson', 'nicole.johnson@email.com', '(630) 555-1019',
   '1997-07-13', '345 Bluebell Way, Millbrook, IL 60148',
   '32 weeks pregnant. Cleared by OB for prenatal adjustments. Side-lying position only.',
   '2026-02-20 13:00:00+00'),

  ('cc300000-0000-0000-0000-000000000020', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'Andrew Thompson', 'andrew.thompson@email.com', '(630) 555-1020',
   '1968-04-02', '61 Heritage Pkwy, Millbrook, IL 60148',
   'Wellness maintenance only — no acute complaints. Monthly adjustment, prefers Fridays.',
   '2026-02-24 10:00:00+00')
ON CONFLICT (id) DO NOTHING;


-- ── APPOINTMENTS ─────────────────────────────────────────────────────────────
-- staff1=Dr. Marcus Webb | staff2=Jessica Hartley | staff3=Tyler Okafor
-- svc1=Initial Exam $150/60m  | svc2=Chiro Adj $75/30m    | svc3=Deep Tissue $95/60m
-- svc4=Sports Massage $80/45m | svc5=Spinal Decomp $110/30m | svc6=Wellness $50/20m
-- Timestamps in UTC — clinic hours 9am-5pm CT = 15:00-23:00 UTC

-- December 2025
INSERT INTO appointments (id, org_id, client_id, service_id, staff_id, scheduled_at, duration_minutes, status, amount, notes)
VALUES
  ('cc400000-0000-0000-0000-000000000001', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2025-12-15 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000002', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2025-12-16 16:30:00+00', 60, 'completed', 150.00,
   'Initial eval. Left knee restriction and bilateral hip flexor tightness. 8-visit plan recommended.'),

  ('cc400000-0000-0000-0000-000000000003', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000003', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2025-12-17 20:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000004', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000004', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2025-12-22 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000005', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000005', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2025-12-23 17:00:00+00', 45, 'completed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000006', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2025-12-24 15:30:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000007', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2025-12-29 16:00:00+00', 30, 'completed', 110.00,
   'Session 1 of 12. Pre-tx pain 7/10, post-tx 5/10. Good initial response.'),

  ('cc400000-0000-0000-0000-000000000008', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000007', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2025-12-30 19:00:00+00', 60, 'cancelled', 95.00,
   'Patient no-showed. Left voicemail. PI case — note for records.'),

  ('cc400000-0000-0000-0000-000000000009', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000008', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2025-12-31 15:00:00+00', 30, 'completed', 75.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- January 2026
INSERT INTO appointments (id, org_id, client_id, service_id, staff_id, scheduled_at, duration_minutes, status, amount, notes)
VALUES
  ('cc400000-0000-0000-0000-000000000010', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000009', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2026-01-05 15:00:00+00', 60, 'completed', 150.00,
   'New patient. 2" forward head posture. Upper trap and levator tightness. Starting 6-visit plan.'),

  ('cc400000-0000-0000-0000-000000000011', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000010', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-01-06 17:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000012', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-01-07 20:00:00+00', 45, 'completed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000013', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000003', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-01-08 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000014', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000011', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2026-01-12 15:00:00+00', 60, 'completed', 150.00,
   'New patient, postpartum. Pelvic tilt and weak core. Starting gentle lumbopelvic protocol.'),

  ('cc400000-0000-0000-0000-000000000015', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000004', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-01-13 17:30:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000016', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000012', 'cc200000-0000-0000-0000-000000000006',
   'cc100000-0000-0000-0000-000000000001', '2026-01-14 20:00:00+00', 20, 'completed', 50.00,
   'Ergonomics consult. Discussed golf swing biomechanics and lumbar rotation loading.'),

  ('cc400000-0000-0000-0000-000000000017', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000005', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-01-15 15:30:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000018', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-01-19 16:00:00+00', 30, 'completed', 110.00,
   'Session 4 of 12. ROM improving. Pain down to 4/10 from 7/10 at intake.'),

  ('cc400000-0000-0000-0000-000000000019', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000013', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-01-20 19:00:00+00', 30, 'completed', 75.00,
   'Gentle mobilization only per referral. Patient tolerated well.'),

  ('cc400000-0000-0000-0000-000000000020', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000007', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-01-21 17:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000021', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000014', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2026-01-22 15:00:00+00', 60, 'completed', 150.00,
   'New patient. Significant forward head posture, C5-C6 hypomobility. WC cleared.'),

  ('cc400000-0000-0000-0000-000000000022', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-01-26 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000023', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000015', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-01-27 20:00:00+00', 45, 'completed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000024', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000008', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-01-28 17:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000025', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000003', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-01-29 15:30:00+00', 60, 'completed', 95.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- February 2026
INSERT INTO appointments (id, org_id, client_id, service_id, staff_id, scheduled_at, duration_minutes, status, amount, notes)
VALUES
  ('cc400000-0000-0000-0000-000000000026', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000010', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-02-02 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000027', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-02-03 17:00:00+00', 30, 'completed', 110.00,
   'Session 7 of 12. Near full ROM. Transitioning to maintenance phase next month.'),

  ('cc400000-0000-0000-0000-000000000028', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000016', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-02-04 19:00:00+00', 60, 'completed', 95.00,
   'New patient. IT band and hip flexor adhesions. Pre-season prep for triathlon.'),

  ('cc400000-0000-0000-0000-000000000029', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-02-05 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000030', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000005', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-02-06 15:00:00+00', 45, 'cancelled', 80.00,
   'Same-day cancellation — child sick. Rescheduled for following week.'),

  ('cc400000-0000-0000-0000-000000000031', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000017', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2026-02-09 16:00:00+00', 60, 'completed', 150.00,
   'New patient. Fibromyalgia — light pressure throughout. Patient tolerated well, reports relief.'),

  ('cc400000-0000-0000-0000-000000000032', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000011', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-02-10 17:30:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000033', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000004', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-02-11 20:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000034', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-02-12 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000035', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000018', 'cc200000-0000-0000-0000-000000000006',
   'cc100000-0000-0000-0000-000000000001', '2026-02-13 16:30:00+00', 20, 'completed', 50.00,
   'New patient consult. Slip-and-fall Jan 27. Right hip and L3 tenderness. WC paperwork filed.'),

  ('cc400000-0000-0000-0000-000000000036', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000013', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-02-16 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000037', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000015', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-02-17 17:00:00+00', 45, 'completed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000038', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-02-18 20:00:00+00', 30, 'completed', 110.00,
   'Session 10 of 12. Pain 2/10. Excellent progress. Discussing discharge plan.'),

  ('cc400000-0000-0000-0000-000000000039', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000009', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-02-19 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000040', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000007', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-02-20 15:00:00+00', 60, 'cancelled', 95.00,
   'Patient called to cancel — work conflict. PI case, rescheduling important.'),

  ('cc400000-0000-0000-0000-000000000041', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000010', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-02-23 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000042', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000019', 'cc200000-0000-0000-0000-000000000001',
   'cc100000-0000-0000-0000-000000000001', '2026-02-24 17:00:00+00', 60, 'completed', 150.00,
   'New patient. 32 wks pregnant. Side-lying protocol. Sacroiliac dysfunction. OB clearance on file.'),

  ('cc400000-0000-0000-0000-000000000043', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000003', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-02-25 20:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000044', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-02-26 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000045', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000020', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-02-27 16:30:00+00', 45, 'completed', 80.00,
   'New patient. Wellness maintenance. No acute complaints. Monthly schedule established.')
ON CONFLICT (id) DO NOTHING;

-- March 2026 — past (through today Mar 17)
INSERT INTO appointments (id, org_id, client_id, service_id, staff_id, scheduled_at, duration_minutes, status, amount, notes)
VALUES
  ('cc400000-0000-0000-0000-000000000046', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000011', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-02 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000047', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000014', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-03-03 16:30:00+00', 30, 'completed', 110.00,
   'Session 3. Cervical ROM improving. Decrease in referred arm tingling noted.'),

  ('cc400000-0000-0000-0000-000000000048', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000016', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-03-04 19:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000049', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-03-05 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000050', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000013', 'cc200000-0000-0000-0000-000000000006',
   'cc100000-0000-0000-0000-000000000001', '2026-03-06 17:00:00+00', 20, 'completed', 50.00,
   'HEP review. Added pool walking. Discussed anti-inflammatory diet basics.'),

  ('cc400000-0000-0000-0000-000000000051', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000005', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-03-06 20:00:00+00', 45, 'cancelled', 80.00,
   'Late cancellation (<24h). Fee waived — first offense.'),

  ('cc400000-0000-0000-0000-000000000052', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000008', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-09 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000053', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000007', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-03-10 17:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000054', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000017', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-11 15:30:00+00', 30, 'completed', 75.00,
   'Light mobilization. Patient reports improved sleep since starting care.'),

  ('cc400000-0000-0000-0000-000000000055', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-03-12 20:00:00+00', 30, 'completed', 110.00,
   'Session 12 of 12 — final decompression. Discharge summary sent. Follow-up in 6 weeks.'),

  ('cc400000-0000-0000-0000-000000000056', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000004', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-03-13 16:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000057', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000020', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-03-13 19:00:00+00', 45, 'completed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000058', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-16 15:00:00+00', 30, 'completed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000059', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000009', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-03-16 17:00:00+00', 60, 'completed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000060', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000015', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-03-17 15:00:00+00', 30, 'completed', 75.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- March 2026 — future (Mar 18 – Mar 30)
INSERT INTO appointments (id, org_id, client_id, service_id, staff_id, scheduled_at, duration_minutes, status, amount, notes)
VALUES
  ('cc400000-0000-0000-0000-000000000061', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000010', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-18 15:00:00+00', 30, 'confirmed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000062', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000011', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-03-18 17:00:00+00', 45, 'confirmed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000063', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000003', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-03-19 16:00:00+00', 60, 'confirmed', 95.00, NULL),

  ('cc400000-0000-0000-0000-000000000064', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006', 'cc200000-0000-0000-0000-000000000005',
   'cc100000-0000-0000-0000-000000000001', '2026-03-19 20:00:00+00', 30, 'pending', 110.00,
   'Post-discharge reassessment after completing 12-visit decompression plan.'),

  ('cc400000-0000-0000-0000-000000000065', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000001', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-03-20 15:30:00+00', 30, 'confirmed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000066', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000008', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000001', '2026-03-23 16:00:00+00', 30, 'confirmed', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000067', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000016', 'cc200000-0000-0000-0000-000000000003',
   'cc100000-0000-0000-0000-000000000002', '2026-03-24 17:00:00+00', 60, 'confirmed', 95.00,
   'Pre-race deep tissue. Triathlon in 5 weeks.'),

  ('cc400000-0000-0000-0000-000000000068', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000004', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-25 15:00:00+00', 30, 'pending', 75.00, NULL),

  ('cc400000-0000-0000-0000-000000000069', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000015', 'cc200000-0000-0000-0000-000000000004',
   'cc100000-0000-0000-0000-000000000003', '2026-03-25 20:00:00+00', 45, 'confirmed', 80.00, NULL),

  ('cc400000-0000-0000-0000-000000000070', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000020', 'cc200000-0000-0000-0000-000000000006',
   'cc100000-0000-0000-0000-000000000001', '2026-03-26 16:30:00+00', 20, 'confirmed', 50.00,
   'Monthly wellness check-in and HEP update.'),

  ('cc400000-0000-0000-0000-000000000071', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000002', 'cc200000-0000-0000-0000-000000000002',
   'cc100000-0000-0000-0000-000000000003', '2026-03-30 15:00:00+00', 30, 'confirmed', 75.00, NULL)
ON CONFLICT (id) DO NOTHING;


-- ── BOOKINGS (pending public requests from new patients) ──────────────────────

INSERT INTO bookings (id, org_id, service_id, name, email, phone, preferred_date, preferred_time, notes, status)
VALUES
  ('cc500000-0000-0000-0000-000000000001', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc200000-0000-0000-0000-000000000002',
   'Marcus Bell', 'marcus.bell@email.com', '(630) 555-2001',
   '2026-03-23', '10:00',
   'Lower back pain for about 3 weeks. I work at a desk all day. Never seen a chiropractor before.',
   'pending'),

  ('cc500000-0000-0000-0000-000000000002', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc200000-0000-0000-0000-000000000003',
   'Donna Patel', 'donna.patel@email.com', '(630) 555-2002',
   '2026-03-24', '14:00',
   'Shoulder and neck tension. My therapist recommended deep tissue massage. Flexible on time.',
   'pending'),

  ('cc500000-0000-0000-0000-000000000003', '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc200000-0000-0000-0000-000000000004',
   'Timothy Grant', 'timothy.grant@email.com', '(630) 555-2003',
   '2026-03-25', '11:00',
   'Training for a half marathon, tight hamstrings and calves. Morning preferred if possible.',
   'pending')
ON CONFLICT (id) DO NOTHING;


-- ── NOTIFICATION SETTINGS ────────────────────────────────────────────────────

INSERT INTO notification_settings (
  id, org_id,
  sms_enabled, email_enabled,
  sms_confirmed, email_confirmed,
  sms_cancelled, email_cancelled,
  reminder_24h, reminder_2h,
  notify_new_booking,
  cancellation_policy_text
)
VALUES (
  'cc600000-0000-0000-0000-000000000001',
  '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
  true, true,
  true, true,
  true, true,
  true, true,
  true,
  'We require at least 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a $35 fee. We understand emergencies happen — please call us as soon as possible.'
)
ON CONFLICT (id) DO NOTHING;


-- ── DOCUMENTS ────────────────────────────────────────────────────────────────

INSERT INTO documents (id, org_id, client_id, title, file_url, uploaded_by, created_at)
VALUES
  ('cc700000-0000-0000-0000-000000000001',
   '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   NULL,
   'New Patient Intake Form',
   'https://aukcwmtthdaiyygcqtpj.supabase.co/storage/v1/object/public/documents/77abc4c1-a8d8-47a5-97ad-f25b464e6d7e/new-patient-intake.pdf',
   'cc100000-0000-0000-0000-000000000001',
   '2025-12-14 12:00:00+00'),

  ('cc700000-0000-0000-0000-000000000002',
   '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   'cc300000-0000-0000-0000-000000000006',
   'Post-Visit Care Summary — Robert Hayes',
   'https://aukcwmtthdaiyygcqtpj.supabase.co/storage/v1/object/public/documents/77abc4c1-a8d8-47a5-97ad-f25b464e6d7e/cc300000-0000-0000-0000-000000000006/post-visit-summary-2026-03-12.pdf',
   'cc100000-0000-0000-0000-000000000001',
   '2026-03-12 21:00:00+00'),

  ('cc700000-0000-0000-0000-000000000003',
   '77abc4c1-a8d8-47a5-97ad-f25b464e6d7e',
   NULL,
   'Cancellation & Billing Policy',
   'https://aukcwmtthdaiyygcqtpj.supabase.co/storage/v1/object/public/documents/77abc4c1-a8d8-47a5-97ad-f25b464e6d7e/cancellation-billing-policy.pdf',
   'cc100000-0000-0000-0000-000000000002',
   '2025-12-14 13:00:00+00')
ON CONFLICT (id) DO NOTHING;


COMMIT;
