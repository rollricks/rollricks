"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";

// Floating bottom cart: "🛒 3 ITEMS · ₹428 · VIEW CART →".
// Appears once something is in the cart; opens the cart drawer.
export default function CartBar() {
  const { totalItems, totalPrice } = useCart();
  const { openCart, cartOpen, sheetItem } = useUI();
  const show = totalItems > 0 && !cartOpen && !sheetItem;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
          className="fixed bottom-0 inset-x-0 z-40 px-3 pt-3 pointer-events-none"
        >
          <button
            onClick={openCart}
            className="pointer-events-auto w-full max-w-xl mx-auto flex items-center justify-between gap-3 pl-4 pr-3 py-3 rounded-2xl bg-accent text-on-accent glow active:scale-[0.99] transition-transform"
            aria-label={`View cart, ${totalItems} items, ₹${totalPrice}`}
          >
            <span className="flex items-center gap-3">
              <span className="relative">
                <ShoppingBag className="w-5 h-5" />
                <motion.span
                  key={totalItems}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-on-accent text-accent text-[10px] font-bold flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[11px] font-bold uppercase tracking-wider opacity-80">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="block font-display font-black text-lg">₹{totalPrice}</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sm uppercase tracking-wide">
              View cart <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
