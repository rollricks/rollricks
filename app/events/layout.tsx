import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Catering — Bring RollRicks to Your Party",
  description:
    "Live RollRicks food cart for birthdays, college fests, office parties and private events in Jabalpur. Per-plate packages, veg & non-veg menus.",
  alternates: { canonical: "/events/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
