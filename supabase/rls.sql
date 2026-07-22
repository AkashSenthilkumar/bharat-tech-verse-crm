-- ═══════════════════════════════════════════════════════════════════════════
-- Bharat Tech Verse CRM — Row Level Security Policies
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
-- Role access matrix:
--   md                  → ALL tables (full access)
--   plant-manager       → ALL manufacturing tables
--   production-supervisor → machines, production_orders, quality, workforce, vision
--   machine-operator    → machines (own record), production_orders
--   quality-inspector   → machines(read), defect_logs, vision_alerts, camera_zones
--   finance-manager     → customer_orders, purchase_orders, inventory_items(read)
--   procurement-manager → purchase_orders, inventory_items, customer_orders(read)
--   sales-executive     → leads, follow_ups, site_visits, timeline_events ONLY
-- ═══════════════════════════════════════════════════════════════════════════

-- ── user_profiles ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON public.user_profiles
  FOR ALL TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- MD can see all profiles
CREATE POLICY "md_all_profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (public.get_my_role() = 'md');

-- ── machines ─────────────────────────────────────────────────────────────────
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "machines_read" ON public.machines
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor',
    'machine-operator', 'quality-inspector'
  ));

CREATE POLICY "machines_write" ON public.machines
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager', 'production-supervisor'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager', 'production-supervisor'));

-- ── inventory_items ──────────────────────────────────────────────────────────
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_read" ON public.inventory_items
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor',
    'procurement-manager', 'finance-manager'
  ));

CREATE POLICY "inventory_write" ON public.inventory_items
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager', 'procurement-manager'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager', 'procurement-manager'));

-- ── purchase_orders ──────────────────────────────────────────────────────────
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "po_read" ON public.purchase_orders
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'procurement-manager', 'finance-manager'
  ));

CREATE POLICY "po_write" ON public.purchase_orders
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager', 'procurement-manager'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager', 'procurement-manager'));

-- ── production_orders ─────────────────────────────────────────────────────────
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wo_read" ON public.production_orders
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor',
    'machine-operator', 'quality-inspector', 'finance-manager'
  ));

CREATE POLICY "wo_write" ON public.production_orders
  FOR ALL TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'machine-operator'
  ))
  WITH CHECK (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'machine-operator'
  ));

-- ── operators ────────────────────────────────────────────────────────────────
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "operators_read" ON public.operators
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor'
  ));

CREATE POLICY "operators_write" ON public.operators
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager'));

-- ── customer_orders ──────────────────────────────────────────────────────────
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "so_read" ON public.customer_orders
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor',
    'finance-manager', 'procurement-manager', 'sales-executive'
  ));

CREATE POLICY "so_write" ON public.customer_orders
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager', 'finance-manager'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager', 'finance-manager'));

-- ── defect_logs ───────────────────────────────────────────────────────────────
ALTER TABLE public.defect_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "defects_read" ON public.defect_logs
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'quality-inspector'
  ));

CREATE POLICY "defects_write" ON public.defect_logs
  FOR ALL TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'quality-inspector'
  ))
  WITH CHECK (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'quality-inspector'
  ));

-- ── vision_alerts ─────────────────────────────────────────────────────────────
ALTER TABLE public.vision_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vision_read" ON public.vision_alerts
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'quality-inspector'
  ));

CREATE POLICY "vision_write" ON public.vision_alerts
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'plant-manager', 'quality-inspector'))
  WITH CHECK (public.get_my_role() IN ('md', 'plant-manager', 'quality-inspector'));

-- ── camera_zones ──────────────────────────────────────────────────────────────
ALTER TABLE public.camera_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cameras_read" ON public.camera_zones
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN (
    'md', 'plant-manager', 'production-supervisor', 'quality-inspector'
  ));

-- ── CRM: leads ────────────────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_read" ON public.leads
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive', 'plant-manager'));

CREATE POLICY "leads_write" ON public.leads
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive'))
  WITH CHECK (public.get_my_role() IN ('md', 'sales-executive'));

-- ── CRM: follow_ups ───────────────────────────────────────────────────────────
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "followups_read" ON public.follow_ups
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive', 'plant-manager'));

CREATE POLICY "followups_write" ON public.follow_ups
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive'))
  WITH CHECK (public.get_my_role() IN ('md', 'sales-executive'));

-- ── CRM: site_visits ──────────────────────────────────────────────────────────
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visits_read" ON public.site_visits
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive', 'plant-manager'));

CREATE POLICY "visits_write" ON public.site_visits
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive'))
  WITH CHECK (public.get_my_role() IN ('md', 'sales-executive'));

-- ── CRM: timeline_events ─────────────────────────────────────────────────────
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timeline_read" ON public.timeline_events
  FOR SELECT TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive', 'plant-manager'));

CREATE POLICY "timeline_write" ON public.timeline_events
  FOR ALL TO authenticated
  USING (public.get_my_role() IN ('md', 'sales-executive'))
  WITH CHECK (public.get_my_role() IN ('md', 'sales-executive'));
