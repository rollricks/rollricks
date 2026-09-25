import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu — Rolls, Tandoor, Chinese & Drinks",
  description:
    "The full RollRicks menu: veg & non-veg kathi rolls, tandoor tikka, Indo-Chinese, snacks, soups, mojitos and combos. Order online for pickup in Jabalpur.",
  alternates: { canonical: "/menu/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
