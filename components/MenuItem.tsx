"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import type { MenuItem as MenuItemType } from "@/lib/menu-data";
import FoodImage from "./FoodImage";
import VegMark from "./VegMark";

interface MenuItemProps {
  item: MenuItemType;
  size?: "md" | "lg";
}

// Photo-forward food card. Tapping the card opens the bottom sheet
// (bigger photo, add-ons, quantity); the ADD button adds straight to
// cart for the no-fuss path.
export default function MenuItem({ item, size = "md" }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCart();
  const { openItem } = useUI();

  const quantity = items.find((ci) => ci.id === item.id)?.quantity ?? 0;
  const unavailable = item.available === false;
  const hasAddons = !!item.addons?.length;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unavailable) return;
    if (hasAddons) {
      openItem(item);
      return;
    }
    addItem({ id: item.id, name: item.name, price: item.price, type: item.type });
  };

  return (
    <motion.article
      whileTap={unavailable ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => openItem(item)}
      className={`group relative flex flex-col rounded-[1.25rem] bg-card border border-line overflow-hidden cursor-pointer hover:border-line-strong hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 ${
        unavailable ? "opacity-60" : ""
      }`}
      aria-label={`${item.name}, ₹${item.price}`}
    >
      {/* Photo */}
      <div className={`relative w-full overflow-hidden bg-raised ${size === "lg" ? "aspect-[4/3.4]" : "aspect-[4/3]"}`}>
        <FoodImage item={item} className="group-hover:scale-[1.04] transition-transform duration-500" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />

        {item.badge && !unavailable && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-accent text-on-accent shadow">
            {item.badge.replace(/^★\s*/, "")}
          </span>
        )}

        {unavailable && (
          <div className="absolute inset-0 bg-base/70 flex items-center justify-center">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-raised text-soft border border-line-strong">
              Sold out today
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <div className="flex items-center justify-between gap-2">
          <VegMark type={item.type} />
          <span className="text-[10px] uppercase tracking-wider text-muted">{item.section}</span>
        </div>
        <h3 className={`font-display font-bold text-ink leading-tight line-clamp-2 ${size === "lg" ? "text-lg" : "text-[15px]"}`}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[11px] text-muted leading-snug line-clamp-2">{item.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-display font-black text-xl text-gold leading-none">₹{item.price}</span>

          {!unavailable &&
            (quantity === 0 || hasAddons ? (
              <button
                onClick={handleAdd}
                className="h-9 px-3 flex items-center justify-center gap-1 rounded-lg font-bold text-xs uppercase tracking-wide bg-accent text-on-accent hover:brightness-110 active:scale-90 transition-all"
                aria-label={`Add ${item.name} to cart`}
              >
                Add <Plus className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-raised text-ink hover:bg-line active:scale-90 transition-all"
                  aria-label={`Remove one ${item.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-mono w-5 text-center font-bold text-ink">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent text-on-accent hover:brightness-110 active:scale-90 transition-all"
                  aria-label={`Add one more ${item.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </motion.article>
  );
}
