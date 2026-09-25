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
  instagram: "rollricks.in",
  instagramUrl: "https://www.instagram.com/rollricks.in/",
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
  area: string; // neighbourhood, e.g. "Katanga"
  city: string;
  region: string;
  country: string;
  note?: string; // e.g. the cart is mobile — ask for the exact spot
  mapsUrl: string;
  mapsEmbed: string;
};

// Only real, operating carts. Add an entry here and Find Us, the
// footer, FAQ and the Restaurant schema all pick it up.
const KATANGA_QUERY = "Katanga, Jabalpur, Madhya Pradesh";

export const LOCATIONS: CartLocation[] = [
  {
    id: "katanga",
    name: "RollRicks — Katanga",
    area: "Katanga",
    city: "Jabalpur",
    region: "Madhya Pradesh",
    country: "IN",
    note: "Our e-rickshaw cart parks in Katanga every evening. WhatsApp us for today's exact spot.",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(KATANGA_QUERY)}`,
    mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(KATANGA_QUERY)}&output=embed`,
  },
];

/** "Katanga, Jabalpur" */
export function addressLine(l: CartLocation): string {
  return `${l.area}, ${l.city}`;
}

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
