-- ════════════════════════════════════════════════════════════════
--  RollRicks — migration 002: security hardening (PHASE 1)
--  Applied 2026-09-25. Safe with BOTH the old live site and the
--  redesign build. Re-runnable.
--
--  Audit findings this fixes:
--   • orders: public SELECT USING (true) → anyone with the anon key
--     (it ships in the site JS) could list every customer's name,
--     phone and order, and watch new orders live over Realtime.
--   • event_enquiries: RLS DISABLED and anon had SELECT/UPDATE/DELETE
--     → anyone could read, edit or wipe every enquiry.
--   • anon/authenticated held TRUNCATE/REFERENCES/TRIGGER and anon held
--     UPDATE/DELETE on every table (RLS blocked most of it, but a
--     single policy mistake would have exposed everything).
--   • No validation / rate limits → a script could flood fake orders,
--     fill every pickup slot (4 per slot) and block real customers.
--
--  PHASE 2 (migrations/003_close_public_order_reads.sql) removes the
--  interim 36-hour public read once the redesign build is live.
-- ════════════════════════════════════════════════════════════════

begin;

-- ── 1. Least-privilege grants ────────────────────────────────────
revoke truncate, references, trigger
  on public.orders, public.menu_config, public.event_enquiries
  from anon, authenticated;

-- Customers only ever INSERT orders; menu_config is admin-only.
revoke update, delete on public.orders from anon;
revoke insert, update, delete on public.menu_config from anon;

-- ── 2. event_enquiries: RLS on, insert-only for the public ───────
alter table public.event_enquiries enable row level security;
revoke select, update, delete on public.event_enquiries from anon;
grant insert on public.event_enquiries to anon, authenticated;

drop policy if exists "anyone can submit an enquiry" on public.event_enquiries;
create policy "anyone can submit an enquiry" on public.event_enquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "admin can read enquiries" on public.event_enquiries;
drop policy if exists "admin full access on event enquiries" on public.event_enquiries;
create policy "admin full access on event enquiries" on public.event_enquiries
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in')
  with check (auth.jwt() ->> 'email' = 'admin@rollricks.in');

-- ── 3. orders: interim public read limited to the last 36 hours ──
-- The OLD live site reads orders directly for /track and slot counts.
-- Limiting that read to recent orders keeps it working while hiding
-- all order history. Phase 2 removes it entirely.
drop policy if exists "anyone can read orders by phone" on public.orders;
drop policy if exists "public can read recent orders (interim)" on public.orders;
create policy "public can read recent orders (interim)" on public.orders
  for select to anon, authenticated
  using (created_at > now() - interval '36 hours');

-- ── 4. Narrow read functions used by the redesign build ──────────
create or replace function public.track_orders(p_phone text)
returns table (
  id uuid, order_id text, items jsonb, total numeric, pickup_time text,
  payment_method text, status text, created_at timestamptz
)
language sql stable security definer set search_path = public
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

create or replace function public.slot_counts()
returns table (pickup_time text, n bigint)
language sql stable security definer set search_path = public
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

-- ── 5. partner_enquiries (/partner form) ─────────────────────────
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
create index if not exists partner_enquiries_created_at_idx on public.partner_enquiries (created_at desc);
alter table public.partner_enquiries enable row level security;
revoke all on public.partner_enquiries from anon, authenticated;
grant insert on public.partner_enquiries to anon, authenticated;
grant select, update, delete on public.partner_enquiries to authenticated;

drop policy if exists "anyone can submit a partner enquiry" on public.partner_enquiries;
create policy "anyone can submit a partner enquiry" on public.partner_enquiries
  for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin full access on partner enquiries" on public.partner_enquiries;
create policy "admin full access on partner enquiries" on public.partner_enquiries
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'admin@rollricks.in')
  with check (auth.jwt() ->> 'email' = 'admin@rollricks.in');

-- ── 6. Anti-abuse guards (public inserts only) ───────────────────
-- Validate shape and rate-limit so nobody can script junk orders or
-- fill every pickup slot. Inserts by the dashboard / service role
-- (auth.role() not anon/authenticated) are not checked.

create or replace function public.guard_order_insert()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  it jsonb;
  line_sum numeric := 0;
