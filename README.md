# RollRicks - Street Food Ordering Platform

A full-stack food ordering website for **RollRicks**, a street food cart in Jabalpur, India. Customers can browse the menu, place orders, pay via UPI, and track orders in real-time. Admins manage orders, analytics, and menu availability from a dedicated dashboard.

**Live:** [rollricks.vercel.app](https://rollricks.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Anonymous + Email/Password) |
| Messaging | WhatsApp (URL scheme API) |
| State | React Context API + localStorage |
| Deployment | Vercel |

---

## Project Structure

```
rollricks/
├── app/                          # Next.js App Router (pages)
│   ├── layout.tsx                # Root layout - fonts, providers, nav
│   ├── globals.css               # Global styles, CSS variables, animations
│   ├── page.tsx                  # Home page (/)
│   ├── menu/page.tsx             # Menu with category tabs (/menu)
│   ├── checkout/page.tsx         # 3-step checkout flow (/checkout)
│   ├── admin/page.tsx            # Admin dashboard (/admin)
│   ├── events/page.tsx           # Event booking + packages (/events)
│   └── track/page.tsx            # Real-time order tracking (/track)
│
├── components/                   # Reusable UI components
│   ├── Nav.tsx                   # Header with mobile menu + cart icon
│   ├── CartDrawer.tsx            # Slide-out cart sidebar
│   ├── ComboCard.tsx             # Combo deal card
│   ├── MenuItem.tsx              # Menu item with add-to-cart controls
│   ├── OrderCard.tsx             # Admin order card with status actions
│   ├── TrackStatus.tsx           # Visual order progress tracker
│   └── WhatsAppBtn.tsx           # Floating WhatsApp button
│
├── context/
│   └── CartContext.tsx            # Cart state (useReducer + localStorage)
│
├── lib/                          # Utilities & data
│   ├── firebase.ts               # Firebase app init (Firestore + Auth)
│   ├── whatsapp.ts               # WhatsApp message generators
│   ├── menu-data.ts              # Menu items & categories
│   └── combo-data.ts             # Combo packages with pricing
│
├── public/
│   └── qr-payment.png            # UPI payment QR code
│
├── .env.local                    # Environment variables (not in git)
├── tailwind.config.ts            # Tailwind theme & custom fonts
├── next.config.mjs               # Next.js config
├── tsconfig.json                 # TypeScript config (@ path alias)
└── package.json                  # Dependencies & scripts
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, featured combos, features, events teaser |
| `/menu` | Menu | Tabbed menu (Combos, Veg, Non-Veg, Drinks, Desserts) with real-time availability |
| `/checkout` | Checkout | 3-step flow: Cart Review → Customer Details → Confirm & Pay |
| `/admin` | Admin | Login-protected dashboard with live orders, analytics, menu control |
| `/events` | Events | Catering packages (Basic/Standard/Premium), add-ons, booking form |
| `/track` | Track | Enter phone number → see all orders with live status updates |

---

## Key Features

### Customer Side
- **Menu browsing** with veg/non-veg indicators and category tabs
- **Cart** persisted in localStorage, accessible from any page
- **Pickup time slots** from 6:00 PM to 11:30 PM (15-min intervals)
- **Payment options**: Pay at Cart or Pay Online (UPI via QR code)
- **WhatsApp order confirmation** sent automatically
- **Real-time order tracking** by phone number

### Admin Dashboard (`/admin`)
- **Live Orders**: Real-time feed with status management
  - Status flow: `New → Confirmed → Preparing → Ready → Done`
  - Sound notification on new orders
  - WhatsApp status updates sent to customers
- **Analytics**: Today's stats, top sellers, payment breakdown, hourly chart
- **Menu Control**: Toggle item availability (syncs to customer menu in real-time)

---

## Firebase Structure

### Firestore Collections

**`orders`**
```
{
  orderId: "RR1A2B3C",        // Generated ID
  customerName: "John",
  phone: "9876543210",
  items: [{ name, quantity, price }],
  total: 250,
  pickupTime: "7:30 PM",
  paymentMethod: "Pay at Cart",
  status: "new",               // new | confirmed | preparing | ready | done
  createdAt: Timestamp
}
```

**`menu_config`**
```
// Document ID = menu item ID
{ available: true/false }
```

**`event_enquiries`**
```
{
  name: "John",
  phone: "9876543210",
  eventType: "Birthday",
  eventDate: "2026-04-15",
  guestCount: 50,
  notes: "...",
  createdAt: Timestamp
}
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /menu_config/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /event_enquiries/{docId} {
      allow create: if request.auth != null;
    }
  }
}
```

### Firebase Auth Setup
- **Anonymous Auth** must be enabled (used by customers for Firestore writes and admin env-var fallback login)
- **Email/Password Auth** can optionally be used for admin login

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase Config (get from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Login Credentials
NEXT_PUBLIC_ADMIN_ID=your_admin_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password

# WhatsApp Business Number (with country code, no +)
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Firestore + Authentication enabled

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/rollricks/rollricks.git
cd rollricks

# 2. Install dependencies
npm install

# 3. Create .env.local with your Firebase credentials (see above)

# 4. Firebase Console setup:
#    - Enable Anonymous sign-in (Authentication → Sign-in method)
#    - Create Firestore database
#    - Set security rules (see Firebase section above)

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
# Production build
npm run build

# Start production server locally
npm start
```

