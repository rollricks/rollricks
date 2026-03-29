"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { menuCategories } from "@/lib/menu-data";
import { combos } from "@/lib/combo-data";
import ComboCard from "@/components/ComboCard";
import MenuItem from "@/components/MenuItem";
import { useCart } from "@/context/CartContext";

const tabs = [
  { key: "Combos", emoji: "🎯", color: "text-[#FFD600]" },
  { key: "Veg", emoji: "🟢", color: "text-[#22C55E]" },
  { key: "Non-Veg", emoji: "🔴", color: "text-[#E53935]" },
  { key: "Drinks", emoji: "🥤", color: "text-[#3B82F6]" },
  { key: "Desserts", emoji: "🍫", color: "text-[#8B5CF6]" },
] as const;

type Tab = (typeof tabs)[number]["key"];

const tabColors: Record<Tab, string> = {
  Combos: "#FFD600",
  Veg: "#22C55E",
  "Non-Veg": "#E53935",
  Drinks: "#3B82F6",
  Desserts: "#8B5CF6",
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Combos");
  const { totalItems, totalPrice } = useCart();

  const color = tabColors[activeTab];

  const vegCategories = menuCategories.filter(
    (cat) =>
      cat.name !== "Non-Veg Specials" &&
      cat.name !== "Drinks" &&
      cat.name !== "Desserts"
  );

  const nonVegCategory = menuCategories.find(
    (cat) => cat.name === "Non-Veg Specials"
  );

  const drinksCategory = menuCategories.find(
    (cat) => cat.name === "Drinks"
  );

  const dessertsCategory = menuCategories.find(
    (cat) => cat.name === "Desserts"
  );

  return (
    <main className="min-h-screen bg-[#09090b] pb-28">
      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "text-[#09090b]"
                      : "text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                  style={isActive ? { backgroundColor: tabColors[tab.key] } : {}}
                >
                  <span className="text-base">{tab.emoji}</span>
                  <span>{tab.key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Combos" && (
              <div>
                <div className="mb-6">
                  <h2 className="font-display text-3xl tracking-wider" style={{ color }}>
                    COMBO DEALS
                  </h2>
                  <p className="text-sm text-[#71717a] font-body mt-1">
                    Save more with our curated combos
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {combos.map((combo) => (
                    <ComboCard key={combo.id} combo={combo} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Veg" && (
              <div className="flex flex-col gap-8">
                {vegCategories.map((category) => (
                  <div key={category.name}>
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#22C55E]/30">
                      <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center text-xl">
                        {category.emoji}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-[#22C55E] tracking-wider">
                          {category.name.toUpperCase()}
                        </h3>
                        <p className="text-xs text-[#71717a]">{category.items.length} items</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm border-2 border-[#22C55E] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        </span>
                        <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">VEG</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {category.items.map((item) => (
                        <MenuItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Non-Veg" && nonVegCategory && (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#E53935]/30">
                  <div className="w-10 h-10 rounded-xl bg-[#E53935]/10 flex items-center justify-center text-xl">
                    {nonVegCategory.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-[#E53935] tracking-wider">
                      {nonVegCategory.name.toUpperCase()}
                    </h3>
                    <p className="text-xs text-[#71717a]">{nonVegCategory.items.length} items</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm border-2 border-[#E53935] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
                    </span>
                    <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-wider">NON-VEG</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {nonVegCategory.items.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Drinks" && drinksCategory && (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#3B82F6]/30">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-xl">
                    {drinksCategory.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-[#3B82F6] tracking-wider">
                      {drinksCategory.name.toUpperCase()}
                    </h3>
                    <p className="text-xs text-[#71717a]">{drinksCategory.items.length} items</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {drinksCategory.items.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Desserts" && dessertsCategory && (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[#8B5CF6]/30">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-xl">
                    {dessertsCategory.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-[#8B5CF6] tracking-wider">
                      {dessertsCategory.name.toUpperCase()}
                    </h3>
                    <p className="text-xs text-[#71717a]">{dessertsCategory.items.length} items</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {dessertsCategory.items.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3"
          >
            <Link
              href="/checkout"
              className="flex items-center justify-between max-w-6xl mx-auto px-5 py-3.5 rounded-2xl bg-[#FFD600] text-[#09090b] shadow-[0_-4px_24px_rgba(255,214,0,0.3)]"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {totalItems} {totalItems === 1 ? "item" : "items"} — Checkout
                </span>
              </div>
              <span className="font-display text-xl">
                ₹{totalPrice}
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
