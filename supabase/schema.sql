-- ════════════════════════════════════════════════════════════════
--  RollRicks — Supabase schema (re-runnable)
--
--  How to apply:
--    1. Create a new Supabase project (free tier) at supabase.com
--    2. In the project: SQL Editor → New query → paste this file → Run
--    3. In Auth → Users → "Add user" → create admin@rollricks.in
--       with whatever password you want. That email MUST match the
--       string in the admin policies below.
--    4. In Project Settings → API → copy the Project URL and the
--       "anon public" key. Paste them into E:\Roll\rollricks\.env.local
--       (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
--    5. Rebuild + redeploy.
-- ════════════════════════════════════════════════════════════════

-- ── Tables ────────────────────────────────────────────────────────
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

-- ── RLS on (event_enquiries left off, see playbook §4) ───────────
alter table public.orders            enable row level security;
alter table public.menu_config       enable row level security;
alter table public.event_enquiries   enable row level security;

-- Drop & recreate policies (idempotent)
drop policy if exists "anyone can read menu_config"      on public.menu_config;
drop policy if exists "anyone can create an order"       on public.orders;
drop policy if exists "anyone can read orders by phone"  on public.orders;
drop policy if exists "anyone can submit an enquiry"     on public.event_enquiries;
drop policy if exists "admin full access on orders"      on public.orders;
drop policy if exists "admin can update menu_config"     on public.menu_config;
drop policy if exists "admin can read enquiries"         on public.event_enquiries;

-- Public — read menu config, create orders, submit enquiries
create policy "anyone can read menu_config" on public.menu_config
  for select to anon, authenticated using (true);

create policy "anyone can create an order" on public.orders
  for insert to anon, authenticated with check (status = 'new');

create policy "anyone can read orders by phone" on public.orders
  for select to anon, authenticated using (true);

create policy "anyone can submit an enquiry" on public.event_enquiries
  for insert to anon, authenticated with check (true);

-- Admin — full access (uses JWT email match)
-- CHANGE 'admin@rollricks.in' here AND in the user you create in Auth.
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

-- Grants (belt-and-braces; Supabase auto-grants but explicit is safer)
grant select, insert on public.orders to anon, authenticated;
grant update on public.orders to authenticated;
grant select on public.menu_config to anon, authenticated;
grant insert, update on public.menu_config to authenticated;
grant insert on public.event_enquiries to anon, authenticated;
grant select on public.event_enquiries to authenticated;

-- Realtime — needed so /admin and /track auto-refresh on changes
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.menu_config;
