-- ═══════════════════════════════════════════════════════════════════════════
-- Bharat Tech Verse CRM — Demo Seed Data
-- Run AFTER schema.sql + rls.sql.
-- Uses UPSERT so re-running is safe.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Machines ─────────────────────────────────────────────────────────────────
INSERT INTO public.machines (id, name, type, status, operator, target, produced, efficiency, oee, temperature, runtime, downtime, last_maintenance, shift, alerts) VALUES
('m1','CNC Lathe 1','CNC Lathe','Running','Rajesh Kumar',120,108,90,85,42,'6h 20m','0m','2026-06-15','A','[]'),
('m2','CNC Lathe 2','CNC Lathe','Running','Murugan S',120,95,79,72,38,'5h 45m','35m','2026-06-18','A','["Cycle time 18% above average"]'),
('m3','Milling Machine 1','Milling','Running','Selvam R',80,76,95,91,45,'6h 10m','0m','2026-06-10','A','[]'),
('m4','Milling Machine 2','Milling','Stopped','Arun K',80,32,40,28,0,'2h 10m','4h 10m','2026-05-28','A','["Breakdown — spindle bearing failure","Maintenance requested at 09:45"]'),
('m5','Drilling Machine','Drilling','Running','Karthik P',200,188,94,89,35,'6h 20m','0m','2026-06-20','A','[]'),
('m6','Grinding Machine','Grinding','Running','Suresh M',150,140,93,88,48,'6h 00m','20m','2026-06-12','A','[]'),
('m7','Hydraulic Press','Press','Maintenance','Vijay T',100,45,45,32,0,'3h 00m','3h 20m','2026-06-21','A','["Scheduled PM — hydraulic seal replacement"]'),
('m8','Surface Grinder','Grinding','Running','Bala N',90,85,94,90,40,'6h 15m','5m','2026-06-08','B','[]')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, produced = EXCLUDED.produced,
  oee = EXCLUDED.oee, alerts = EXCLUDED.alerts, updated_at = NOW();

-- ── Inventory Items ──────────────────────────────────────────────────────────
INSERT INTO public.inventory_items (id, name, category, unit, stock, reorder_level, max_stock, monthly_usage, vendor, status) VALUES
('inv-1','MS Rods (25mm)','Raw Material','kg',850,500,2000,1200,'Coimbatore Steel Traders','OK'),
('inv-2','Aluminum Billets','Raw Material','kg',180,300,1000,450,'Annamalai Metals','Low'),
('inv-3','Cast Iron Blocks','Raw Material','pcs',42,50,200,80,'Salem Alloys','Low'),
('inv-4','Brass Rods (20mm)','Raw Material','kg',620,200,800,350,'Coimbatore Steel Traders','OK'),
('inv-5','SS Sheets (2mm)','Raw Material','kg',95,150,500,200,'Chennai Steel Corp','Critical'),
('inv-6','Carbide Inserts','Consumable','pcs',280,100,500,180,'Tool Mart CBE','OK'),
('inv-7','Coolant Oil','Consumable','liters',450,200,1000,300,'Lubri Corp','OK'),
('inv-8','Engine Brackets (FG)','Finished Goods','pcs',320,100,600,400,'—','OK'),
('inv-9','Gear Housings (FG)','Finished Goods','pcs',85,50,300,200,'—','OK'),
('inv-10','Pump Bodies (FG)','Finished Goods','pcs',35,40,150,80,'—','Low')
ON CONFLICT (id) DO UPDATE SET
  stock = EXCLUDED.stock, status = EXCLUDED.status, updated_at = NOW();

-- ── Purchase Orders ──────────────────────────────────────────────────────────
INSERT INTO public.purchase_orders (id, item, vendor, qty, unit, amount, ordered_date, expected_date, status) VALUES
('PO-2024-001','Aluminum Billets','Annamalai Metals',500,'kg',87500,'2026-06-18','2026-06-24','In Transit'),
('PO-2024-002','SS Sheets (2mm)','Chennai Steel Corp',300,'kg',54000,'2026-06-19','2026-06-25','Pending Approval'),
('PO-2024-003','Cast Iron Blocks','Salem Alloys',100,'pcs',35000,'2026-06-15','2026-06-22','Delayed'),
('PO-2024-004','Carbide Inserts','Tool Mart CBE',200,'pcs',18000,'2026-06-20','2026-06-23','Delivered'),
('PO-2024-005','MS Rods (25mm)','Coimbatore Steel Traders',1000,'kg',65000,'2026-06-21','2026-06-28','Pending Approval'),
('PO-2024-006','Coolant Oil','Lubri Corp',400,'liters',12000,'2026-06-14','2026-06-20','Delivered'),
('PO-2024-007','Brass Rods (20mm)','Coimbatore Steel Traders',200,'kg',28000,'2026-06-17','2026-06-26','In Transit')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW();

