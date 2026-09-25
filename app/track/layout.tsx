import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your RollRicks order live with the phone number you ordered with.",
  alternates: { canonical: "/track/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
