"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { MenuItem as MenuItemType } from "@/lib/menu-data";

interface MenuItemProps {
  item: MenuItemType;
}

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

  return (
    <motion.div
      whileTap={unavailable ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex items-center gap-3 rounded-xl bg-[#111] border border-[#27272a] px-3 py-3 sm:px-4 ${
        unavailable ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Veg / Nonveg indicator */}
      <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
        item.type === "veg" ? "border-[#22C55E]" : "border-[#E53935]"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          item.type === "veg" ? "bg-[#22C55E]" : "bg-[#E53935]"
        }`} />
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-[#e4e4e7]">
            {item.name}
          </p>
          {item.badge && !unavailable && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20">
              {item.badge}
            </span>
          )}
          {unavailable && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#71717a]/20 text-[#71717a] border border-[#71717a]/20">
              Unavailable
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-[11px] text-[#71717a] mt-0.5 line-clamp-1">
            {item.description}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="font-display text-lg text-[#FFD600]">
          ₹{item.price}
        </span>
        {item.originalPrice && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#71717a] line-through">
              ₹{item.originalPrice}
            </span>
            <span className="text-[9px] font-bold text-[#22C55E]">
              -₹{item.originalPrice - item.price}
            </span>
          </div>
        )}
      </div>

      {/* Add / Quantity controls */}
      {!unavailable && (
        <div className="flex-shrink-0">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-9 h-9 flex items-center justify-center rounded-lg active:scale-90 transition-all ${
                justAdded
                  ? "bg-[#22C55E] text-white"
                  : "bg-[#FFD600] text-[#09090b] hover:brightness-110"
              }`}
              aria-label={`Add ${item.name} to cart`}
            >
              {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
              <span className="text-sm font-mono w-6 text-center font-bold">
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
          )}
        </div>
      )}
    </motion.div>
  );
}
