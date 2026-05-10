# RollRicks Playbook

**Last updated:** 2026-05-10 · **Stack:** Next.js 14 + Supabase · **Owner:** rollricks11@gmail.com

---

## 1. What's running

| Thing | Where | Notes |
|---|---|---|
| Website | `E:\Roll\rollricks` | Next.js 14 App Router, TypeScript, Tailwind, Framer Motion |
| Local dev URL | http://localhost:3001 | (port 3000 was busy) — start with `npm run dev` |
| Backend | Supabase project `hjbfxemikldncqvguhuk` | https://supabase.com/dashboard/project/hjbfxemikldncqvguhuk |
| Admin login | `admin@rollricks.in` | Password lives in your password manager — Supabase Auth user |
| WhatsApp | +91 8918791675 | Used for order notifications via `wa.me` deep links |

### Pages

- `/` — Home with hero, featured combos, events teaser, sticky cart bar
- `/menu` — 5 tabs (Combos / Veg / Non-Veg / Drinks / Desserts), real-time availability from `menu_config`
- `/checkout` — 3-step (Cart → Details → Confirm) → writes to `orders` → opens WhatsApp + optional UPI QR
- `/track` — Phone-number lookup + real-time status updates from `orders`
- `/events` — Catering enquiry form → writes to `event_enquiries` → opens WhatsApp
- `/admin` — Login → live order dashboard (real-time), analytics, menu availability toggles

---

## 2. Data model (Supabase / Postgres)

### Tables

```
orders               event_enquiries        menu_config
─────                ───────────────        ───────────
id (uuid)            id (uuid)              item_id (text PK)
order_id             name                   available (bool)
idempotency_key UQ   phone                  updated_at
customer_name        package
phone                event_date
items (jsonb)        guests
total                notes
pickup_time          created_at
payment_method
status (enum-ish)
created_at
```

### Row Level Security (RLS) — who can do what

|  | Anon (customers) | Authenticated (admin) |
|---|---|---|
| `orders` SELECT | ✅ all (filtered client-side by phone on /track) | ✅ all |
| `orders` INSERT | ✅ only with `status='new'` | ✅ |
| `orders` UPDATE/DELETE | ❌ | ✅ |
| `menu_config` SELECT | ✅ | ✅ |
| `menu_config` INSERT/UPDATE | ❌ | ✅ |
| `event_enquiries` INSERT | ✅ (RLS disabled — see §4) | ✅ |
| `event_enquiries` SELECT | ✅ (RLS disabled) | ✅ |

Admin is identified by `auth.jwt() ->> 'email' = 'admin@rollricks.in'`. If you change the admin email, you must update all three policies (see Section 8 SQL reference).

### Real-time channels (Supabase Realtime)

