"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[#111] border-t border-[#27272a]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#111] flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
              <h2 className="font-display text-xl text-[#FFD600] tracking-wider">
                YOUR CART
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#27272a]/60 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-[#e4e4e7]" />
              </button>
            </div>

            {/* Cart content */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-5 gap-4">
                <p className="text-[#71717a] text-sm">Your cart is empty</p>
                <Link
                  href="/menu"
                  onClick={onClose}
                  className="text-sm text-[#FFD600] hover:underline"
                >
                  Browse the menu
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="divide-y divide-[#27272a]">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      {/* Veg/nonveg dot */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          item.type === "veg"
                            ? "bg-[#22C55E]"
                            : "bg-[#E53935]"
                        }`}
                      />

                      {/* Name & price */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e4e4e7] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#71717a] font-mono">
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-mono w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded hover:bg-[#27272a]/60 text-[#71717a] hover:text-[#E53935] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#111] border-t border-[#27272a] px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#71717a]">Subtotal</span>
                    <span className="font-display text-lg text-[#FFD600]">
                      ₹{totalPrice}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
