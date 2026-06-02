"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { MenuItem as MenuItemType } from "@/lib/menu-data";

interface MenuItemProps {
  item: MenuItemType;
}

// Photo-forward card. Mobile shows two per row (the menu page grid is
// grid-cols-2), so the photo does the selling and the name/price/add
// sit beneath it. Cart logic is unchanged from the old row layout.
export default function MenuItem({ item }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find((ci) => ci.id === item.id);
  const quantity = cartItem?.quantity ?? 0;
  const unavailable = item.available === false;

  const handleAdd = () => {
    if (unavailable) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      type: item.type,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  const VegDot = (
    <span
      className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-[#09090b]/80 backdrop-blur ${
        item.type === "veg" ? "border-[#22C55E]" : "border-[#E53935]"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          item.type === "veg" ? "bg-[#22C55E]" : "bg-[#E53935]"
        }`}
      />
    </span>
  );

  return (
    <motion.div
      whileTap={unavailable ? {} : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group flex flex-col rounded-2xl bg-[#111] border border-[#27272a] overflow-hidden hover:border-[#3f3f46] transition-colors ${
        unavailable ? "opacity-60" : ""
      }`}
    >
      {/* ── Photo ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1a1a]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-active:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-[#1f1f23] to-[#111]">
            🍽️
          </div>
        )}

        {/* veg/non-veg dot */}
        <span className="absolute top-2 left-2">{VegDot}</span>

        {/* badge */}
        {item.badge && !unavailable && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#FFD600] text-[#09090b] shadow">
            {item.badge}
          </span>
        )}

        {/* unavailable overlay */}
        {unavailable && (
          <div className="absolute inset-0 bg-[#09090b]/65 flex items-center justify-center">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46]">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <p className="text-sm font-semibold text-[#e4e4e7] leading-tight line-clamp-2">
          {item.name}
        </p>
        {item.description && (
          <p className="text-[11px] text-[#71717a] leading-snug line-clamp-2">
            {item.description}
          </p>
        )}

        {/* price + add */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-display text-xl text-[#FFD600] leading-none">
            ₹{item.price}
          </span>

          {!unavailable &&
            (quantity === 0 ? (
              <button
                onClick={handleAdd}
                className={`h-9 px-3 flex items-center justify-center gap-1 rounded-lg font-bold text-sm active:scale-90 transition-all ${
                  justAdded
                    ? "bg-[#22C55E] text-white"
                    : "bg-[#FFD600] text-[#09090b] hover:brightness-110"
                }`}
                aria-label={`Add ${item.name} to cart`}
              >
                {justAdded ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#27272a] hover:bg-[#3f3f46] active:scale-90 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-mono w-5 text-center font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFD600] text-[#09090b] hover:brightness-110 active:scale-90 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