For Vercel deployment, push to the connected GitHub repo — Vercel auto-deploys on every push to `master`.

---

## Design System

### Fonts
| Font | CSS Class | Usage |
|------|-----------|-------|
| Bebas Neue | `font-display` | Headings, display text, prices |
| DM Sans | `font-body` | Body text, labels, descriptions |
| DM Mono | `font-mono` | Order IDs, phone numbers, prices |

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Yellow | `#FFD600` | Primary CTA, brand accent, headings |
| Red | `#E53935` | Non-veg indicator, errors, alerts |
| Green | `#22C55E` | Veg indicator, success, "open" status |
| Blue | `#3B82F6` | Drinks category, info |
| Purple | `#8B5CF6` | Desserts category, "preparing" status |
| Black | `#09090b` | Background |
| Dark Gray | `#111` / `#18181b` / `#27272a` | Cards, inputs, borders |
| Muted | `#71717a` | Secondary text |
| Light | `#e4e4e7` | Primary text |

### Order Status Colors
| Status | Color | Hex |
|--------|-------|-----|
| New | Yellow | `#FFD600` |
| Confirmed | Blue | `#3B82F6` |
| Preparing | Purple | `#8B5CF6` |
| Ready | Green | `#22C55E` |
| Done | Gray | `#71717a` |

---

## How Things Work

### Order Flow
1. Customer adds items to cart (stored in localStorage via CartContext)
2. Goes to `/checkout` → fills name, phone, pickup time, payment method
3. Order saved to Firestore `orders` collection with status `"new"`
4. WhatsApp message sent to RollRicks number with order details
5. If UPI payment: QR code shown → customer pays → confirms via WhatsApp
6. Admin sees order in real-time on `/admin` dashboard
7. Admin updates status → WhatsApp notification sent to customer
8. Customer tracks status on `/track` page (real-time updates)

### Menu Availability
1. Admin toggles items on/off in Menu Control section
2. Toggle state saved to Firestore `menu_config` collection
3. Customer menu page listens in real-time via `onSnapshot`
4. Toggled-off items show as "Unavailable" and can't be added to cart

### Authentication
- **Customers**: Sign in anonymously (auto, transparent) for Firestore access
- **Admin**: Tries Firebase email/password auth first, falls back to env-var credentials with anonymous auth for Firestore context

---

## Modifying the Menu

### Adding/Editing Menu Items
Edit `lib/menu-data.ts`:
```typescript
{
  id: "unique-item-id",        // Must be unique
  name: "Item Name",
  description: "Short description",
  price: 120,
  category: "Category Name",
  type: "veg",                 // "veg" or "nonveg"
  badge: "New",                // Optional badge text
  available: true,
}
```

### Adding/Editing Combos
Edit `lib/combo-data.ts`:
```typescript
{
  id: "combo-id",
  name: "COMBO NAME",
  tag: "Bestseller",
  tagline: "Description line",
  items: [
    { name: "Item 1", price: 120 },
    { name: "Item 2", price: 80 },
  ],
  price: 170,                  // Combo price
  originalPrice: 200,          // Strikethrough price
  savings: 30,                 // originalPrice - price
  type: "veg",                 // "veg" | "nonveg" | "both"
  featured: true,              // Show on home page
}
```

### Updating Event Packages
Edit the `packages` array in `app/events/page.tsx`.

### Changing the UPI QR Code
Replace `public/qr-payment.png` with your new QR code image.

### Changing the WhatsApp Number
Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## License

Private project. All rights reserved.