-- ── Production Orders ─────────────────────────────────────────────────────────
INSERT INTO public.production_orders (id, product, customer, qty, produced, due_date, status, priority, machine) VALUES
('WO-1001','Engine Bracket (EB-201)','Ashok Leyland',500,420,'2026-06-25','In Progress','High','CNC Lathe 1'),
('WO-1002','Gear Housing (GH-305)','TVS Motors',300,300,'2026-06-22','Completed','High','Milling Machine 1'),
('WO-1003','Shaft Assembly (SA-108)','Bosch India',200,148,'2026-06-28','In Progress','Medium','CNC Lathe 2'),
('WO-1004','Bearing Housing (BH-422)','SKF India',150,0,'2026-07-05','Planned','Low','Milling Machine 2'),
('WO-1005','Pump Body (PB-510)','Grundfos India',80,35,'2026-06-24','At Risk','High','Hydraulic Press'),
('WO-1006','Engine Bracket (EB-201)','Tata Motors',400,0,'2026-07-10','Planned','Medium','CNC Lathe 1')
ON CONFLICT (id) DO UPDATE SET
  produced = EXCLUDED.produced, status = EXCLUDED.status, updated_at = NOW();

-- ── Operators ────────────────────────────────────────────────────────────────
INSERT INTO public.operators (id, name, role, shift, machine, status, attendance, productivity, overtime, safety_score) VALUES
('op1','Rajesh Kumar','CNC Operator','A','CNC Lathe 1','Present',96,90,4,98),
('op2','Murugan S','CNC Operator','A','CNC Lathe 2','Present',88,79,2,95),
('op3','Selvam R','Milling Operator','A','Milling M/C 1','Present',98,95,0,100),
('op4','Arun K','Milling Operator','A','Milling M/C 2','Present',82,40,0,90),
('op5','Karthik P','Drill Operator','A','Drilling Machine','Present',97,94,6,97),
('op6','Suresh M','Grinding Operator','A','Grinding Machine','Present',94,93,3,99),
('op7','Vijay T','Press Operator','A','Hydraulic Press','Present',91,45,0,88),
('op8','Bala N','Grinder Operator','B','Surface Grinder','Present',95,94,5,96),
('op9','Ganesh V','QC Inspector','A','QC Station','Present',99,98,2,100),
('op10','Praveen R','CNC Operator','B','CNC Lathe 1','Absent',72,0,0,85),
('op11','Senthil K','Material Handler','A','Stores','Present',96,92,1,94),
('op12','Durai S','Maintenance Tech','A','General','On Leave',89,0,0,92)
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- ── Customer Orders ───────────────────────────────────────────────────────────
INSERT INTO public.customer_orders (id, customer, product, qty, dispatched_qty, order_date, promised_date, status, value, contact) VALUES
('SO-5001','Ashok Leyland','Engine Bracket (EB-201)',500,0,'2026-06-01','2026-06-25','On Track',375000,'Ramesh M'),
('SO-5002','TVS Motors','Gear Housing (GH-305)',300,300,'2026-05-28','2026-06-22','Completed',210000,'Priya K'),
('SO-5003','Bosch India','Shaft Assembly (SA-108)',200,0,'2026-06-05','2026-06-28','On Track',160000,'Anand S'),
('SO-5004','SKF India','Bearing Housing (BH-422)',150,0,'2026-06-10','2026-07-05','On Track',127500,'Vijay R'),
('SO-5005','Grundfos India','Pump Body (PB-510)',80,0,'2026-06-08','2026-06-24','At Risk',144000,'Meena P'),
('SO-5006','Tata Motors','Engine Bracket (EB-201)',400,0,'2026-06-15','2026-07-10','On Track',300000,'Kumar V'),
('SO-5007','Mahindra & Mahindra','Shaft Assembly (SA-108)',100,20,'2026-06-12','2026-06-28','Delayed',80000,'Suresh B')
ON CONFLICT (id) DO UPDATE SET
  dispatched_qty = EXCLUDED.dispatched_qty, status = EXCLUDED.status, updated_at = NOW();

