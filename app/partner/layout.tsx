import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With RollRicks — Build a Food Cart With Us",
  description:
    "RollRicks is building toward a network of modern street-food carts. You bring the drive, we bring the brand, menu, training and technology. Send a partnership enquiry.",
  alternates: { canonical: "/partner/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
