"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Flame, Package, Smartphone, ShoppingCart } from "lucide-react";
import { featuredCombos } from "@/lib/combo-data";
import ComboCard from "@/components/ComboCard";
import { useCart } from "@/context/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const sectionFade = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
  {
    icon: Flame,
    title: "Fresh Daily",
    description: "Cooked fresh on our cart every evening",
  },
  {
    icon: Package,
    title: "Bulk Orders",
    description: "Office, college, events — we deliver",
  },
  {
    icon: Smartphone,
    title: "Pre-Book Online",
    description: "Skip the wait, order from your phone",
  },
];

export default function HomePage() {
  const { totalItems, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center dot-grid px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20"
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-sm font-body text-[#22C55E]">Open Now</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-6xl md:text-8xl text-[#FFD600] tracking-wider"
            style={{
              textShadow:
                "0 0 40px rgba(229, 57, 53, 0.4), 0 0 80px rgba(229, 57, 53, 0.2), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            ROLLRICKS
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-body text-lg text-[#e4e4e7] max-w-sm italic"
          >
            &ldquo;Jo Dil Se Banata Hai, Vo Dil Tak Jaata Hai&rdquo;
          </motion.p>

          <motion.p
            custom={2.5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-body text-sm text-[#a1a1aa] max-w-sm"
          >
            We serve 5-star food on the street
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 mt-4"
          >
            <Link
              href="/menu"
              className="px-8 py-3 rounded-full bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Order Now
            </Link>
            <a
              href="#combos"
              className="px-8 py-3 rounded-full border border-[#FFD600] text-[#FFD600] font-bold text-sm hover:bg-[#FFD600]/10 active:scale-95 transition-all"
            >
              See Combos
            </a>
          </motion.div>
        </div>
      </section>

      {/* Today's Hits Section */}
      <section id="combos" className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-[#e4e4e7] tracking-wider text-center mb-3">
            TODAY&apos;S HITS
          </h2>
          <p className="text-center text-sm text-[#71717a] font-body mb-10">
            Tap &ldquo;Add to Cart&rdquo; and checkout instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCombos.map((combo, i) => (
            <motion.div
              key={combo.id}
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ComboCard combo={combo} featured />
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#FFD600] text-[#FFD600] font-bold text-sm hover:bg-[#FFD600]/10 active:scale-95 transition-all"
          >
            See Full Menu &amp; All Combos <span aria-hidden="true">&rarr;</span>
          </Link>
        </motion.div>
      </section>

      {/* Why RollRicks Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-[#e4e4e7] tracking-wider text-center mb-10">
            WHY ROLLRICKS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-[#111] border border-[#27272a] p-6 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFD600]/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-[#FFD600]" />
              </div>
              <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider">
                {feature.title.toUpperCase()}
              </h3>
              <p className="text-sm text-[#71717a] font-body">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events Teaser Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto pb-28">
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl bg-[#111] border border-[#27272a] p-8 md:p-12 border-l-4 border-l-[#FFD600]"
        >
          <h2 className="font-display text-4xl md:text-5xl text-[#e4e4e7] tracking-wider mb-4">
            HOSTING AN EVENT?
          </h2>
          <p className="text-[#71717a] font-body max-w-lg mb-8">
            Birthdays, college fests, office parties — we bring the full
            RollRicks cart experience to your venue. Bulk pricing, custom menus,
            and zero hassle.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
          >
            Book Now <span aria-hidden="true">&rarr;</span>
          </Link>
        </motion.div>
      </section>

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