-- ── Defect Logs ───────────────────────────────────────────────────────────────
INSERT INTO public.defect_logs (id, time, machine, type, part, qty, action) VALUES
('DL-01','11:42','CNC Lathe 2','Dimensional Error','Shaft Assembly',4,'Operator alerted, tool changed'),
('DL-02','10:15','Milling M/C 2','Surface Defect','Gear Housing',8,'Machine stopped for inspection'),
('DL-03','09:30','Hydr. Press','Burr / Flash','Engine Bracket',6,'Rework initiated'),
('DL-04','08:55','CNC Lathe 1','Tool Wear Mark','Engine Bracket',3,'Insert replaced'),
('DL-05','08:10','Grinding','Dimensional Error','Bearing Housing',2,'Grinding wheel dressed')
ON CONFLICT (id) DO NOTHING;

-- ── Vision Alerts ─────────────────────────────────────────────────────────────
INSERT INTO public.vision_alerts (id, camera, type, description, alert_time, severity, status) VALUES
('va1','Zone A — CNC Area','PPE Violation','Operator without helmet near CNC Lathe 1','2026-06-21T08:42:00+05:30','High','Open'),
('va2','Zone C — Grinding Area','PPE Violation','Safety glasses not worn at grinding station','2026-06-21T09:15:00+05:30','High','Open'),
('va3','Zone A — CNC Area','Machine Idle','CNC Lathe 2 idle for more than 30 minutes','2026-06-21T07:30:00+05:30','Medium','Resolved'),
('va4','Zone D — Press Area','Safety Violation','Camera offline — blind spot in press area','2026-06-21T10:20:00+05:30','High','Open'),
('va5','Zone C — Grinding Area','Queue Build-up','WIP queue exceeding 50 units at grinding output','2026-06-21T11:05:00+05:30','Medium','Open'),
('va6','Zone F — Stores','Intrusion','Unauthorised entry detected in restricted stores area','2026-06-21T06:58:00+05:30','High','Resolved')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- ── Camera Zones ──────────────────────────────────────────────────────────────
INSERT INTO public.camera_zones (id, name, location, status, ppe_compliance, last_alert, alert_count) VALUES
('cam1','Zone A — CNC Area','Shop Floor North','Online',94,'Helmet not worn',2),
('cam2','Zone B — Milling Area','Shop Floor Centre','Online',100,NULL,0),
('cam3','Zone C — Grinding Area','Shop Floor South','Online',88,'Safety glasses violation',3),
('cam4','Zone D — Press Area','Shop Floor East','Offline',0,'Camera offline since 10:20',1),
('cam5','Zone E — Entry Gate','Factory Entrance','Online',100,NULL,0),
('cam6','Zone F — Stores','Inventory Area','Online',96,NULL,1)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status, ppe_compliance = EXCLUDED.ppe_compliance, updated_at = NOW();

-- ── CRM: Leads ────────────────────────────────────────────────────────────────
INSERT INTO public.leads (id, name, phone, email, location, source, status, assigned_to, enquiry, last_follow_up, next_follow_up, created_at) VALUES
('lead-1','Karthik Subramaniam','+91 98765 43210','karthik.subramaniam@gmail.com','Saravanampatti','Facebook Ads','Site Visit','Bharath Kumar','3BHK villa enquiry - Saravanampatti','2026-06-19','2026-06-23','2026-06-05T00:00:00+05:30'),
('lead-2','Priya Venkatesh','+91 98421 11234','priya.venkatesh@gmail.com','RS Puram','Referral','Won','Yamini Sridhar','2BHK apartment - RS Puram resale','2026-06-15',NULL,'2026-05-20T00:00:00+05:30'),
('lead-3','Arun Raj','+91 99440 22456','arun.raj@gmail.com','Peelamedu','Google Ads','Interested','Praveen Anand','Full home interior - Peelamedu','2026-06-18','2026-06-25','2026-06-10T00:00:00+05:30'),
('lead-4','Meena Krishnaswamy','+91 97890 33567','meena.k@outlook.com','Ganapathy','WhatsApp','Follow-up','Shobana Murali','Plot purchase - Ganapathy','2026-06-17','2026-06-22','2026-06-08T00:00:00+05:30'),
('lead-5','Suresh Babu','+91 98001 44678','suresh.babu@gmail.com','Singanallur','Walk-in','New','Dinesh Kannan','Commercial space - Singanallur','2026-06-20',NULL,'2026-06-20T00:00:00+05:30'),
('lead-6','Lakshmi Narayanan','+91 94877 55789','lakshmi.narayanan@gmail.com','Race Course','Facebook Ads','Lost','Bharath Kumar','3BHK apartment - Race Course','2026-06-10',NULL,'2026-05-15T00:00:00+05:30'),
('lead-7','Deepak Mohan','+91 98422 66890','deepak.mohan@gmail.com','Coimbatore North','Google Ads','Site Visit','Yamini Sridhar','2BHK flat - near KMCH','2026-06-19','2026-06-24','2026-06-12T00:00:00+05:30'),
('lead-8','Anitha Rajendran','+91 99003 77901','anitha.r@gmail.com','Saibaba Colony','Referral','Won','Praveen Anand','Villa plot - Saibaba Colony','2026-06-14',NULL,'2026-05-10T00:00:00+05:30')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, last_follow_up = EXCLUDED.last_follow_up;

