export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918918791675";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rollricks.vercel.app";

export type OrderDetails = {
  orderId: string;
  name: string;
  phone: string;
  pickupTime: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
};

export type EventEnquiry = {
  name: string;
  eventType: string;
  date: string;
  guests: number;
  phone: string;
  notes?: string;
};

export function generateOrderWhatsApp(order: OrderDetails): string {
  const itemLines = order.items
    .map((item) => `• ${item.name} x${item.quantity} — ₹${item.price}`)
    .join("\n");

  const message = `Hi RollRicks! 🔥
Order ID: #${order.orderId}
Name: ${order.name}
Phone: ${order.phone}
Pickup: ${order.pickupTime}
Items:
${itemLines}
Total: ₹${order.total}
Payment: ${order.paymentMethod}

Track your order here: ${SITE_URL}/track`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateEventWhatsApp(event: EventEnquiry): string {
  const message = `Hi! I want to book RollRicks for an event 🎉
Name: ${event.name}
Event: ${event.eventType}
Date: ${event.date}
Guests: ${event.guests}
Phone: ${event.phone}
Notes: ${event.notes || "—"}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generatePaymentWhatsApp(order: OrderDetails): string {
  const itemLines = order.items
    .map((item) => `• ${item.name} x${item.quantity} — ₹${item.price}`)
    .join("\n");

  const message = `Hi RollRicks! 🔥
I've completed the UPI payment for my order.

Order ID: #${order.orderId}
Name: ${order.name}
Phone: ${order.phone}
Pickup: ${order.pickupTime}
Items:
${itemLines}
Total Paid: ₹${order.total}
Payment: UPI (Online)

Track your order: ${SITE_URL}/track

Please confirm my order. Thank you! 🙏`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateStatusWhatsApp(
  orderId: string,
  status: string,
  customerName: string,
  customerPhone: string
): string {
  let message: string;

  if (status === "Confirmed") {
    message = `Hi ${customerName}! 👋
Great news! Your RollRicks order #${orderId} has been *confirmed* ✅

We're getting it ready for you!
Track your order live: ${SITE_URL}/track

— Team RollRicks 🔥`;
  } else if (status === "Ready for Pickup") {
    message = `Hi ${customerName}! 🛎️
Your RollRicks order #${orderId} is *READY for pickup*! 🎉

Come grab it while it's hot! 🔥
Track: ${SITE_URL}/track

— Team RollRicks`;
  } else if (status === "Done") {
    message = `Hi ${customerName}! 🙏
Thank you for ordering from RollRicks! ❤️

We hope you loved your food. See you again soon! 🔥

Order next time: ${SITE_URL}/menu`;
  } else {
    message = `Hi ${customerName}! 👋
Your RollRicks order #${orderId} update:
Status: ${status}

Track your order: ${SITE_URL}/track

— Team RollRicks 🔥`;
  }

  return `https://wa.me/91${customerPhone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(message)}`;
}
