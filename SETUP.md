# Phase 4+5 Setup Guide — Supabase Backend + Auth

## What this adds

- **PostgreSQL database** via Supabase (14 tables — 10 manufacturing + 4 CRM)
- **Row Level Security** — every role can only query what they're authorised to see
- **Real authentication** — Supabase Auth with JWT (email + password)
- **Role-based access** enforced at the database layer (not just UI)
- **Demo fallback** — if Supabase isn't configured, the app still runs with mock data

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a region close to India (Singapore: `ap-southeast-1`)
3. Set a strong database password — save it somewhere
4. Wait ~2 minutes for the project to spin up

---

## 2. Run the SQL scripts

In **Supabase Dashboard → SQL Editor**, run these three files in order:

```
supabase/schema.sql   ← creates all tables + trigger
supabase/rls.sql      ← row level security per role
supabase/seed.sql     ← demo data (8 machines, leads, orders, etc.)
```

Open each file, paste into the editor, click **Run**.

---

## 3. Create demo user accounts

In **Supabase Dashboard → Authentication → Users → Add user**, create 8 accounts:

| Email | Password | Role metadata |
|-------|----------|---------------|
| `md@btv-demo.com` | `Demo@2025` | `{"role":"md","name":"Rajesh Annamalai"}` |
| `plant@btv-demo.com` | `Demo@2025` | `{"role":"plant-manager","name":"Senthil Kumar"}` |
| `production@btv-demo.com` | `Demo@2025` | `{"role":"production-supervisor","name":"Mani Selvaraj"}` |
| `operator@btv-demo.com` | `Demo@2025` | `{"role":"machine-operator","name":"Rajesh Kumar"}` |
| `quality@btv-demo.com` | `Demo@2025` | `{"role":"quality-inspector","name":"Ganesh Venkat"}` |
| `finance@btv-demo.com` | `Demo@2025` | `{"role":"finance-manager","name":"Priya Sundaram"}` |
| `procurement@btv-demo.com` | `Demo@2025` | `{"role":"procurement-manager","name":"Arjun Nair"}` |
| `sales@btv-demo.com` | `Demo@2025` | `{"role":"sales-executive","name":"Bharath Kumar"}` |

**Important**: When creating users, expand **"User metadata"** and paste the JSON from the "Role metadata" column. The trigger in schema.sql reads this and auto-creates the `user_profiles` row.

Also disable **email confirmation**:
- Authentication → Settings → Toggle **"Confirm email"** OFF (for demo)

---

## 4. Add environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values from **Supabase Dashboard → Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

---

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Select a role → sign in with the demo credentials → see your role-filtered dashboard.

---

## How it works

```
Browser → Supabase Auth → JWT token stored in localStorage
       → Next.js page loads → AuthGuard checks session
       → RoleProvider reads user_profiles for role
       → Pages call db.ts service functions → Supabase queries
       → RLS policies filter rows based on user's role
```

## Demo mode (no Supabase)

If `NEXT_PUBLIC_SUPABASE_URL` is not set, the app runs in **Demo Mode**:
- Login accepts any password
- All data comes from mock files (`manufacturing-data.ts`, `data.ts`)
- No database required — works on GitHub Pages as before

---

## Deploy to Vercel (recommended for production)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add the two environment variables in Vercel dashboard
4. Deploy — Vercel handles Next.js natively (no `output: "export"` needed)

For GitHub Pages (static): env vars must be added as **GitHub Secrets** named  
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the repo settings,  
and the GitHub Actions workflow must pass them as build args.

---

## Database tables

| Table | Module | Rows (seed) |
|-------|--------|-------------|
| `machines` | Production | 8 |
| `inventory_items` | Inventory | 10 |
| `purchase_orders` | Procurement | 7 |
| `production_orders` | Production | 6 |
| `operators` | Workforce | 12 |
| `customer_orders` | Orders | 7 |
| `defect_logs` | Quality | 5 |
| `vision_alerts` | Vision | 6 |
| `camera_zones` | Vision | 6 |
| `leads` | CRM | 8 |
| `follow_ups` | CRM | 5 |
| `site_visits` | CRM | 4 |
| `timeline_events` | CRM | 13 |
| `user_profiles` | Auth | 8 (via trigger) |

---

## Next steps (Phase 6+)

- **Real-time updates**: use `supabase.channel().on('postgres_changes', ...)` for live machine status
- **AI layer**: add FastAPI service for anomaly detection, demand forecasting
- **File uploads**: Supabase Storage for quality photos, invoices
- **Edge Functions**: Supabase Edge Functions for scheduled reports
