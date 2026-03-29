"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { Combo } from "@/lib/combo-data";

interface ComboCardProps {
  combo: Combo;
  featured?: boolean;
}

export default function ComboCard({ combo, featured }: ComboCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isFeatured = featured ?? combo.featured;

  const handleAddToCart = () => {
    addItem({
      id: combo.id,
      name: combo.name,
      price: combo.price,
      type: combo.type === "nonveg" ? "nonveg" : "veg",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl bg-[#111] p-5 flex flex-col gap-3 border ${
        isFeatured
          ? "border-[#FFD600]/60 shadow-[0_0_24px_-6px_rgba(255,214,0,0.15)]"
          : "border-[#27272a]"
      }`}
    >
      {/* Tag badge */}
      <span className="inline-flex self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20">
        {combo.tag}
      </span>

      {/* Name */}
      <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider leading-none">
        {combo.name}
      </h3>

      {/* Tagline */}
      <p className="text-xs italic text-[#71717a] leading-relaxed">
        {combo.tagline}
      </p>

      {/* Type indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
          combo.type === "nonveg" ? "border-[#E53935]" : combo.type === "both" ? "border-[#FFD600]" : "border-[#22C55E]"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            combo.type === "nonveg" ? "bg-[#E53935]" : combo.type === "both" ? "bg-[#FFD600]" : "bg-[#22C55E]"
          }`} />
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          combo.type === "nonveg" ? "text-[#E53935]" : combo.type === "both" ? "text-[#FFD600]" : "text-[#22C55E]"
        }`}>
          {combo.type === "both" ? "VEG + NON-VEG" : combo.type.toUpperCase()}
        </span>
      </div>

      {/* Items list */}
      <ul className="flex flex-col gap-1.5 mt-1">
        {combo.items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                combo.type === "nonveg"
                  ? "bg-[#E53935]"
                  : combo.type === "both"
                  ? idx % 2 === 0
                    ? "bg-[#22C55E]"
                    : "bg-[#E53935]"
                  : "bg-[#22C55E]"
              }`}
            />
            <span className="text-[#e4e4e7]">{item.name}</span>
            <span className="text-[#71717a] font-mono text-xs ml-auto">
              ₹{item.price}
            </span>
          </li>
        ))}
      </ul>

      {/* Price row */}
      <div className="flex items-end gap-3 mt-auto pt-2">
        <span className="font-display text-3xl text-[#FFD600] leading-none">
          ₹{combo.price}
        </span>
        <span className="text-sm text-[#71717a] line-through font-mono">
          ₹{combo.originalPrice}
        </span>
        <span className="ml-auto text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
          Saves ₹{combo.savings}
        </span>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAddToCart}
        className={`mt-2 w-full py-2.5 rounded-xl font-bold text-sm active:scale-[0.97] transition-all ${
          added
            ? "bg-[#22C55E] text-white"
            : "bg-[#FFD600] text-[#09090b] hover:brightness-110"
        }`}
      >
        {added ? "Added!" : "Add to Cart"}
      </button>
    </motion.div>
  );
}
