"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { UIProvider } from "@/context/UIContext";
import Nav from "./Nav";
import Footer from "./Footer";
import WhatsAppBtn from "./WhatsAppBtn";
import CartBar from "./CartBar";
import CartDrawer from "./CartDrawer";
import ItemSheet from "./ItemSheet";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  // next.config sets trailingSlash:true, so pathname is "/admin/" in
  // production — match on the prefix.
  const isAdmin = pathname.startsWith("/admin");
  const isCheckout = pathname.startsWith("/checkout");

  if (isAdmin) return <main>{children}</main>;

  return (
    // reducedMotion="user" turns transform animations off for visitors
    // with prefers-reduced-motion set.
    <MotionConfig reducedMotion="user">
      <UIProvider>
        <Nav />
        <main className="relative z-[2]">{children}</main>
        {!isCheckout && <Footer />}
        {!isCheckout && <CartBar />}
        <WhatsAppBtn />
        <CartDrawer />
        <ItemSheet />
      </UIProvider>
    </MotionConfig>
  );
}
