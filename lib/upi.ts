// UPI deep-link helpers. The static QR was a black hole for parallel
// payments — two customers paying ₹170 at the same time produced two
// identical UPI SMSes on the merchant phone, with no way to match each
// payment to its order. Embedding the orderId in `tn` (transaction note)
// makes the SMS self-identifying.

export const UPI_VPA = process.env.NEXT_PUBLIC_UPI_VPA || "8918791675@pthdfc";
export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "RollRicks";

export function buildUpiLink(params: {
  amount: number;
  orderId: string;
}): string {
  const { amount, orderId } = params;
  const query = new URLSearchParams({
    pa: UPI_VPA,
    pn: UPI_PAYEE_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `RollRicks ${orderId}`,
  });
  return `upi://pay?${query.toString()}`;
}

// Per-slot kitchen capacity. 4 orders per 15-min slot ≈ what one person
// can realistically prepare without burning rolls. Override via env if
// the cart adds more hands.
export const SLOT_CAPACITY = Number(
  process.env.NEXT_PUBLIC_SLOT_CAPACITY || "4"
);
