export const WHATSAPP_NUMBER = "918918791675";

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
Payment: ${order.paymentMethod}`;

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

Please confirm my order. Thank you! 🙏`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateStatusWhatsApp(
  orderId: string,
  status: string,
  customerName: string
): string {
  const message = `Hi ${customerName}! 👋
Your RollRicks order #${orderId} update:
Status: ${status}

Thanks for ordering with RollRicks! 🔥`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
