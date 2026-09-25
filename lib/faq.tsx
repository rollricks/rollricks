import Link from "next/link";
import type { FaqEntry } from "@/components/Faq";
import { BRAND, HOURS, LOCATIONS, addressLine } from "./site";
import { SLOT_CAPACITY } from "./upi";

// Answers describe how the site and cart actually work today
// (pickup slots, UPI flow, tracking). Update alongside lib/site.ts.
const loc = LOCATIONS[0];

export const FAQ: FaqEntry[] = [
  {
    q: "Where is RollRicks?",
    a: (
      <>
        Our cart is in {addressLine(loc)}, every evening.{" "}
        <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
          Open in Maps
        </a>
        , or{" "}
        <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
          WhatsApp us
        </a>{" "}
        for today&apos;s exact spot.
      </>
    ),
  },
  {
    q: "What are the timings?",
    a: `${HOURS.days}, ${HOURS.label} (IST). We're closed on Mondays. The badge at the top of the site shows whether we're open right now.`,
  },
  {
    q: "Can I pre-order?",
    a: (
      <>
        Yes. Add food to your cart, pick a 15-minute pickup slot between 6:00 PM and 11:30 PM and place the order.
        Slots open at least 30 minutes ahead, and each slot takes up to {SLOT_CAPACITY} orders so your food is fresh when
        you arrive. <Link href="/menu/" className="text-gold underline">Start an order</Link>.
      </>
    ),
  },
  {
    q: "Can I pay at the cart?",
    a: "Yes. Choose “Pay at Cart” at checkout and pay when you pick up. Cash or UPI at the cart is fine.",
  },
  {
    q: "Can I pay by UPI online?",
    a: "Yes. Choose “Pay Online” at checkout and we show a UPI QR (and an “Open UPI app” button) with your amount and order ID already filled in. Pay with GPay, PhonePe, Paytm or any UPI app, then tap “I've paid” to confirm on WhatsApp. No extra fees.",
  },
  {
    q: "How do I track my order?",
    a: (
      <>
        Open <Link href="/track/" className="text-gold underline">Track Order</Link> and enter the phone number you
        ordered with. The status updates as we go: received → confirmed → preparing → ready.
      </>
    ),
  },
  {
    q: "Do you take bulk orders?",
    a: (
      <>
        Yes. Office lunches, hostel parties and large pickups. Message us on{" "}
        <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">
          WhatsApp
        </a>{" "}
        with the items, quantity and time.
      </>
    ),
  },
  {
    q: "Do you cater events?",
    a: (
      <>
        Yes. Birthdays, college fests, office parties and private events, with the live RollRicks cart at your venue.
        See packages and per-plate pricing on <Link href="/events/" className="text-gold underline">Events</Link>.
      </>
    ),
  },
  {
    q: "Do you have vegetarian options?",
    a: "Lots. Rolls, Chinese, tandoor, snacks, cutlets, soups and drinks. Veg and non-veg are prepared separately, because your trust matters to us.",
  },
  {
    q: "Do you have non-vegetarian options?",
    a: "Yes. Egg and chicken rolls, chilli chicken, chicken noodles and rice, fried chicken, and chicken tikka from the tandoor.",
  },
  {
    q: "Can I partner with RollRicks?",
    a: (
      <>
        We&apos;re building towards a network of RollRicks carts. If you&apos;d like to be part of it, send us an{" "}
        <Link href="/partner/" className="text-gold underline">enquiry</Link>. Partnership structure, costs and terms are
        discussed one-to-one.
      </>
    ),
  },
];
