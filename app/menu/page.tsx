"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { menuCategories, allMenuItems } from "@/lib/menu-data";
import { combos } from "@/lib/combo-data";
import ComboCard from "@/components/ComboCard";
import MenuItem from "@/components/MenuItem";
import { useCart } from "@/context/CartContext";

const tabs = ["Combos", "Veg", "Non-Veg", "Drinks", "Desserts"] as const;
type Tab = (typeof tabs)[number];

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Combos");
  const { totalItems, totalPrice } = useCart();

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
    <main className="min-h-screen bg-[#09090b] pb-24">
      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 bg-[#09090b]/95 backdrop-blur border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-[#71717a] hover:text-[#a1a1aa]"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Combos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {combos.map((combo) => (
                  <ComboCard key={combo.id} combo={combo} />
                ))}
              </div>
            )}

            {activeTab === "Veg" && (
              <div className="flex flex-col gap-10">
                {vegCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider mb-4">
                      {category.emoji} {category.name.toUpperCase()}
                    </h3>
                    <div className="flex flex-col gap-3">
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
                <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider mb-4">
                  {nonVegCategory.emoji} {nonVegCategory.name.toUpperCase()}
                </h3>
                <div className="flex flex-col gap-3">
                  {nonVegCategory.items.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Drinks" && drinksCategory && (
              <div>
                <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider mb-4">
                  {drinksCategory.emoji} {drinksCategory.name.toUpperCase()}
                </h3>
                <div className="flex flex-col gap-3">
                  {drinksCategory.items.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Desserts" && dessertsCategory && (
              <div>
                <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider mb-4">
                  {dessertsCategory.emoji} {dessertsCategory.name.toUpperCase()}
                </h3>
                <div className="flex flex-col gap-3">
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
            className="fixed bottom-0 left-0 right-0 z-40 p-4"
          >
            <Link
              href="/checkout"
              className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4 rounded-2xl bg-[#FFD600] text-[#09090b] shadow-[0_-4px_24px_rgba(255,214,0,0.3)]"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold text-sm">
                  View Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
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
