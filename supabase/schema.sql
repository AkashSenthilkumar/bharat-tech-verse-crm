-- ═══════════════════════════════════════════════════════════════════════════
-- Bharat Tech Verse CRM — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ── User Profiles (extends auth.users) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'sales-executive',
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'sales-executive'),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: returns the calling user's role (used in RLS policies)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER
AS $$ SELECT role FROM public.user_profiles WHERE id = auth.uid() $$;

-- ── Manufacturing: Machines ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.machines (
  id               TEXT PRIMARY KEY,
  name             TEXT    NOT NULL,
  type             TEXT    NOT NULL,
  status           TEXT    NOT NULL DEFAULT 'Running',  -- Running | Stopped | Maintenance
  operator         TEXT,
  target           INTEGER DEFAULT 0,
  produced         INTEGER DEFAULT 0,
  efficiency       INTEGER DEFAULT 0,
  oee              INTEGER DEFAULT 0,
  temperature      INTEGER DEFAULT 0,
  runtime          TEXT,
  downtime         TEXT,
  last_maintenance DATE,
  shift            TEXT    DEFAULT 'A',
  alerts           JSONB   DEFAULT '[]'::jsonb,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Inventory ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id              TEXT    PRIMARY KEY,
  name            TEXT    NOT NULL,
  category        TEXT    NOT NULL,  -- Raw Material | Consumable | Finished Goods
  unit            TEXT    NOT NULL,
  stock           NUMERIC DEFAULT 0,
  reorder_level   NUMERIC DEFAULT 0,
  max_stock       NUMERIC DEFAULT 0,
  monthly_usage   NUMERIC DEFAULT 0,
  vendor          TEXT,
  status          TEXT    DEFAULT 'OK',  -- OK | Low | Critical
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Purchase Orders ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id            TEXT    PRIMARY KEY,
  item          TEXT    NOT NULL,
  vendor        TEXT    NOT NULL,
  qty           NUMERIC NOT NULL,
  unit          TEXT    NOT NULL,
  amount        NUMERIC NOT NULL,
  ordered_date  DATE,
  expected_date DATE,
  status        TEXT    DEFAULT 'Pending Approval',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Production Orders (Work Orders) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.production_orders (
  id         TEXT    PRIMARY KEY,
  product    TEXT    NOT NULL,
  customer   TEXT    NOT NULL,
  qty        INTEGER NOT NULL,
  produced   INTEGER DEFAULT 0,
  due_date   DATE,
  status     TEXT    DEFAULT 'Planned',  -- Planned | In Progress | Completed | At Risk
  priority   TEXT    DEFAULT 'Medium',   -- High | Medium | Low
  machine    TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Operators / Workforce ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.operators (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  shift         TEXT DEFAULT 'A',
  machine       TEXT,
  status        TEXT DEFAULT 'Present',  -- Present | Absent | On Leave
  attendance    INTEGER DEFAULT 0,
  productivity  INTEGER DEFAULT 0,
  overtime      INTEGER DEFAULT 0,
  safety_score  INTEGER DEFAULT 0
);

-- ── Manufacturing: Customer Orders (Sales Orders) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.customer_orders (
  id              TEXT    PRIMARY KEY,
  customer        TEXT    NOT NULL,
  product         TEXT    NOT NULL,
  qty             INTEGER NOT NULL,
  dispatched_qty  INTEGER DEFAULT 0,
  order_date      DATE,
  promised_date   DATE,
  status          TEXT    DEFAULT 'On Track',  -- On Track | At Risk | Delayed | Completed
  value           NUMERIC DEFAULT 0,
  contact         TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Defect Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.defect_logs (
  id         TEXT PRIMARY KEY,
  time       TEXT,
  machine    TEXT,
  type       TEXT,
  part       TEXT,
  qty        INTEGER DEFAULT 0,
  action     TEXT,
  logged_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Vision Alerts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vision_alerts (
  id           TEXT PRIMARY KEY,
  camera       TEXT NOT NULL,
  type         TEXT NOT NULL,
  description  TEXT,
  alert_time   TIMESTAMPTZ,
  severity     TEXT DEFAULT 'Medium',  -- High | Medium | Low
  status       TEXT DEFAULT 'Open',    -- Open | Resolved
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Manufacturing: Camera Zones ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.camera_zones (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  location        TEXT,
  status          TEXT    DEFAULT 'Online',  -- Online | Offline
  ppe_compliance  INTEGER DEFAULT 0,
  last_alert      TEXT,
  alert_count     INTEGER DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── CRM: Leads ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  location        TEXT,
  source          TEXT,
  status          TEXT DEFAULT 'New',  -- New | Interested | Follow-up | Site Visit | Won | Lost
  assigned_to     TEXT,
  enquiry         TEXT,
  last_follow_up  DATE,
  next_follow_up  DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── CRM: Follow-ups ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id         TEXT PRIMARY KEY,
  lead_id    TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
  lead_name  TEXT,
  executive  TEXT,
  priority   TEXT DEFAULT 'Medium',  -- High | Medium | Low
  due_date   DATE,
  status     TEXT DEFAULT 'Pending', -- Pending | Done | Overdue
  remarks    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CRM: Site Visits ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_visits (
  id         TEXT PRIMARY KEY,
  lead_id    TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
  lead_name  TEXT,
  date       DATE,
  executive  TEXT,
  status     TEXT DEFAULT 'Scheduled',  -- Scheduled | Completed | Cancelled
  remarks    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CRM: Timeline Events ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id          TEXT PRIMARY KEY,
  lead_id     TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
  type        TEXT,  -- note | call | followup | site-visit | status
  title       TEXT,
  description TEXT,
  ts          TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
