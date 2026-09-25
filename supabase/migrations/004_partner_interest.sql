-- ════════════════════════════════════════════════════════════════
--  RollRicks — migration 004: what a partner enquiry is about
--  Applied 2026-09-25. Additive only; safe with old and new site.
--
--  /partner now offers two paths:
--    • "own-cart"   — run your own RollRicks cart, we set it up
--    • "idea-check" — honest advice on your own food-business idea
--    • "exploring"  — just curious
-- ════════════════════════════════════════════════════════════════

begin;

alter table public.partner_enquiries
  add column if not exists interest text;

alter table public.partner_enquiries
  drop constraint if exists partner_enquiries_interest_check;
alter table public.partner_enquiries
  add constraint partner_enquiries_interest_check
  check (interest is null or interest in ('own-cart', 'idea-check', 'exploring'));

commit;
