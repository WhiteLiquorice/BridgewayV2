# SaaS Starter

A minimal, production-ready starter template for small business web apps.

**Stack:** React 18 · Vite · Supabase · Tailwind CSS · Vercel

---

## What's included

- Email/password authentication via Supabase Auth
- Protected routes — unauthenticated users are redirected to `/login`
- Dashboard layout with a sidebar and header
- Data fetching example showing the standard Supabase query pattern
- Clean, professional UI using Tailwind CSS only (no component library)

---

## Starting a new client project

### 1. Clone or copy the template

```bash
git clone <this-repo-url> my-client-app
cd my-client-app
```

Or use it as a GitHub template by clicking **"Use this template"**.

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy:
   - **Project URL**
   - **anon / public** key

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

`.env.local` is gitignored and will not be committed.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Setting up the data example

The **Data Example** page fetches from a table called `example_items`. Run this SQL in the Supabase SQL editor to create it:

```sql
CREATE TABLE example_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE example_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read example_items"
  ON example_items FOR SELECT
  TO authenticated
  USING (true);
```

Then insert a few rows to see data in the table.

---

## Deploying to Vercel

### One-time setup

1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. In the Vercel project settings, add the environment variables from `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

Vercel auto-detects Vite. No build configuration needed.

### Subsequent deploys

Push to `main` — Vercel deploys automatically.

---

## Project structure

```
src/
├── lib/
│   └── supabase.js          — Supabase client (import this everywhere you need it)
├── context/
│   └── AuthContext.jsx      — Auth state; use the useAuth() hook in any component
├── components/
│   ├── ProtectedRoute.jsx   — Wraps authenticated routes
│   ├── Layout.jsx           — Sidebar + header shell
│   ├── Sidebar.jsx          — Navigation links
│   └── Header.jsx           — User email + sign out
└── pages/
    ├── Login.jsx
    ├── Signup.jsx
    ├── Dashboard.jsx        — Replace placeholder stats with real data
    └── DataExample.jsx      — Copy this pattern for each new data page
```

---

## Adding a new page

1. Create `src/pages/MyPage.jsx`.
2. Add a route in `src/App.jsx` inside the protected `<Layout>` route.
3. Add a nav link in `src/components/Sidebar.jsx`.

---

## Customising for a client

| What to change | Where |
|---|---|
| App name | `src/components/Sidebar.jsx` and `index.html` `<title>` |
| Brand colour | `tailwind.config.js` — extend the theme with a primary colour |
| Auth settings (magic link, OAuth) | Supabase dashboard → Authentication → Providers |
| Email templates | Supabase dashboard → Authentication → Email Templates |

---

## Appointment Booking Template

This repo includes a second template variant: a full appointment booking system built on the same base. It adds four pages and two new Supabase tables on top of the auth + layout foundation.

### What's included

| Page | Route | Auth |
|---|---|---|
| Dashboard | `/dashboard` | Required — shows today's count, upcoming total, link to public page |
| Calendar | `/dashboard/calendar` | Required — weekly grid, add slots, create/view/cancel bookings |
| Bookings list | `/dashboard/bookings` | Required — table of upcoming confirmed appointments |
| Settings | `/dashboard/settings` | Required — set the cancellation pickup window |
| Public booking | `/book` | **None** — patient-facing slot picker and form |

### Supabase tables

Run the SQL comments at the top of each file in the Supabase SQL editor:

| File | Tables created |
|---|---|
| `src/pages/CalendarView.jsx` | `slots`, `bookings` |
| `src/pages/PublicBook.jsx` | `settings` |

The `settings` file also contains the `INSERT` for the default `cancellation_window_hours = 18`.

#### Quick summary

```sql
-- Slots: one row per bookable (or blocked) time window
CREATE TABLE slots (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time timestamptz NOT NULL,
  end_time   timestamptz NOT NULL,
  status     text        NOT NULL DEFAULT 'available', -- 'available' | 'booked' | 'blocked'
  created_at timestamptz DEFAULT now()
);

-- Bookings: one row per appointment
CREATE TABLE bookings (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id      uuid        NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  client_name  text        NOT NULL,
  client_email text,
  notes        text,
  status       text        NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'cancelled'
  created_at   timestamptz DEFAULT now()
);

-- Settings: key/value store for admin config
CREATE TABLE settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

See each file for the full RLS policies and optional seed scripts.

### How it works

