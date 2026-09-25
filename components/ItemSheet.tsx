"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { cartLineId } from "@/lib/menu-data";
import FoodImage from "./FoodImage";
import VegMark from "./VegMark";

// Native-feeling bottom sheet for a single dish. Drag down or tap the
// backdrop to dismiss. Add-ons become part of the cart line (id +
// name + price) so checkout, WhatsApp and admin need no changes.
export default function ItemSheet() {
  const { sheetItem: item, closeItem } = useUI();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [addons, setAddons] = useState<string[]>([]);

  useEffect(() => {
    setQty(1);
    setAddons([]);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeItem();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, closeItem]);

  const chosen = item?.addons?.filter((a) => addons.includes(a.id)) ?? [];
  const unitPrice = (item?.price ?? 0) + chosen.reduce((s, a) => s + a.price, 0);
  const unavailable = item?.available === false;

  const handleAdd = () => {
    if (!item || unavailable) return;
    addItem({
      id: cartLineId(item.id, chosen.map((a) => a.id)),
      name: chosen.length ? `${item.name} (${chosen.map((a) => a.name.replace(/^Add /, "+")).join(", ")})` : item.name,
      price: unitPrice,
      type: item.type,
      quantity: qty,
    });
    closeItem();
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeItem}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]"
          />
          <div key="sheet-wrap" className="fixed z-[61] inset-x-0 bottom-0 sm:bottom-6 flex justify-center pointer-events-none">
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) closeItem();
            }}
            className="pointer-events-auto w-full sm:w-[440px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card border-t sm:border border-line shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex justify-center pt-2.5 pb-1 bg-gradient-to-b from-card to-transparent sm:hidden">
              <span className="w-10 h-1.5 rounded-full bg-line-strong" />
            </div>

            <button
              onClick={closeItem}
              className="absolute right-3 top-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-base/70 backdrop-blur text-ink"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[4/3] w-full -mt-5 sm:mt-0 overflow-hidden">
              <FoodImage item={item} eager />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
            </div>

            <div className="px-5 pb-5 -mt-2 relative">
              <div className="flex items-center gap-3 mb-2">
                <VegMark type={item.type} label />
                <span className="text-[10px] uppercase tracking-widest text-muted">{item.section}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-on-accent">
                    {item.badge.replace(/^★\s*/, "")}
                  </span>
                )}
              </div>
              <h2 className="font-display font-black text-3xl text-ink leading-tight">{item.name}</h2>
              <p className="mt-2 text-sm text-soft leading-relaxed">{item.description}</p>
              <p className="mt-3 font-display font-black text-3xl text-gold">₹{item.price}</p>

              {!!item.addons?.length && (
                <div className="mt-5">
                  <p className="font-hand text-xl text-gold mb-2">Make it extra</p>
                  <div className="flex flex-col gap-2">
                    {item.addons.map((a) => {
                      const on = addons.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() =>
                            setAddons((prev) => (on ? prev.filter((x) => x !== a.id) : [...prev, a.id]))
                          }
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${
                            on ? "border-gold bg-accent/10" : "border-line bg-raised/50"
                          }`}
                          aria-pressed={on}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                                on ? "bg-accent border-accent text-on-accent" : "border-line-strong"
                              }`}
                            >
                              {on && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span className="text-sm font-medium text-ink">{a.name}</span>
                          </span>
                          <span className="text-sm font-mono text-soft">+₹{a.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {unavailable ? (
                <p className="mt-6 text-center py-3.5 rounded-xl bg-raised text-soft font-semibold">
                  Sold out today — check back tomorrow
                </p>
              ) : (
                <div className="mt-6 flex items-center gap-3" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
                  <div className="flex items-center rounded-xl border border-line bg-raised/60">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-12 flex items-center justify-center text-ink"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-ink">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(20, q + 1))}
                      className="w-11 h-12 flex items-center justify-center text-ink"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex-1 h-12 rounded-xl bg-accent text-on-accent font-bold text-sm uppercase tracking-wide flex items-center justify-between px-5 glow hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <span>Add to cart</span>
                    <span className="font-display font-black text-lg normal-case">₹{unitPrice * qty}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
