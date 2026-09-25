"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import Seal from "./Seal";

export default function CartDrawer() {
  const router = useRouter();
  const { cartOpen: isOpen, closeCart: onClose } = useUI();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60"
          />

          <div className="fixed z-[61] inset-x-0 bottom-0 sm:inset-y-0 sm:left-auto sm:right-0 flex pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:w-[420px] max-h-[85vh] sm:max-h-none sm:h-full flex flex-col rounded-t-3xl sm:rounded-none bg-card border-t sm:border-t-0 sm:border-l border-line"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <Seal size={32} />
                  <h2 className="font-display font-black text-2xl text-ink">Your Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-raised transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 text-ink" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-5 gap-3 text-center">
                  <Seal size={72} className="opacity-80" />
                  <p className="font-hand text-2xl text-gold">Pet khaali, cart khaali!</p>
                  <p className="text-muted text-sm">Your cart is empty.</p>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 rounded-full bg-accent text-on-accent font-bold text-sm"
                  >
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto divide-y divide-line">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            item.type === "veg" ? "bg-veg" : "bg-nonveg"
                          }`}
                          aria-label={item.type === "veg" ? "Veg" : "Non-veg"}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink leading-snug">{item.name}</p>
                          <p className="text-xs text-muted font-mono">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-raised hover:bg-line transition-colors text-ink"
                            aria-label={`Remove one ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-mono w-5 text-center text-ink">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-raised hover:bg-line transition-colors text-ink"
                            aria-label={`Add one more ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-raised text-muted hover:text-nonveg transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="border-t border-line px-5 pt-4 space-y-3 bg-card"
                    style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-soft">Total</span>
                      <span className="font-display font-black text-2xl text-gold">₹{totalPrice}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 rounded-xl bg-accent text-on-accent font-bold text-sm uppercase tracking-wide glow hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      Checkout — pickup &amp; pay
                    </button>
                    <p className="text-[11px] text-muted text-center">Pay by UPI or at the cart. No login needed.</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
