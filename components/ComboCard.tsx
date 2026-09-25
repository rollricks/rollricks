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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`w-full rounded-2xl bg-card flex flex-col border overflow-hidden ${
        isFeatured
          ? "border-gold/50 glow"
          : "border-line"
      }`}
    >
      {/* Hero image with the tag badge floated on top */}
      {combo.image && (
        <div className="relative w-full h-44 bg-raised overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={combo.image}
            alt={combo.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <span className="absolute top-3 left-3 inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-on-accent shadow-md">
            {combo.tag}
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {!combo.image && (
          <span className="inline-flex self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-gold border border-gold/20">
            {combo.tag}
          </span>
        )}

      {/* Name */}
      <h3 className="font-display font-black text-2xl text-ink leading-tight">
        {combo.name}
      </h3>

      {/* Tagline */}
      <p className="text-xs italic text-muted leading-relaxed">
        {combo.tagline}
      </p>

      {/* Type indicator */}
      <div className="flex items-center gap-1.5">
        <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
          combo.type === "nonveg" ? "border-nonveg" : combo.type === "both" ? "border-gold" : "border-veg"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            combo.type === "nonveg" ? "bg-nonveg" : combo.type === "both" ? "bg-accent" : "bg-veg"
          }`} />
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          combo.type === "nonveg" ? "text-nonveg" : combo.type === "both" ? "text-gold" : "text-veg"
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
                  ? "bg-nonveg"
                  : combo.type === "both"
                  ? idx % 2 === 0
                    ? "bg-veg"
                    : "bg-nonveg"
                  : "bg-veg"
              }`}
            />
            <span className="text-ink">{item.name}</span>
            <span className="text-muted font-mono text-xs ml-auto">
              ₹{item.price}
            </span>
          </li>
        ))}
      </ul>

      {/* Price row */}
      <div className="flex items-end gap-3 mt-auto pt-2">
        <span className="font-display font-black text-3xl text-gold leading-none">
          ₹{combo.price}
        </span>
        <span className="text-sm text-muted line-through font-mono">
          ₹{combo.originalPrice}
        </span>
        <span className="ml-auto text-xs font-bold text-veg bg-veg/10 px-2 py-0.5 rounded-full">
          Saves ₹{combo.savings}
        </span>
      </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wide active:scale-[0.97] transition-all ${
            added
              ? "bg-veg text-white"
              : "bg-accent text-on-accent hover:brightness-110"
          }`}
        >
          {added ? "Added ✓" : "Add combo +"}
        </button>
      </div>
    </motion.div>
  );
}
