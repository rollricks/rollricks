"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "./site";

// Status is null during static prerender / first paint so the HTML
// never bakes in a stale "Open now" from build time. It resolves on
// mount and re-checks every minute.
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
}
