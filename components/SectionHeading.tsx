import type { ReactNode } from "react";

// Handwritten eyebrow + serif headline, the pairing used on the
// RollRicks menu and story creatives.
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
      {eyebrow && <p className="font-hand text-2xl text-gold leading-none mb-2">{eyebrow}</p>}
      <h2 className="font-display font-black text-4xl sm:text-5xl text-ink leading-[1.05] tracking-tight">{title}</h2>
      {sub && <p className="mt-3 text-soft text-base leading-relaxed">{sub}</p>}
    </div>
  );
}
