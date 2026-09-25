// ───────────────────────────────────────────────────────────
//  Single source of truth for RollRicks business facts.
//  Everything here is shown publicly (site copy, FAQ, JSON-LD
//  schema), so keep it factual — no invented ratings or locations.
// ───────────────────────────────────────────────────────────

import { WHATSAPP_NUMBER } from "./whatsapp";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rollricks.in";

export const BRAND = {
  name: "RollRicks",
  tagline: "Jo Dil Se Banata Hai, Vo Dil Tak Jaata Hai",
  seal: "Sealed with Taste",
  instagram: "rollricks",
  instagramUrl: "https://instagram.com/rollricks",
  whatsapp: WHATSAPP_NUMBER,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  phoneDisplay: `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`,
} as const;

// Opening hours in IST, minutes since midnight. Pickup slots on
// /checkout use the same window (6:00 PM – 11:30 PM).
export const HOURS = {
  open: 18 * 60, // 6:00 PM
  close: 23 * 60 + 30, // 11:30 PM
  label: "6:00 PM – 11:30 PM",
  days: "Every evening",
} as const;

export type CartLocation = {
  id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  country: string;
  mapsUrl: string;
  mapsEmbed: string;
};

// Taken from the RollRicks menu creatives. Add more carts here and the
// Find Us section, FAQ and schema all pick them up — only list real,
// operating carts.
const LOCATION_QUERY = "Johnson Kanya Prathmik Shala, Ratan Colony, Gorakhpur, Jabalpur";

export const LOCATIONS: CartLocation[] = [
  {
    id: "gorakhpur",
    name: "RollRicks — Gorakhpur",
    line1: "Near Johnson Kanya Prathmik Shala",
    line2: "Ratan Colony, Gorakhpur",
    city: "Jabalpur",
    region: "Madhya Pradesh",
    country: "IN",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION_QUERY)}`,
    mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(LOCATION_QUERY)}&output=embed`,
  },
  // Outlets named on the June 2026 banners. Uncomment once confirmed
  // operating — Find Us, the footer and FAQ list every entry here.
  // {
  //   id: "katanga",
  //   name: "RollRicks — Katanga",
  //   line1: "Food cart",
  //   line2: "Katanga",
  //   city: "Jabalpur",
  //   region: "Madhya Pradesh",
  //   country: "IN",
  //   mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Katanga, Jabalpur")}`,
  //   mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent("Katanga, Jabalpur")}&output=embed`,
  // },
  // {
  //   id: "south-avenue",
  //   name: "RollRicks — South Avenue Mall",
  //   line1: "Food Court, South Avenue Mall",
  //   line2: "South Avenue Mall",
  //   city: "Jabalpur",
  //   region: "Madhya Pradesh",
  //   country: "IN",
  //   mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("South Avenue Mall, Jabalpur")}`,
  //   mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent("South Avenue Mall, Jabalpur")}&output=embed`,
  // },
];

// ── Open / closed (always computed in IST, never hardcoded) ──

function istMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

export type OpenStatus = {
  open: boolean;
  closingSoon: boolean;
  label: string; // "Open now" / "Closed"
  detail: string; // "Till 11:30 PM" / "Opens at 6:00 PM"
};

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const t = istMinutes(now);
  const open = t >= HOURS.open && t < HOURS.close;
  if (open) {
    const closingSoon = HOURS.close - t <= 30;
    return {
      open,
      closingSoon,
      label: closingSoon ? "Closing soon" : "Open now",
      detail: "Till 11:30 PM",
    };
  }
  return {
    open,
    closingSoon: false,
    label: "Closed",
    detail: t < HOURS.open ? "Opens at 6:00 PM" : "Opens tomorrow, 6:00 PM",
  };
}