**Admin flow:**
1. Log in at `/login`.
2. Go to **Calendar**, click **+ Add Slot** to create available or blocked time windows.
3. Click an **Open** slot to create a booking on behalf of a client (name, email, notes).
4. Click a **Booked** slot to view details or cancel.
5. Use **Bookings** for a flat list of upcoming confirmed appointments with one-click cancel.
6. Set the cancellation pickup window in **Settings**.

**Client flow:**
1. Visit `/book` — no account required.
2. Pick a date from the next 7 days, then a time slot.
3. Enter name and email, submit. The slot is immediately marked as booked.

### Cancellation pickup window

When an admin cancels a booking the slot reverts to `'available'`, but that slot only reappears on the public `/book` page if the appointment is more than `cancellation_window_hours` away. Default is 18 hours.

Adjust in **Settings** or directly in the `settings` table.

### Seeding test slots

The SQL seed script in `CalendarView.jsx` creates 1-hour slots from 9am–4pm for the next 7 days. Uncomment and run it in the Supabase SQL editor to populate test data immediately.

---

## Client Portal Template

This repo includes a third template variant: a role-based client portal where an admin (the business owner) and clients (their customers) log in to the same app but see entirely different views.

### What's included

| Page | Route | Role |
|---|---|---|
| Admin Dashboard | `/admin/dashboard` | Admin — total clients, upcoming count, add-client panel |
| Admin Appointments | `/admin/appointments` | Admin — create, edit, cancel appointments per client |
| Portal Settings | `/admin/settings` | Admin — set the cancellation pickup window |
| Client Portal | `/portal/dashboard` | Client — own upcoming + past appointments, admin notes |
| Available Slots | `/portal/pickup` | Client — claim cancelled slots that are back in the pool |

### Supabase tables

Run the SQL comment block at the top of `src/pages/AdminDashboard.jsx` in the Supabase SQL editor. It creates all four objects in one go:

| Object | Purpose |
|---|---|
| `profiles` | One row per user — stores `role`, `full_name`, `email`, `notes` |
| `portal_appointments` | One row per appointment — `client_id` references `profiles.id` |
| `portal_settings` | Key/value store for admin config (pickup window) |
| `get_my_role()` | `SECURITY DEFINER` function used in all RLS policies |
| `handle_new_user()` trigger | Auto-links or creates a profile on `auth.users` insert |

#### Quick schema summary

```sql
-- profiles: id, user_id (FK→auth.users, UNIQUE), role, full_name, email, notes, created_at
-- portal_appointments: id, client_id (FK→profiles.id), scheduled_at, duration_minutes,
--                      title, notes, status ('scheduled'|'available'|'cancelled'), created_at
-- portal_settings: key (PK), value, updated_at
```

### How it works

**Admin flow:**
1. Log in at `/login` → redirected to `/admin/dashboard` automatically.
2. Click **+ Add Client** to pre-create a client profile (name, email, optional notes).
3. The client signs up with the same email → the trigger links their account automatically.
4. Go to **Appointments**, click **+ New Appointment**, assign it to a client.
5. Cancel an appointment — if it's more than `cancellation_window_hours` away the slot is set to `available` so the client can reclaim it.

**Client flow:**
1. Sign up or log in at `/login` → redirected to `/portal/dashboard` automatically.
2. View upcoming and past appointments on the portal dashboard.
3. See any notes your provider has left on your profile.
4. Visit **Available Slots** to claim a cancelled slot that has re-opened.

### Role-based routing

Roles are stored in the `profiles` table. On login, `AuthContext` loads the profile and exposes `role` via `useAuth()`. The app root (`/`) uses a `RoleRedirect` component:

- `role === 'admin'` → `/admin/dashboard`
- `role === 'client'` → `/portal/dashboard`
- no role → `/dashboard` (booking template)

`AdminRoute` and `ClientRoute` guard components enforce access and redirect cross-role navigation.

### Cancellation pickup window

When an admin cancels an appointment, the slot's status is set to:
- `'available'` — if the appointment is more than `cancellation_window_hours` away. The slot appears on the client's **Available Slots** page.
- `'cancelled'` — if the appointment is within the window. The slot is removed silently.

Adjust in **Portal Settings** or directly in the `portal_settings` table.

### Customising roles

To make an account an admin, update the `profiles` row directly in Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
```

Or set `DEFAULT 'admin'` on the `role` column for the first account, then switch it back.
