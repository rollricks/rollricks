"use client";

import { useOpenStatus } from "@/lib/useOpenStatus";

// Live open/closed status, computed in IST on the client.
export default function StatusPill({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const status = useOpenStatus();

  if (!status) {
    return <span className={`inline-block h-7 w-24 rounded-full bg-raised/60 ${className}`} aria-hidden="true" />;
  }

  const color = status.open ? (status.closingSoon ? "text-gold" : "text-veg") : "text-muted";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${compact ? "px-2 py-0.5" : "px-3 py-1"} ${color} ${className}`}
      style={{ borderColor: "color-mix(in srgb, currentColor 35%, transparent)" }}
      role="status"
    >
      <span className="relative flex w-2 h-2">
        {status.open && <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-60" />}
        <span className={`relative w-2 h-2 rounded-full ${status.open ? "bg-current" : "border border-current"}`} />
      </span>
      <span className={`font-semibold uppercase tracking-wider ${compact ? "text-[10px]" : "text-xs"}`}>
        {status.label}
      </span>
      {!compact && <span className="text-xs text-soft normal-case tracking-normal">· {status.detail}</span>}
    </span>
  );
}
