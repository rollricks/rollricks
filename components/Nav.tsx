"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track" },
  { href: "/events", label: "Events" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-[#09090b]/90 border-b border-[#27272a]">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-[#FFD600] text-2xl tracking-wider select-none"
          >
            ROLLRICKS
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#e4e4e7] hover:text-[#FFD600] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-[#27272a]/50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#e4e4e7]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#FFD600] text-[#09090b] text-[10px] font-bold leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-[#27272a]/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-[#e4e4e7]" />
              ) : (
                <MenuIcon className="w-5 h-5 text-[#e4e4e7]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-[#27272a] bg-[#09090b]/95"
            >
              <div className="flex flex-col px-4 py-3 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm text-[#e4e4e7] hover:text-[#FFD600] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so content isn't hidden behind fixed nav */}
      <div className="h-14" />

      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
