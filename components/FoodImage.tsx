import type { MenuItem, Section } from "@/lib/menu-data";
import { SECTIONS } from "@/lib/menu-data";

// Real photo when we have one; otherwise a branded parchment tile
// (seal watermark + section glyph) rather than a stock photo.
export default function FoodImage({
  item,
  className = "",
  eager = false,
}: {
  item: Pick<MenuItem, "name" | "image" | "section">;
  className?: string;
  eager?: boolean;
}) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image}
        alt={item.name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  const emoji = SECTIONS.find((s) => s.key === (item.section as Section))?.emoji ?? "🍽️";
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-raised to-card ${className}`}
      role="img"
      aria-label={item.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/brand/seal-96.webp" alt="" className="absolute right-2 bottom-2 w-10 h-10 opacity-20" />
      <span className="text-4xl" aria-hidden="true">{emoji}</span>
      <span className="font-hand text-lg text-gold leading-none px-3 text-center">{item.name}</span>
    </div>
  );
}