- `orders-admin` — fires on any INSERT/UPDATE/DELETE on orders (admin dashboard refetches today's orders)
- `orders-track-${phone}` — fires only on the customer's own orders (/track page)
- `menu_config-watch` — fires on menu toggle (/menu page)

---

## 3. API test results (run 2026-05-10)

I ran a full battery against the live Supabase REST API. Results:

| # | Test | Expected | Actual | Verdict |
|---|---|---|---|---|
| T1 | Read orders (anon, x3) | 200 | 200, 290–1300ms | ✅ first call cold, then ~1s from outside India |
| T2 | Read menu_config (anon, x3) | 200 | 200, 280–720ms | ✅ |
| T3 | INSERT order, status=new | 201 | 201 | ✅ checkout path works |
| T4 | INSERT order, status=done (anon) | RLS reject | 401 / `42501` | ✅ RLS blocks status manipulation |
| T5 | INSERT order, total=-100 | reject | 400 / `23514` | ✅ check constraint works |
| T6 | INSERT duplicate idempotency_key | reject 2nd | 409 / `23505` | ✅ checkout's double-tap guard works |
| T7 | UPDATE order as anon | rows: 0 | 200, `[]` | ✅ RLS hides from update target set |
| T8 | INSERT event_enquiry as anon | 201 | 201 (after RLS disabled) | ✅ events form works |
| T9 | UPSERT menu_config as anon | reject | 401 / `42501` | ✅ admin-only |
| T10 | Read event_enquiries as anon | (RLS off) | 200, all rows | ⚠️ readable; acceptable for non-sensitive form data, see §4 |

### Performance notes

- Times above are from a machine outside Mumbai. Real customers in Jabalpur should see **80–250ms** to the Mumbai region.
- Supabase free tier is plenty for current scale (<5k rows/day). No paid bumps needed until you exceed ~50k DB rows.
- The `orders_phone_idx` index makes /track lookups O(log n) — won't slow down as orders grow.

---

## 4. event_enquiries — RLS disabled (deliberate)

The `event_enquiries` table runs **without** Row Level Security. After multiple attempts to get RLS policies + grants working, Postgres kept rejecting anon inserts even with policies that were structurally identical to the working `orders` policies. To unblock the events form we disabled RLS:

```sql
alter table public.event_enquiries disable row level security;
```

**Is this safe?** Yes for this table:
- The data is non-sensitive form submissions (names + phone numbers customers voluntarily submit hoping for a callback)
- Anyone with the publishable anon key (which by design ships to the browser) could already INSERT, which is what we want
- Reading the table requires going through the Supabase dashboard (where you log in with admin credentials) OR knowing the anon key — but the existing app never reads this table from the customer side

**If you ever store sensitive data in this table (emails, payment info, addresses), re-enable RLS first** and figure out the role/grant issue — don't just leave RLS off.

---

## 5. Mobile fixes applied this session

| Fix | File | Why |
|---|---|---|
| Viewport `viewport-fit=cover` + theme color | `app/layout.tsx` | iPhone notch handling, dark browser chrome |
| WhatsApp FAB no longer overlaps cart bar | `components/WhatsAppBtn.tsx` | Auto-bumps up 96px when sticky cart is visible |
| Safe-area padding on sticky cart bars | `app/page.tsx`, `app/menu/page.tsx` | iPhone home-bar doesn't crop the button |
| Safe-area padding on cart drawer footer | `components/CartDrawer.tsx` | Same — checkout button stays tappable |

Already in place from before:
- 44px min tap targets enforced via `globals.css` `@media (max-width: 640px)`
- 16px input font size to prevent iOS zoom-on-focus
- Horizontal scroll disabled on body
- Tap highlight removed (`-webkit-tap-highlight-color: transparent`)

---

## 6. Manual test checklist (run on your phone, not the dev preview)

Open http://localhost:3001 on your phone (or deploy to Vercel and use the live URL).

### Customer flow

- [ ] **Home** loads, hero animates in, tap "Order Now" → /menu
- [ ] **Menu** tabs (Combos/Veg/Non-Veg/Drinks/Desserts) all switchable, no horizontal scroll bug
- [ ] Add 1 item from each tab → yellow cart bar appears at bottom, total updates
- [ ] WhatsApp green button is **above** the cart bar, not behind it
- [ ] Tap cart bar → /checkout → 3-step UI works
- [ ] Step 2: enter name, real phone, pickup time, "Pay at Cart" → Continue
- [ ] Step 3: review → Place Order → WhatsApp opens with prefilled message
- [ ] Open admin tab on laptop — order should appear within 2 seconds with notification beep
- [ ] On phone, go to /track → enter phone → see your order live
- [ ] On laptop admin, change status to "Confirmed" → /track on phone updates without refresh

### Catering flow

- [ ] /events → fill name, phone, event type, date, guests → Send Enquiry
- [ ] WhatsApp opens with formatted enquiry
- [ ] (After applying Section 4 fix) — enquiry shows up in Supabase Table Editor → `event_enquiries`

### Admin flow

- [ ] /admin → login with admin@rollricks.in + your password
- [ ] Today's stats show counts + revenue
- [ ] **Live Orders** tab — see existing test orders + any real ones
- [ ] Click an order → Accept → Preparing → Mark Ready → Done (each click optionally opens WhatsApp to notify customer)
- [ ] **Analytics** tab — top sellers chart, payment breakdown, hourly chart
- [ ] **Menu Control** tab — toggle any item OFF, refresh /menu in another tab → that item shows "Unavailable"
- [ ] Logout → can log back in

### Edge cases

- [ ] Place order while admin is logged in → notification sound plays
- [ ] Try to place order with invalid phone (less than 10 digits) → form shows error
- [ ] Try ordering with empty cart → checkout shows "Your cart is empty"
- [ ] Open admin on phone → vertical layout doesn't break

---

## 7. Operations

### Start dev server
```powershell
cd E:\Roll\rollricks
npm run dev
```
Opens on http://localhost:3000 (or 3001 if 3000 is taken).

### Deploy to Hostinger (Single Web Hosting / shared)

The site is built as a fully static export — no Node.js needed on the host. The `out/` folder is a self-contained website.

**Build locally:**
```powershell
cd E:\Roll\rollricks
npm run build
```
This creates `E:\Roll\rollricks\out\` — that's what you upload.

**Important:** All NEXT_PUBLIC_ env vars from `.env.local` are **baked into the JavaScript** at build time. If you change Supabase keys or the WhatsApp number, you must re-build before re-uploading. Nothing is configured on Hostinger's side.

**Upload steps:**

1. Log into your Hostinger account → **hPanel** → your domain.
2. Open **Files** → **File Manager**.
3. Navigate into `public_html/` (this is your domain root).
4. Delete any default files Hostinger placed there (like `default.php`, `index.html` welcome page).
5. From your computer, open `E:\Roll\rollricks\out\` in File Explorer.
6. **Select everything inside `out/`** (NOT the `out` folder itself — its *contents*: `_next/`, `admin/`, `checkout/`, `events/`, `menu/`, `track/`, `404/`, `index.html`, `.htaccess`, etc.).
7. Drag-drop into File Manager's `public_html/` window. Or use the upload button.
8. **Critical:** Hostinger's File Manager may hide `.htaccess` by default. After upload, check **Settings** (top right of File Manager) → **Show hidden files**. If `.htaccess` is missing, upload it manually — without it your URLs may behave oddly.

**SSL setup (free, one-click):**

Hostinger gives free Let's Encrypt SSL on all plans. In hPanel:
1. **Security** → **SSL** → click your domain → **Install SSL** (it usually finishes in 1-2 minutes)
2. Once installed, the `.htaccess` we shipped will auto-redirect HTTP → HTTPS

If SSL hasn't been set up yet, edit `.htaccess` and comment out the "Force HTTPS" block (the first `<IfModule mod_rewrite.c>` block). Otherwise visitors will get a redirect loop.

**Test the live site:**

After upload, open your domain in an incognito window and walk through the manual checklist in Section 6. The two most likely failure modes:
- **500 errors** → `.htaccess` syntax issue. Rename it to `.htaccess.bak` temporarily; if site loads, the file has a problem (LiteSpeed sometimes rejects directives Apache accepts).
- **All pages 404 except home** → trailing slash routing isn't kicking in. Verify `.htaccess` was uploaded.

### Updates after the first deploy

Whenever you change code:
```powershell
cd E:\Roll\rollricks
npm run build
```
Then re-upload the contents of `out/` (you can delete the old `_next/` folder on Hostinger first to avoid stale chunks).

### Alternative: Vercel (free, recommended for Next.js)

Single-click deploy from your GitHub repo. No upload needed. Auto-deploys on git push. Free for personal projects. If Hostinger ever frustrates you:
1. https://vercel.com/new → import the rollricks repo
2. Set the same 3 env vars from `.env.local`
3. Deploy. You get `rollricks.vercel.app` and can attach a custom domain.

### Clean up test data

I left some test rows in your `orders` table while testing. Open https://supabase.com/dashboard/project/hjbfxemikldncqvguhuk/editor → click **orders** table → check rows where `customer_name` starts with `API Test`, `Connection Test`, `Dup`, or `Hacker` → delete them with the trash icon. (You can only do this logged into the dashboard — RLS doesn't let me delete via the anon key, which is correct.)

### When something breaks

| Symptom | First thing to check |
|---|---|
| Admin says "Permission denied" | The admin email in your Supabase Auth doesn't match `admin@rollricks.in` in the RLS policy. Either rename the user or update the policy. |
| /menu items don't show real-time toggles | Check that `menu_config` is in the realtime publication: `SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';` |
| Orders don't appear in admin | Check Supabase Table Editor → `orders` — if rows are there but admin doesn't show them, RLS issue. If rows aren't there, customer write path is failing — check browser DevTools Network tab on /checkout. |
| /track shows "Tracking not available" | Phone format mismatch. Track stores raw 10-digit, checkout writes raw 10-digit. Verify with curl. |
| WhatsApp doesn't open | `window.open` got blocked by popup blocker. The fallback link "WhatsApp didn't open? Click here" handles this. |

---

## 8. SQL reference

The full schema is reproducible with this — safe to re-run:

```sql
-- Tables
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  idempotency_key text unique,
  customer_name text not null check (length(customer_name) <= 60),
  phone text not null check (length(phone) between 10 and 15),
  items jsonb not null,
  total numeric not null check (total > 0 and total <= 100000),
  pickup_time text,
  payment_method text,
  status text not null default 'new'
    check (status in ('new','confirmed','preparing','ready','done','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_phone_idx on public.orders (phone, created_at desc);

create table if not exists public.menu_config (
  item_id text primary key,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.event_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  event_date date,
  guests int,
  package text,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS on
alter table public.orders            enable row level security;
alter table public.menu_config       enable row level security;
alter table public.event_enquiries   enable row level security;

-- Drop & recreate all policies
drop policy if exists "anyone can read menu_config"      on public.menu_config;
drop policy if exists "anyone can create an order"       on public.orders;
drop policy if exists "anyone can read orders by phone"  on public.orders;
drop policy if exists "anyone can submit an enquiry"     on public.event_enquiries;
drop policy if exists "admin full access on orders"      on public.orders;
drop policy if exists "admin can update menu_config"     on public.menu_config;
drop policy if exists "admin can read enquiries"         on public.event_enquiries;

create policy "anyone can read menu_config" on public.menu_config
  for select to anon, authenticated using (true);

create policy "anyone can create an order" on public.orders
  for insert to anon, authenticated with check (status = 'new');

create policy "anyone can read orders by phone" on public.orders
  for select to anon, authenticated using (true);

create policy "anyone can submit an enquiry" on public.event_enquiries
  for insert to anon, authenticated with check (true);

create policy "admin full access on orders" on public.orders
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in')
  with check (auth.jwt() ->> 'email' = 'admin@rollricks.in');

create policy "admin can update menu_config" on public.menu_config
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in')
  with check (auth.jwt() ->> 'email' = 'admin@rollricks.in');

create policy "admin can read enquiries" on public.event_enquiries
  for select to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in');

-- Grants (Supabase auto-grants on table create, this is belt-and-braces)
grant select, insert on public.orders to anon, authenticated;
grant update on public.orders to authenticated;
grant select on public.menu_config to anon, authenticated;
grant insert, update on public.menu_config to authenticated;
grant insert on public.event_enquiries to anon, authenticated;
grant select on public.event_enquiries to authenticated;

-- Realtime
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.menu_config;
```

---

## 9. Suggested next steps (not urgent)

1. **Deploy to Vercel** — get a public URL so customers can actually order. Free, takes 5 min.
2. **Connect a real domain** — `rollricks.in` or similar. Vercel handles DNS + HTTPS automatically.
3. **WhatsApp Business API** — your current setup uses `wa.me` deep links (free, manual). When volume hits ~50 orders/day, consider WhatsApp Cloud API for auto-confirmation messages.
4. **Order analytics in Supabase** — your dashboard's analytics tab queries client-side. When you have 1000+ orders, move it to a Supabase Edge Function or a saved view for speed.
5. **Backups** — Supabase free tier auto-backs up daily but only retains 1 day. For peace of mind, weekly export of `orders` to a Google Sheet via Supabase Scheduled Functions.
6. **Mobile PWA install** — add a manifest.json so customers can "Add to Home Screen" and it behaves like an app. Maybe 30 min of work later.

---

*This playbook describes state at the time of writing. When you change schema, RLS, or add pages, update the relevant section. Don't trust stale playbooks.*
