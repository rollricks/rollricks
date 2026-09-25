# RollRicks — Street Food Ordering Site

Website for **RollRicks**, a street-food cart in Jabalpur. Customers browse the menu, pre-order for a pickup slot, pay by UPI or at the cart, and track the order. The owner runs everything from `/admin`.

**Live:** [rollricks.in](https://rollricks.in) (Hostinger, static upload) · mirror at rollricks.vercel.app
**Ops runbook:** [PLAYBOOK.md](PLAYBOOK.md)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router, **static export** (`output: "export"`) |
| Language / UI | TypeScript, Tailwind CSS 3 (theme tokens), Framer Motion, lucide-react |
| Backend | Supabase (Postgres + Auth + Realtime), Mumbai region, free tier |
| Payments | Direct UPI deep link / QR per order (no gateway, no fees) |
| Messaging | WhatsApp `wa.me` deep links (free) |

No server runtime: everything in `out/` can be dropped on any static host.

## Pages

| Route | What it does |
|---|---|
| `/` | Hero with live Open/Closed (IST), Today's Hits, Veg/Non-Veg entry, How it works, Our Story ("From code to kathi"), journey, events, partner teaser, camera roll, Find Us, FAQ |
| `/menu` | Veg / Non-Veg / All switch, search, sticky category chips with scrollspy, combos, food cards → bottom sheet (add-ons, quantity) |
| `/checkout` | Cart → details + pickup slot → confirm; saves to Supabase, opens WhatsApp, dynamic UPI QR |
| `/track` | Phone-number lookup, polls every 15s |
| `/events` | Catering packages + enquiry form |
| `/partner` | Partner-with-RollRicks story + enquiry form (no payments, no investment claims) |
| `/admin` | Live orders, status + WhatsApp updates, analytics, menu availability toggles |

## Where things live

```
lib/site.ts            Business facts: hours, locations, WhatsApp, Instagram (used by Find Us, FAQ, schema)
lib/menu-data.ts       Menu items (single source of truth: ids, prices, section, diet, image, add-ons)
lib/combo-data.ts      Combos
lib/faq.tsx            FAQ answers
lib/reviews.ts         Genuine reviews only — section hidden while empty
lib/upi.ts             UPI deep link + slot capacity
lib/slots.ts           Pickup slot counts (slot_counts() RPC)
context/CartContext    Cart (localStorage)
context/UIContext      Cart drawer + item bottom sheet
components/            Nav, Footer, MenuItem (food card), ItemSheet, CartBar, CartDrawer, Seal, VegMark, ThemeToggle, StatusPill…
app/globals.css        Light ("menu card") + dark ("cart at night") colour tokens
supabase/schema.sql    Base schema
supabase/migrations/   002 = order privacy + partner_enquiries (run at deploy — see PLAYBOOK)
scripts/import-brand-assets.mjs   Rebuilds public/ images from E:\Personal (brand + Zomato shoot)
```

## Brand

- Fonts: Playfair Display (headings / wordmark), DM Sans (body), Caveat (handwritten accents), DM Mono (order IDs)
- Colours: brand kit gold `#C8922A`, brown `#5C2A0E` / `#3D1A05`, cream `#FFF8EE`, parchment `#F5EAD4`; night `#0E0803` with gold `#F2C14E`
- Theme follows the phone's light/dark setting; the ☀/🌙 toggle overrides and is remembered. `/admin` is always dark.
- Photos are RollRicks' own (Zomato shoot + cart creatives). Dishes without a photo show a branded tile, never stock.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # → out/  (upload its contents to Hostinger public_html)
```

`.env.local` (not in git):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://rollricks.in
```

## Editing content

- **Menu:** edit `lib/menu-data.ts`. Keep `id`s stable — admin availability and carts key on them. `section` drives the category chips; `type` drives Veg/Non-Veg; `addons` shows "Make it extra" in the sheet.
- **Hours / locations:** `lib/site.ts`. Add a location object and Find Us, footer, FAQ and schema all update.
- **Reviews:** paste genuine reviews into `lib/reviews.ts`.

Private project. All rights reserved.
