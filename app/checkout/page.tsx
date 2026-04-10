"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, Trash2, Check, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { useCart } from "@/context/CartContext";
import { generateOrderWhatsApp, generatePaymentWhatsApp } from "@/lib/whatsapp";
import { buildUpiLink, SLOT_CAPACITY } from "@/lib/upi";

type Step = 1 | 2 | 3;

const stepLabels = ["Cart Review", "Your Details", "Confirm"];

// Collision-safe short ID. crypto.randomUUID gives ~122 bits of
// entropy; we keep the first 6 hex chars after stripping dashes for a
// readable order code (RR + 6 chars = ~16M combinations, plenty for a
// single-cart business). Falls back to Math.random on the rare client
// without crypto.randomUUID.
function generateId(): string {
  let raw: string;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    raw = crypto.randomUUID().replace(/-/g, "");
  } else {
    raw = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  }
  return "RR" + raw.slice(0, 6).toUpperCase();
}

// Minimum lead time in minutes — kitchen needs at least this much
// notice between an order being placed and the customer showing up.
const MIN_LEAD_MINUTES = 30;

function generatePickupSlots(now: Date = new Date()): string[] {
  const slots: string[] = [];
  const cutoff = new Date(now.getTime() + MIN_LEAD_MINUTES * 60 * 1000);
  // Fixed slots from 6:00 PM to 11:30 PM in 15-min intervals
  for (let hour = 18; hour <= 23; hour++) {
    for (const min of [0, 15, 30, 45]) {
      if (hour === 23 && min > 30) break;
      // Build a Date for this slot today and skip if it's already past
      // the lead-time cutoff. Customers can't book a slot the kitchen
      // can't realistically prep for.
      const slotDate = new Date(now);
      slotDate.setHours(hour, min, 0, 0);
      if (slotDate < cutoff) continue;
      const ampm = hour >= 12 ? "PM" : "AM";
      const h = hour % 12 || 12;
      const m = min.toString().padStart(2, "0");
      slots.push(`${h}:${m} ${ampm}`);
    }
  }
  return slots;
}

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay at Cart");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading & success state
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [upiLink, setUpiLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  // Slot fill counts (slot label -> count of non-cancelled orders for today)
  const [slotFill, setSlotFill] = useState<Record<string, number>>({});

  // Idempotency key — one per checkout session, regenerated on success.
  // Survives double-click, browser back+resubmit, network retry within
  // the same component instance.
  const idempotencyKeyRef = useRef<string>("");
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current = generateId();
  }

  // Tick every minute so the slot list drops slots that have just gone
  // past the lead-time cutoff while the customer is on the page.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const pickupSlots = useMemo(() => generatePickupSlots(now), [now]);

  // If the currently-selected slot just expired, clear it so the user
  // notices and re-picks instead of submitting an invalid time.
  useEffect(() => {
    if (pickupTime && !pickupSlots.includes(pickupTime)) {
      setPickupTime("");
    }
  }, [pickupSlots, pickupTime]);

  // Load today's slot fill counts so we can grey out full slots in the
  // dropdown. Best-effort: if Firebase is unreachable, allow all slots
  // and rely on the submit-time recheck.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { collection, query, where, getDocs, limit, Timestamp } =
          await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const q = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
          limit(20)
        );
        const snap = await getDocs(q);
        const counts: Record<string, number> = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.status === "cancelled") return;
          const slot = data.pickupTime;
          if (typeof slot === "string") counts[slot] = (counts[slot] || 0) + 1;
        });
        if (!cancelled) setSlotFill(counts);
      } catch {
        // ignore — submit-time check is the real guard
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    if (!pickupTime) newErrors.pickupTime = "Select a pickup time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (placing) return;
    setPlacing(true);

    try {
      const id = generateId();
      setOrderId(id);

      const orderItems = items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity,
      }));

      const orderDetails = {
        orderId: id,
        name: name.trim(),
        phone: phone.trim(),
        pickupTime,
        items: orderItems,
        total: totalPrice,
        paymentMethod,
      };

      // Save to Firebase with a submit-time slot recheck and an
      // idempotency guard. The idempotency guard catches the race where
      // two requests fire from the same checkout session (double-tap,
      // network retry) by aborting if a doc with the same key already
      // exists.
      try {
        const {
          collection,
          addDoc,
          serverTimestamp,
          query,
          where,
          getDocs,
          limit,
          Timestamp,
        } = await import("firebase/firestore");
        const { db, auth } = await import("@/lib/firebase");
        const { signInAnonymously } = await import("firebase/auth");

        // Ensure we have auth context for Firestore writes
        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch {
            // Continue without auth — may still work if rules allow it
          }
        }

        // Idempotency: if this checkout session already produced an order
        // doc, reuse it instead of creating a duplicate. This survives
        // double-clicks and back-button resubmits.
        const idempotencyKey = idempotencyKeyRef.current;
        const existingQ = query(
          collection(db, "orders"),
          where("idempotencyKey", "==", idempotencyKey),
          limit(1)
        );
        const existingSnap = await getDocs(existingQ);
        if (!existingSnap.empty) {
          // Already saved — proceed straight to the post-save flow
        } else {
          // Submit-time slot capacity recheck. Two customers can pick the
          // same slot before either submits; we re-count today's docs at
          // write time and reject if the slot is full.
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const slotQ = query(
            collection(db, "orders"),
            where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
            where("pickupTime", "==", pickupTime),
            limit(20)
          );
          const slotSnap = await getDocs(slotQ);
          const activeInSlot = slotSnap.docs.filter(
            (d) => d.data().status !== "cancelled"
          ).length;
          if (activeInSlot >= SLOT_CAPACITY) {
            setSlotFill((prev) => ({ ...prev, [pickupTime]: activeInSlot }));
            setErrors({
              pickupTime: `That slot just filled up. Please pick another time.`,
            });
            setPlacing(false);
            setStep(2);
            return;
          }

          const firebasePromise = addDoc(collection(db, "orders"), {
            orderId: id,
            idempotencyKey,
            customerName: name.trim(),
            phone: phone.trim(),
            items: orderItems,
            total: totalPrice,
            pickupTime,
            paymentMethod,
            status: "new",
            createdAt: serverTimestamp(),
          });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firebase timeout")), 8000)
          );
          await Promise.race([firebasePromise, timeoutPromise]);

          // Update local slot fill so the user can't reuse the now-fuller slot
          setSlotFill((prev) => ({
            ...prev,
            [pickupTime]: activeInSlot + 1,
          }));
        }
      } catch (firebaseErr) {
        console.error("Firebase save failed:", firebaseErr);
        // Order will still proceed via WhatsApp but won't appear in admin dashboard
      }

      // If Pay Online, build the dynamic UPI link + QR for THIS order
      if (paymentMethod === "Pay Online — UPI via WhatsApp") {
        const link = buildUpiLink({ amount: totalPrice, orderId: id });
        setUpiLink(link);
        try {
          const dataUrl = await QRCode.toDataURL(link, {
            margin: 1,
            width: 320,
            color: { dark: "#000000", light: "#ffffff" },
          });
          setQrDataUrl(dataUrl);
        } catch {
          setQrDataUrl("");
        }
        const waUrl = generatePaymentWhatsApp(orderDetails);
        setWhatsappUrl(waUrl);
        setShowQR(true);
        setPlacing(false);
        // Don't clear cart yet — wait until customer confirms payment, so a
        // back-button doesn't lose the cart on a failed UPI attempt.
        return;
      }

      // For Pay at Cart, open WhatsApp with order details
      const waUrl = generateOrderWhatsApp(orderDetails);
      setWhatsappUrl(waUrl);
      window.open(waUrl, "_blank");

      setOrderPlaced(true);
      clearCart();
      // Rotate the idempotency key so a new order from the same tab is allowed
      idempotencyKeyRef.current = generateId();
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Handle QR payment done - open WhatsApp with payment confirmation
  const handlePaymentDone = () => {
    window.open(whatsappUrl, "_blank");
    setShowQR(false);
    setOrderPlaced(true);
    clearCart();
    idempotencyKeyRef.current = generateId();
  };

  // QR Payment screen
  if (showQR) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center flex flex-col items-center gap-5 max-w-sm w-full"
        >
          <div className="bg-[#111] border border-[#27272a] rounded-xl px-6 py-4">
            <p className="text-sm text-[#71717a] mb-1">Order ID</p>
            <p className="font-mono text-2xl text-[#FFD600]">#{orderId}</p>
          </div>

          <h1 className="font-display text-3xl text-[#e4e4e7] tracking-wider">
            SCAN &amp; PAY
          </h1>
          <p className="text-sm text-[#a1a1aa] font-body">
            Pay <span className="text-[#FFD600] font-bold">₹{totalPrice || "—"}</span> via UPI — your order ID is auto-attached
          </p>

          {/* Dynamic QR Code (encodes amount + orderId so the merchant
              can match parallel payments unambiguously) */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="UPI Payment QR Code"
                width={260}
                height={260}
                className="rounded-xl block"
              />
            ) : (
              <div className="w-[260px] h-[260px] flex items-center justify-center text-[#71717a] text-xs">
                Generating QR…
              </div>
            )}
          </div>

          {/* Mobile-only: open the customer's UPI app directly with
              amount + orderId pre-filled. Saves them from scanning. */}
          {upiLink && (
            <a
              href={upiLink}
              className="w-full py-3 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Open UPI app to pay ₹{totalPrice}
            </a>
          )}

          <p className="text-xs text-[#71717a] font-body">
            After payment, click below to confirm via WhatsApp
          </p>

          <button
            onClick={handlePaymentDone}
            className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 32 32" fill="white" className="w-5 h-5">
              <path d="M16.004 3.2C9.002 3.2 3.31 8.89 3.307 15.895c-.001 2.24.584 4.426 1.694 6.352L3.2 28.8l6.72-1.762a12.67 12.67 0 006.076 1.548h.005c7 0 12.693-5.692 12.696-12.695a12.62 12.62 0 00-3.72-8.977A12.62 12.62 0 0016.004 3.2z" />
            </svg>
            I&apos;ve Paid — Confirm on WhatsApp
          </button>

          <button
            onClick={() => { setShowQR(false); setOrderPlaced(true); }}
            className="text-sm text-[#71717a] hover:text-[#e4e4e7] underline transition-colors"
          >
            Skip — I&apos;ll pay later at cart
          </button>
        </motion.div>
      </main>
    );
  }

  // Success screen
  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center flex flex-col items-center gap-6 max-w-sm"
        >
          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
            className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}
            >
              <Check className="w-10 h-10 text-[#22C55E]" />
            </motion.div>
          </motion.div>

          <h1 className="font-display text-4xl text-[#e4e4e7] tracking-wider">
            ORDER PLACED!
          </h1>

          <div className="bg-[#111] border border-[#27272a] rounded-xl px-6 py-4">
            <p className="text-sm text-[#71717a] mb-1">Order ID</p>
            <p className="font-mono text-2xl text-[#FFD600]">#{orderId}</p>
          </div>

          <Link
            href="/track"
            className="px-8 py-3 rounded-full bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            Track your order
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#71717a] hover:text-[#e4e4e7] underline transition-colors"
          >
            WhatsApp didn&apos;t open? Click here
          </a>

          <Link
            href="/menu"
            className="text-sm text-[#FFD600] hover:underline"
          >
            Back to menu
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {stepLabels.map((label, i) => {
            const stepNum = (i + 1) as Step;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isCompleted
                        ? "bg-[#22C55E] text-white"
                        : isActive
                        ? "bg-[#FFD600] text-[#09090b]"
                        : "bg-[#27272a] text-[#71717a]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 whitespace-nowrap ${
                      isActive
                        ? "text-[#FFD600]"
                        : isCompleted
                        ? "text-[#22C55E]"
                        : "text-[#71717a]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-[2px] mx-2 mb-5 ${
                      step > stepNum ? "bg-[#22C55E]" : "bg-[#27272a]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Cart Review */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-3xl text-[#e4e4e7] tracking-wider mb-6">
                YOUR CART
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[#71717a] font-body text-lg mb-6">
                    Your cart is empty
                  </p>
                  <Link
                    href="/menu"
                    className="px-8 py-3 rounded-full bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-[#111] border border-[#27272a] rounded-xl px-4 py-3"
                      >
                        {/* Veg / Nonveg indicator */}
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            item.type === "veg"
                              ? "bg-[#22C55E]"
                              : "bg-[#E53935]"
                          }`}
                        />

                        {/* Name & unit price */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#e4e4e7] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#71717a] font-mono">
                            ₹{item.price} each
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-mono w-6 text-center text-[#e4e4e7]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="font-display text-lg text-[#FFD600] w-16 text-right flex-shrink-0">
                          ₹{item.price * item.quantity}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#71717a] hover:text-[#E53935] transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#27272a]">
                    <span className="text-[#71717a] font-body">Total</span>
                    <span className="font-display text-3xl text-[#FFD600]">
                      ₹{totalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mt-8 w-full py-3.5 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Step 2: Your Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-3xl text-[#e4e4e7] tracking-wider mb-6">
                YOUR DETAILS
              </h2>

              <div className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1.5">
                    Name <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-[#27272a] text-white placeholder-[#52525b] focus:border-[#FFD600] focus:outline-none transition-colors font-body"
                  />
                  {errors.name && (
                    <p className="text-[#E53935] text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1.5">
                    Phone Number <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(val);
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-[#27272a] text-white placeholder-[#52525b] focus:border-[#FFD600] focus:outline-none transition-colors font-mono"
                  />
                  {errors.phone && (
                    <p className="text-[#E53935] text-xs mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1.5">
                    Pickup Time <span className="text-[#E53935]">*</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => {
                      setPickupTime(e.target.value);
                      if (errors.pickupTime)
                        setErrors((prev) => ({ ...prev, pickupTime: "" }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-[#27272a] text-white focus:border-[#FFD600] focus:outline-none transition-colors font-body appearance-none"
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>
                    {pickupSlots.map((slot) => {
                      const filled = slotFill[slot] || 0;
                      const isFull = filled >= SLOT_CAPACITY;
                      return (
                        <option key={slot} value={slot} disabled={isFull}>
                          {slot}
                          {isFull
                            ? " — full"
                            : filled > 0
                            ? ` — ${SLOT_CAPACITY - filled} left`
                            : ""}
                        </option>
                      );
                    })}
                  </select>
                  {errors.pickupTime && (
                    <p className="text-[#E53935] text-xs mt-1">
                      {errors.pickupTime}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Pay at Cart", "Pay Online — UPI via WhatsApp"].map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-4 rounded-xl border text-left text-sm font-body transition-all ${
                            paymentMethod === method
                              ? "border-[#FFD600] bg-[#FFD600]/5 text-[#FFD600]"
                              : "border-[#27272a] bg-[#18181b] text-[#a1a1aa] hover:border-[#3f3f46]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                paymentMethod === method
                                  ? "border-[#FFD600]"
                                  : "border-[#52525b]"
                              }`}
                            >
                              {paymentMethod === method && (
                                <div className="w-2 h-2 rounded-full bg-[#FFD600]" />
                              )}
                            </div>
                            {method}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl border border-[#27272a] text-[#a1a1aa] font-bold text-sm hover:bg-[#18181b] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-3xl text-[#e4e4e7] tracking-wider mb-6">
                CONFIRM ORDER
              </h2>

              <div className="bg-[#111] border border-[#27272a] rounded-2xl p-5 flex flex-col gap-4">
                {/* Items */}
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-[#e4e4e7]">
                        {item.name}{" "}
                        <span className="text-[#71717a]">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-[#a1a1aa]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#27272a]" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">Total</span>
                  <span className="font-display text-2xl text-[#FFD600]">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="h-px bg-[#27272a]" />

                {/* Customer details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[#71717a]">Name</p>
                    <p className="text-[#e4e4e7]">{name}</p>
                  </div>
                  <div>
                    <p className="text-[#71717a]">Phone</p>
                    <p className="text-[#e4e4e7] font-mono">{phone}</p>
                  </div>
                  <div>
                    <p className="text-[#71717a]">Pickup</p>
                    <p className="text-[#e4e4e7]">{pickupTime}</p>
                  </div>
                  <div>
                    <p className="text-[#71717a]">Payment</p>
                    <p className="text-[#e4e4e7]">{paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 rounded-xl border border-[#27272a] text-[#a1a1aa] font-bold text-sm hover:bg-[#18181b] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="flex-[2] py-3.5 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