-- ── CRM: Follow-ups ───────────────────────────────────────────────────────────
INSERT INTO public.follow_ups (id, lead_id, lead_name, executive, priority, due_date, status, remarks) VALUES
('fu-1','lead-1','Karthik Subramaniam','Bharath Kumar','High','2026-06-23','Pending','Confirm site visit time, share project details'),
('fu-2','lead-3','Arun Raj','Praveen Anand','Medium','2026-06-21','Overdue','Send interior portfolio samples'),
('fu-3','lead-4','Meena Krishnaswamy','Shobana Murali','High','2026-06-22','Pending','Plot legal verification docs to share'),
('fu-4','lead-7','Deepak Mohan','Yamini Sridhar','High','2026-06-24','Pending','Confirm KMCH-area flat availability'),
('fu-5','lead-1','Karthik Subramaniam','Bharath Kumar','Medium','2026-06-19','Done','Shared floor plans and brochure via WhatsApp')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- ── CRM: Site Visits ──────────────────────────────────────────────────────────
INSERT INTO public.site_visits (id, lead_id, lead_name, date, executive, status, remarks) VALUES
('sv-1','lead-1','Karthik Subramaniam','2026-06-23','Bharath Kumar','Scheduled','Villa project at Saravanampatti — unit 12B'),
('sv-2','lead-7','Deepak Mohan','2026-06-24','Yamini Sridhar','Scheduled','2BHK near KMCH — 3rd floor available'),
('sv-3','lead-2','Priya Venkatesh','2026-06-02','Yamini Sridhar','Completed','Deal closed at ₹62L after visit'),
('sv-4','lead-8','Anitha Rajendran','2026-05-28','Praveen Anand','Completed','Plot dimensions verified, deal finalised')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- ── CRM: Timeline Events ─────────────────────────────────────────────────────
INSERT INTO public.timeline_events (id, lead_id, type, title, description, ts) VALUES
('tl-1-1','lead-1','note','Lead captured','Lead captured from Facebook Ads campaign','2026-06-05T09:15:00+05:30'),
('tl-1-2','lead-1','call','Call made','Discussed 3BHK villa requirements and budget (₹85L-95L)','2026-06-07T11:00:00+05:30'),
('tl-1-3','lead-1','followup','Follow-up added','Shared villa brochure and floor plans via WhatsApp','2026-06-12T15:30:00+05:30'),
('tl-1-4','lead-1','note','Note added','Client confirmed interest, wants to see model unit','2026-06-16T10:00:00+05:30'),
('tl-1-5','lead-1','site-visit','Site visit scheduled','Scheduled site visit for Saravanampatti villa project on 23 Jun','2026-06-19T17:00:00+05:30'),
('tl-2-1','lead-2','note','Lead captured','Referral from existing client','2026-05-20T10:00:00+05:30'),
('tl-2-2','lead-2','call','Call made','Discussed 2BHK resale options in RS Puram','2026-05-23T12:00:00+05:30'),
('tl-2-3','lead-2','site-visit','Site visit completed','Visited the RS Puram flat, client impressed','2026-06-02T16:00:00+05:30'),
('tl-2-4','lead-2','followup','Follow-up added','Negotiating final price with owner','2026-06-10T14:00:00+05:30'),
('tl-2-5','lead-2','status','Marked as Won','Deal closed at ₹62L','2026-06-15T11:30:00+05:30'),
('tl-3-1','lead-3','note','Lead captured','Google Ads — interior design enquiry','2026-06-10T09:00:00+05:30'),
('tl-3-2','lead-3','call','Call made','Discussed full home interior budget ₹12L-15L','2026-06-13T14:00:00+05:30'),
('tl-3-3','lead-3','followup','Follow-up added','Sent portfolio and package options','2026-06-18T11:00:00+05:30')
ON CONFLICT (id) DO NOTHING;
