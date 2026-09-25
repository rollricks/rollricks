-- ════════════════════════════════════════════════════════════════
--  RollRicks — migration 002: order privacy + partner enquiries
--
--  WHY: the `orders` table had a public SELECT policy
--  ("anyone can read orders by phone" USING (true)), so anyone holding
--  the public anon key — which ships inside the website JS — could list
--  every customer's name, phone and order.
--
--  FIX: customers never read `orders` directly any more. Two narrow
--  SECURITY DEFINER functions return only what the site needs:
--    • track_orders(phone) → that phone's recent orders, no names/phones
--    • slot_counts()        → today's per-slot order counts, no customer data
--
--  WHEN TO RUN: together with deploying the redesign build (the new
--  /track and /checkout call these functions and fall back to the old
--  direct read only until this migration exists). The CURRENT live site
--  still reads `orders` directly, so running step 3 before deploying
--  the new build would break /track on the old site.
--
--  HOW: Supabase dashboard → SQL Editor → paste → Run. Re-runnable.
-- ════════════════════════════════════════════════════════════════

-- 1. Phone-scoped order lookup for /track ──────────────────────────
create or replace function public.track_orders(p_phone text)
returns table (
  id uuid,
  order_id text,
  items jsonb,
  total numeric,
  pickup_time text,
  payment_method text,
  status text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select o.id, o.order_id, o.items, o.total, o.pickup_time,
         o.payment_method, o.status, o.created_at
  from public.orders o
  where p_phone ~ '^[0-9]{10}$'
    and o.phone = p_phone
    and o.created_at > now() - interval '30 days'
  order by o.created_at desc
  limit 20;
$$;

revoke all on function public.track_orders(text) from public;
grant execute on function public.track_orders(text) to anon, authenticated;

-- 2. Pickup-slot fill counts for /checkout (counts only) ───────────
create or replace function public.slot_counts()
returns table (pickup_time text, n bigint)
language sql
stable
security definer
set search_path = public
as $$
  select o.pickup_time, count(*)::bigint
  from public.orders o
  where o.created_at >= (date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata')
    and o.status <> 'cancelled'
    and o.pickup_time is not null
  group by o.pickup_time;
$$;

revoke all on function public.slot_counts() from public;
grant execute on function public.slot_counts() to anon, authenticated;

-- 3. Close the public read on orders ──────────────────────────────
-- Customers can still INSERT (checkout doesn't read the row back).
-- The admin keeps full access through "admin full access on orders".
drop policy if exists "anyone can read orders by phone" on public.orders;
revoke select on public.orders from anon;

-- 4. Partner enquiries (/partner form) ─────────────────────────────
create table if not exists public.partner_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 80),
  phone text not null check (phone ~ '^[0-9]{10}$'),
  city text not null check (length(city) between 1 and 80),
  budget text check (length(budget) <= 40),
  why text check (length(why) <= 1000),
  preferred_location text check (length(preferred_location) <= 200),
  message text check (length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);
create index if not exists partner_enquiries_created_at_idx
  on public.partner_enquiries (created_at desc);

alter table public.partner_enquiries enable row level security;

drop policy if exists "anyone can submit a partner enquiry" on public.partner_enquiries;
drop policy if exists "admin full access on partner enquiries" on public.partner_enquiries;

create policy "anyone can submit a partner enquiry" on public.partner_enquiries
  for insert to anon, authenticated with check (status = 'new');

create policy "admin full access on partner enquiries" on public.partner_enquiries
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in')
  with check (auth.jwt() ->> 'email' = 'admin@rollricks.in');

grant insert on public.partner_enquiries to anon, authenticated;
grant select, update, delete on public.partner_enquiries to authenticated;

-- 5. (Optional, test first) re-enable RLS on event_enquiries ──────
-- RLS was switched off on this table (PLAYBOOK §4), which makes every
-- enquiry's name + phone publicly readable with the anon key. The same
-- insert-only pattern as partner_enquiries above should work. To try:
--   1. Uncomment and run the block below.
--   2. Submit a test enquiry on /events and confirm it appears in
--      Table Editor → event_enquiries.
--   3. If it fails, run:  alter table public.event_enquiries disable row level security;
--
-- alter table public.event_enquiries enable row level security;
-- drop policy if exists "anyone can submit an enquiry" on public.event_enquiries;
-- create policy "anyone can submit an enquiry" on public.event_enquiries
--   for insert to anon, authenticated with check (true);
-- grant insert on public.event_enquiries to anon, authenticated;
-- revoke select on public.event_enquiries from anon;

-- ── Verify (run after) ───────────────────────────────────────────
--   select * from pg_policies where tablename in ('orders','partner_enquiries');
--   -- As anon (curl with the anon key): GET /rest/v1/orders?select=phone
--   -- must now return 401/permission denied or an empty list.