begin
  if coalesce(auth.role(), '') not in ('anon', 'authenticated') then
    return new;
  end if;

  if new.phone !~ '^[0-9]{10}$' then
    raise exception 'invalid phone' using errcode = '22023';
  end if;
  if length(trim(new.customer_name)) < 1 or length(new.customer_name) > 60 then
    raise exception 'invalid name' using errcode = '22023';
  end if;
  if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) < 1 or jsonb_array_length(new.items) > 30 then
    raise exception 'invalid items' using errcode = '22023';
  end if;
  for it in select * from jsonb_array_elements(new.items) loop
    if jsonb_typeof(it->'name') <> 'string' or length(it->>'name') > 120
       or jsonb_typeof(it->'quantity') <> 'number' or (it->>'quantity')::numeric not between 1 and 50
       or jsonb_typeof(it->'price') <> 'number' or (it->>'price')::numeric < 0 then
      raise exception 'invalid item' using errcode = '22023';
    end if;
    line_sum := line_sum + (it->>'price')::numeric;
  end loop;
  -- item "price" is the line total (unit × qty); they must add up.
  if line_sum <> new.total then
    raise exception 'total mismatch' using errcode = '22023';
  end if;
  if new.pickup_time is not null and new.pickup_time !~ '^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$' then
    raise exception 'invalid pickup time' using errcode = '22023';
  end if;
  if new.payment_method is not null and new.payment_method not in ('Pay at Cart', 'Pay Online — UPI via WhatsApp') then
    raise exception 'invalid payment method' using errcode = '22023';
  end if;
  if new.idempotency_key is not null and length(new.idempotency_key) > 40 then
    raise exception 'invalid key' using errcode = '22023';
  end if;

  -- Rate limits: 5 orders per phone per hour, 30 orders site-wide per 10 min.
  if (select count(*) from public.orders where phone = new.phone and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many orders from this number, please WhatsApp us' using errcode = 'P0429';
  end if;
  if (select count(*) from public.orders where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'we are very busy, please WhatsApp us' using errcode = 'P0429';
  end if;

  new.status := 'new';
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists guard_order_insert on public.orders;
create trigger guard_order_insert before insert on public.orders
  for each row execute function public.guard_order_insert();

create or replace function public.guard_enquiry_insert()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  n int;
begin
  if coalesce(auth.role(), '') not in ('anon', 'authenticated') then
    return new;
  end if;
  if new.phone !~ '^[0-9]{10}$' then
    raise exception 'invalid phone' using errcode = '22023';
  end if;
  if length(trim(new.name)) < 1 or length(new.name) > 80 then
    raise exception 'invalid name' using errcode = '22023';
  end if;
  -- Fields are resolved at runtime, so this branch is safe on
  -- partner_enquiries (which has no notes/package/guests columns).
  if tg_table_name = 'event_enquiries' then
    if length(coalesce(new.notes, '')) > 1000 or length(coalesce(new.package, '')) > 80
       or coalesce(new.guests, 0) not between 0 and 5000 then
      raise exception 'invalid enquiry' using errcode = '22023';
    end if;
  end if;

  -- Rate limits per table: 5 per phone per hour, 30 site-wide per 10 min.
  execute format('select count(*) from public.%I where phone = $1 and created_at > now() - interval ''1 hour''', tg_table_name)
    into n using new.phone;
  if n >= 5 then
    raise exception 'too many enquiries from this number, please WhatsApp us' using errcode = 'P0429';
  end if;
  execute format('select count(*) from public.%I where created_at > now() - interval ''10 minutes''', tg_table_name)
    into n;
  if n >= 30 then
    raise exception 'too many enquiries right now, please WhatsApp us' using errcode = 'P0429';
  end if;

  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists guard_enquiry_insert on public.event_enquiries;
create trigger guard_enquiry_insert before insert on public.event_enquiries
  for each row execute function public.guard_enquiry_insert();

drop trigger if exists guard_enquiry_insert on public.partner_enquiries;
create trigger guard_enquiry_insert before insert on public.partner_enquiries
  for each row execute function public.guard_enquiry_insert();

-- Trigger functions are not meant to be called directly.
revoke all on function public.guard_order_insert() from public, anon, authenticated;
revoke all on function public.guard_enquiry_insert() from public, anon, authenticated;

commit;
