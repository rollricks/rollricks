"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X, ShoppingBag, Instagram, MessageCircle, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { BRAND } from "@/lib/site";
import Seal from "./Seal";
import ThemeToggle from "./ThemeToggle";
import StatusPill from "./StatusPill";

const drawerLinks = [
  { href: "/", label: "Home" },
  { href: "/menu/", label: "Menu" },
  { href: "/#story", label: "Our Story" },
  { href: "/events/", label: "Events & Catering" },
  { href: "/partner/", label: "Partner With RollRicks" },
  { href: "/track/", label: "Track Order" },
  { href: "/#find-us", label: "Find Us" },
  { href: "/#faq", label: "FAQ" },
];

const desktopLinks = [
  { href: "/menu/", label: "Menu" },
  { href: "/#story", label: "Story" },
  { href: "/events/", label: "Events" },
  { href: "/partner/", label: "Partner" },
  { href: "/track/", label: "Track" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { openCart } = useUI();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-base/85 backdrop-blur-md border-b border-line">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-2 px-4 h-16">
          <Link href="/" className="flex items-center gap-2 min-w-0" aria-label="RollRicks home">
            <Seal size={38} />
            <span className="flex flex-col leading-none">
              <span className="font-display font-black text-xl tracking-tight text-gold">ROLLRICKS</span>
              <span className="hidden min-[380px]:block text-[9px] uppercase tracking-[0.25em] text-muted mt-0.5">
                Sealed with Taste
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Main">
            {desktopLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-soft hover:text-gold transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <StatusPill compact className="hidden sm:inline-flex" />
            <Link
              href="/menu/"
              className="hidden min-[400px]:inline-flex lg:hidden items-center h-9 px-3 text-xs font-bold uppercase tracking-wider text-soft hover:text-gold"
            >
              Menu
            </Link>
            {totalItems > 0 ? (
              <button
                onClick={openCart}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-accent text-on-accent text-xs font-bold uppercase tracking-wider"
                aria-label={`Open cart, ${totalItems} items`}
              >
                <ShoppingBag className="w-4 h-4" /> {totalItems}
              </button>
            ) : (
              <Link
                href="/menu/"
                className="inline-flex items-center h-9 px-4 rounded-full bg-accent text-on-accent text-xs font-bold uppercase tracking-wider hover:brightness-110"
              >
                Order
              </Link>
            )}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-raised transition-colors text-ink"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <div className="h-16" />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed z-[71] inset-y-0 right-0 w-[86%] max-w-sm bg-card border-l border-line flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-line">
                <StatusPill compact />
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-raised text-ink"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Site">
                {drawerLinks.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-3.5 rounded-xl font-display font-bold text-xl text-ink hover:bg-raised hover:text-gold transition-colors"
                    >
                      {l.label}
                      <ChevronRight className="w-4 h-4 text-muted" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-5 py-4 border-t border-line space-y-3" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}>
                <div className="flex gap-2">
                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] text-white text-sm font-bold"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-line text-ink text-sm font-bold"
                  >
                    <Instagram className="w-4 h-4" /> @{BRAND.instagram}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-hand text-xl text-gold">Roll. Eat. Repeat.</span>
                  <ThemeToggle withLabel />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
