import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import LayoutShell from "@/components/LayoutShell";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RollRicks — Jo Dil Se Banata Hai, Vo Dil Tak Jaata Hai",
  description:
    "We serve 5-star food on the street! Order the crispiest, cheesiest rolls in Jabalpur online. Combos, tandoor specials, Chinese corner & more. Pickup or delivery — RollRicks has you covered.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} bg-[#09090b] text-[#e4e4e7] font-body min-h-screen`}
      >
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
