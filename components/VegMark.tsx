import type { Diet } from "@/lib/menu-data";

// Indian FSSAI-style veg / non-veg mark: square outline + dot (veg)
// or triangle (non-veg), so it reads even without colour.
export default function VegMark({ type, label = false, size = 14 }: { type: Diet; label?: boolean; size?: number }) {
  const veg = type === "veg";
  return (
    <span className={`inline-flex items-center gap-1.5 ${veg ? "text-veg" : "text-nonveg"}`}>
      <span
        className="inline-flex items-center justify-center rounded-[3px] border-2 border-current bg-card"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {veg ? (
          <span className="rounded-full bg-current" style={{ width: size / 2.4, height: size / 2.4 }} />
        ) : (
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 4}px solid transparent`,
              borderRight: `${size / 4}px solid transparent`,
              borderBottom: `${size / 2.4}px solid currentColor`,
            }}
          />
        )}
      </span>
      {label ? (
        <span className="text-[10px] font-bold uppercase tracking-wider">{veg ? "Veg" : "Non-Veg"}</span>
      ) : (
        <span className="sr-only">{veg ? "Vegetarian" : "Non-vegetarian"}</span>
      )}
    </span>
  );
}
