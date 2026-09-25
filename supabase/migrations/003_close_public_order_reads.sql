-- ════════════════════════════════════════════════════════════════
--  RollRicks — migration 003: close public order reads (PHASE 2)
--
--  RUN THIS ONLY AFTER the redesign build is uploaded to Hostinger.
--  The redesign reads orders through track_orders() / slot_counts()
--  (added in 002). The OLD site reads the orders table directly, so
--  running this while the old site is live breaks its /track page.
--
--  After this, anonymous visitors cannot read the orders table at all
--  — not even the last 36 hours — and Realtime stops broadcasting
--  order rows to anonymous subscribers. The admin dashboard is
--  unaffected (it signs in and uses "admin full access on orders").
--
--  Supabase dashboard → SQL Editor → paste → Run. Re-runnable.
-- ════════════════════════════════════════════════════════════════

begin;

drop policy if exists "public can read recent orders (interim)" on public.orders;
drop policy if exists "anyone can read orders by phone" on public.orders;
revoke select on public.orders from anon;

commit;

-- Verify: as anon this must now fail with 401 / permission denied:
--   curl "$SUPABASE_URL/rest/v1/orders?select=id" -H "apikey: $ANON_KEY"
-- and /track on the live site must still find your orders by phone.
