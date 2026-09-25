"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// Day = "menu card" (parchment), Night = "cart at night".
export default function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    setTheme(t === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rr-theme", next);
    } catch {
      // storage unavailable — theme still applies for this visit
    }
    setTheme(next);
  };

  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to night mode" : "Switch to day mode"}
      className="inline-flex items-center gap-2 h-9 px-2.5 rounded-full border border-line bg-raised/60 text-soft hover:text-gold transition-colors"
    >
      <span className="relative w-4 h-4">
        <Sun className={`absolute inset-0 w-4 h-4 transition-all ${isLight ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`} />
        <Moon className={`absolute inset-0 w-4 h-4 transition-all ${isLight ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`} />
      </span>
      {withLabel && <span className="text-sm font-medium">{isLight ? "Day mode" : "Night mode"}</span>}
    </button>
  );
}
