"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import WhatsAppBtn from "./WhatsAppBtn";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";

  return (
    <>
      {!isAdmin && <Nav />}
      <main>{children}</main>
      {!isAdmin && <WhatsAppBtn />}
    </>
  );
}
