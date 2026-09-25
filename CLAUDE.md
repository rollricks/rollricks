# RollRicks — project context

Read this first. It is the single source of context for anyone (human or AI) picking up this repo.
Last updated: **2026-09-25** (brand-v2 redesign went live on rollricks.in this day).

---

## 1. The business

- **RollRicks** — street-food cart ("The Tasty Street Cart") in **Katanga, Jabalpur, Madhya Pradesh**. One operating cart (an e-rickshaw cart; it can move, so the site tells people to WhatsApp for the exact spot).
- Owner runs it himself (DevOps engineer by day → the "From code to kathi" story). Tech-savvy, mobile-first, manages orders from his phone at the cart.
- **Hours:** Tuesday–Sunday, 6:00 PM – 11:30 PM IST. **Closed Mondays.**
- **WhatsApp (orders + all site links):** +91 78286 51578 · **Instagram:** @rollricks.in · **Domain:** rollricks.in
- **UPI payee:** `8918791675@pthdfc` (owner's own account — direct UPI, no gateway).
- Brand line: *"Jo Dil Se Banata Hai, Vo Dil Tak Jaata Hai."* · Seal: *"Sealed with Taste"* · Sign-off: *"Roll. Eat. Repeat."*
- Veg and non-veg are prepared separately (stated publicly).
- **Money rules (important):** Udyam-registered MSME, **no GST** (under threshold), strong dislike of recurring fees / per-transaction deductions. Default every suggestion to the **free** option; only propose paid services (gateways, WhatsApp API, SaaS) if asked, with the cost stated.
- Also listed on Google Maps as "RollRicks" — ⚠️ that listing's address still says *Johnson Kanya Prathmik Shala, Ratan Colony, Gorakhpur*; owner should move it to Katanga in Google Business Profile. The site links to the listing by CID, so it follows automatically.
- Brand assets / raw photos / videos live on the owner's PC in `E:\Personal` (creatives `1.png` hero, `2.png` Our Story, `3.png` Non-Veg menu; `cropped_circle_image.png` = seal; `Images\Zomato\` = food shoot; `WhatsApp Video 2026-09-25 …` = real cart clips). **That folder also holds unrelated personal files — only touch RollRicks material.**

## 2. Tech stack

| | |
|---|---|
| Framework | Next.js 14 App Router, **static export** (`output: "export"`, `trailingSlash: true`) — no server at runtime |
| UI | TypeScript, Tailwind 3 with **CSS-variable theme tokens**, Framer Motion, lucide-react |
| Backend | **Supabase** project `yqmfygasjqebdgbxsaoi` (Mumbai, ap-south-1), free tier: Postgres + Auth + Realtime |
| Hosting | **Hostinger shared hosting** (LiteSpeed). Manual upload of `out/` into `public_html`. **Not** auto-deployed from git. |
| Payments | Per-order UPI deep link + QR (order ID in the UPI note) — `lib/upi.ts` |
| Messaging | Free `wa.me` WhatsApp deep links — `lib/whatsapp.ts` |
| Vercel | Repo is connected, but **Vercel builds have been failing since before the redesign** (even old `master`). rollricks.vercel.app is stale. Not investigated (needs `vercel login`). |

Fonts: **Playfair Display** (display/wordmark), **DM Sans** (body), **Caveat** (handwritten accents), DM Mono (order IDs).
Colours (brand kit): gold `#C8922A`, browns `#5C2A0E` / `#3D1A05`, cream `#FFF8EE`, parchment `#F5EAD4`; night theme base `#0E0803`, gold `#F2C14E`.

## 3. Pages

| Route | What |
|---|---|
| `/` | Video hero (real cart at night) + live IST open/closed, brand ribbon, Today's Hits, Veg/Non-Veg entry, How it works (+ handover video), Our Story "From code to kathi" (polaroid collage, prep video, journey), events, partner teaser, camera roll, Find Us (Google Maps listing), FAQ |
| `/menu` | Veg / Non-Veg / All switch, search, sticky category chips with scrollspy, combos swipe row, food cards → bottom sheet (add-ons, quantity). Deep links: `/menu/?diet=veg`, `/menu/?section=Tandoor` |
| `/checkout` | Cart → details + IST pickup slot (15-min, 30-min lead, 4 per slot, none on Mondays) → confirm; saves order, opens WhatsApp, dynamic UPI QR |
| `/track` | Phone lookup via `track_orders()` RPC, polls every 15 s |
| `/events` | Catering packages (per-plate pricing) + enquiry form |
| `/partner` | Two paths: **Own a RollRicks cart** (partner invests in and runs their own cart; RollRicks handles setup, brand, menu, training, suppliers, tech, marketing) and **Food business idea check** (honest advice). Enquiry form → `partner_enquiries` + WhatsApp. **Enquiry only — never collect money, never promise returns/ROI.** |
| `/admin` | Supabase email/password login (`admin@rollricks.in`). Live orders + sound + WhatsApp status updates, analytics, menu availability toggles, **Enquiries & Data** tab (partner/event enquiries + CSV export). Always dark. |

## 4. Where things live

```
lib/site.ts            Business facts: hours (+closedDays), location, Google Maps CID, WhatsApp, Instagram, IST open/closed logic
lib/menu-data.ts       Menu = single source of truth (stable ids used by admin availability + carts; section; type veg/nonveg; image; addons)
lib/combo-data.ts      Combos
lib/faq.tsx            FAQ answers (keep in sync with real rules)
lib/reviews.ts         GENUINE reviews only — section hidden while empty. Never invent reviews.
lib/slots.ts / upi.ts  Slot counts (RPC) / UPI link + SLOT_CAPACITY
lib/useMenuAvailability.ts   menu_config (admin toggles) over Realtime
context/CartContext    Cart (localStorage "rollricks-cart"; add-ons become "itemId+addon" lines)
context/UIContext      Cart drawer + item bottom sheet
components/            Nav, Footer, MenuItem (food card), ItemSheet, CartBar, CartDrawer, LoopVideo, BrandRibbon, Seal, VegMark, ThemeToggle, StatusPill, AdminData…
app/globals.css        Light ("menu card") + dark ("cart at night") tokens, grain, brush/polaroid/torn styles, marquee
public/.htaccess       HTTPS, HSTS, CSP, Permissions-Policy, caching, MIME — copied into out/ on build
public/videos/         hero-cart / prep / handover (.mp4 + .webm + -poster.webp), 720x1280, CRF 22
supabase/schema.sql    Base schema (no public read of orders)
supabase/migrations/   002 hardening · 003 close public order reads · 004 partner interest — ALL APPLIED
scripts/import-brand-assets.mjs   Rebuilds public/ images from E:\Personal
scripts/csp-test-server.mjs       Serves out/ with the production CSP on :3006 for testing
PLAYBOOK.md            Ops runbook (deploy, SQL, troubleshooting)
```

## 5. Security model (audited + hardened 2026-09-25)

- RLS **on** for every table. The public (anon) key — which ships in the site JS by design — can only:
  - `INSERT` into `orders`, `event_enquiries`, `partner_enquiries`
  - `SELECT` `menu_config`
  - call `track_orders(phone)` (that phone's last 30 days, **no names/phones returned**) and `slot_counts()` (counts only)
- **No public read of `orders`** (migration 003). Admin (`auth.jwt()->>'email' = 'admin@rollricks.in'`) has full access; changing the admin email means updating the policies.
- Insert guard triggers: phone must be 10 digits, name/items/total/slot/payment validated, **total must equal the sum of line prices**, rate limits **5/phone/hour** and **30 site-wide/10 min** (same for enquiries). Status is forced to `new`.
- `.htaccess`: HSTS, CSP (`self` + `*.supabase.co` + Google Maps frame), Permissions-Policy, nosniff, SAMEORIGIN.
- Git history scanned: no secrets ever committed. `.env.local`, `.supabase-db-pass.txt` are gitignored — **never commit them**.
- **Owner to-dos:** turn off public sign-ups (Supabase → Authentication → Email → "Allow new users to sign up" off); revoke the GitHub PAT that was pasted in chat on 2026-09-25; fix the Google Maps address.
- Pre-hardening data backup: `E:\Roll\db-backups\2026-09-25-before-hardening\` (CSV per table + policies/grants).

## 6. Data (as of 2026-09-25)

- `orders` ≈ 12 rows (real customers + owner's own tests under "Dipanjan"). 3 junk rows (Cdeececrgr, UuFtyiciyid, Dft) deleted on request; they remain in the backup CSV.
- `event_enquiries`, `partner_enquiries`: empty. `menu_config`: 1 row.
- Owner can export everything as CSV from /admin → Enquiries & Data.

## 7. Menu decisions (from the owner)

- Repo ids/names are kept stable. Paneer Achari Roll = **₹140** (id `v-roll-achari`).
- Added from the menu creative: Peanut Masala ₹99, Crispy Corn ₹79, Crispy Veg Cutlet ₹79, Crispy Paneer Cutlet ₹99, Hot & Sour Soup ₹79, Manchow Soup ₹79, Chinese add-ons (+Paneer ₹30, +Manchurian ₹20 on Hakka Noodles and Veg Fried Rice).
- Badges ("Best Seller", "Most Ordered"…) are the owner's existing labels — don't invent new ones. No fake stats, ratings or testimonials anywhere (events page stats were replaced with facts).
- Items without a real photo show a branded tile, never stock images.

## 8. Develop, build, deploy

```bash
npm install
NEXT_DIST_DIR=.next-dev npm run dev -- -p 3000   # dev in its own folder so builds don't break it
npm run lint && npx tsc --noEmit
npm run build                                     # → out/   (always the default .next → out/)
node scripts/csp-test-server.mjs                  # optional: test out/ with prod CSP on :3006
```

`.env.local` keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER=917828651578`, `NEXT_PUBLIC_SITE_URL=https://rollricks.in`. They are baked in at build time — rebuild after changing.

**Deploy to Hostinger:** hPanel → File Manager → `domains/rollricks.in/public_html` → upload **the contents of** `out/` (not the folder), including `.htaccess`, `_next`, `videos`. Easiest: drag all items from `E:\Roll\rollricks\out` in, or upload a zip and **Extract into public_html itself**. Never delete `public_html`; if it's gone, re-create a folder with exactly that name. Opening `out/index.html` directly from disk shows an unstyled white page — that's normal (absolute `/_next/` paths); it only works when served.

**After a deploy, check:** every file in `out/` returns 200 live (`.htaccess` returns 403 = correct), place a test order → find it on /track → cancel in /admin.

## 9. Conventions

- Mobile-first (most customers open on phones). Check 360 / 390 / 412 px — no horizontal overflow.
- Keep it static-export compatible: no API routes, no server actions, no Next Image optimisation.
- Colours only via theme tokens (`bg-base`, `bg-card`, `text-ink`, `text-gold`, `bg-accent`, `text-veg`, `text-nonveg`…). Always-dark areas (hero, banners) use `data-theme="dark"`.
- Respect `prefers-reduced-motion`; videos load only when visible and fall back to posters on Data Saver.
- Commits in this repo are authored as `Dipanjan11 <118282072+Dipanjan11@users.noreply.github.com>`.
