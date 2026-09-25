"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { allMenuItems, SECTIONS, type MenuItem as MenuItemType } from "@/lib/menu-data";
import { combos } from "@/lib/combo-data";
import { useMenuAvailability } from "@/lib/useMenuAvailability";
import ComboCard from "@/components/ComboCard";
import MenuItem from "@/components/MenuItem";
import VegMark from "@/components/VegMark";

type DietFilter = "all" | "veg" | "nonveg";

const DIETS: { key: DietFilter; label: string }[] = [
  { key: "veg", label: "Veg" },
  { key: "nonveg", label: "Non-Veg" },
  { key: "all", label: "All" },
];

// Drinks are shared by both menus, so they show under Veg and Non-Veg.
function matchesDiet(item: MenuItemType, diet: DietFilter) {
  if (diet === "all" || item.section === "Drinks") return true;
  return item.type === diet;
}

export default function MenuPage() {
  const { withAvailability } = useMenuAvailability();
  const [diet, setDiet] = useState<DietFilter>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("");
  const chipBarRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<string | null>(null);

  // Deep links from the home page: /menu/?diet=veg, /menu/?section=Tandoor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("diet");
    if (d === "veg" || d === "nonveg") setDiet(d);
    const s = params.get("section");
    if (s) pendingScroll.current = s;
  }, []);

  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const items = allMenuItems
      .map(withAvailability)
      .filter((i) => matchesDiet(i, diet))
      .filter((i) => !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.section.toLowerCase().includes(q));
    return SECTIONS.map((s) => ({ ...s, items: items.filter((i) => i.section === s.key) })).filter((g) => g.items.length > 0);
  }, [withAvailability, diet, q]);

  const visibleCombos = useMemo(
    () =>
      combos.filter((c) => {
        if (diet === "veg" && c.type !== "veg") return false;
        if (diet === "nonveg" && c.type === "veg") return false;
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.items.some((i) => i.name.toLowerCase().includes(q)) || "combos".includes(q);
      }),
    [diet, q]
  );

  const chips = [
    ...(visibleCombos.length ? [{ key: "Combos", emoji: "🎁" }] : []),
    ...groups.map((g) => ({ key: g.key as string, emoji: g.emoji as string })),
  ];

  const scrollTo = (key: string) => {
    const el = document.getElementById(`sec-${key}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64 - (chipBarRef.current?.offsetHeight ?? 0) - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Scroll to ?section= once the sections have rendered
  useEffect(() => {
    if (!pendingScroll.current) return;
    const key = pendingScroll.current;
    pendingScroll.current = null;
    requestAnimationFrame(() => scrollTo(key));
  }, [groups]);

  // Scrollspy: highlight the chip for the section in view
  useEffect(() => {
    const els = chips.map((c) => document.getElementById(`sec-${c.key}`)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("sec-", ""));
      },
      { rootMargin: "-140px 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips.map((c) => c.key).join("|")]);

  // Keep the active chip visible in the horizontal chip scroller
  useEffect(() => {
    if (!active) return;
    document.getElementById(`chip-${active}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  const dietAccent = diet === "veg" ? "bg-veg" : diet === "nonveg" ? "bg-nonveg" : "bg-accent";
  const dietText = diet === "veg" ? "text-veg" : diet === "nonveg" ? "text-nonveg" : "text-gold";
  const total = groups.reduce((s, g) => s + g.items.length, 0) + visibleCombos.length;

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <p className="font-hand text-2xl text-gold">The RollRicks menu card</p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-ink leading-tight">What are you feeling?</h1>
        <label className="relative block mt-4 max-w-md">
          <span className="sr-only">Search the menu</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rolls, tikka, noodles…"
            className="w-full h-11 pl-9 pr-9 rounded-full bg-raised border border-line text-ink placeholder:text-muted focus:outline-none focus:border-gold"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-muted"
              aria-label="Clear search"
              style={{ minHeight: 0 }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
      </header>

      {/* Sticky filters */}
      <div ref={chipBarRef} className="sticky top-16 z-30 bg-base/90 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-2 space-y-3">
          <div className="flex">
            <div role="tablist" aria-label="Diet" className="relative grid grid-cols-3 w-full sm:w-auto p-1 rounded-full bg-raised border border-line">
              {DIETS.map((d) => {
                const on = diet === d.key;
                return (
                  <button
                    key={d.key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setDiet(d.key)}
                    className={`relative z-10 h-9 px-3 sm:px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      on ? "text-white" : "text-soft"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="diet-pill"
                        className={`absolute inset-0 -z-10 rounded-full ${dietAccent}`}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {d.key !== "all" && (
                      <span className={`w-2 h-2 rounded-full ${on ? "bg-white" : d.key === "veg" ? "bg-veg" : "bg-nonveg"}`} />
                    )}
                    <span className={on && d.key === "all" ? "text-on-accent" : ""}>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {chips.map((c) => {
              const on = active === c.key;
              return (
                <button
                  key={c.key}
                  id={`chip-${c.key}`}
                  onClick={() => scrollTo(c.key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors ${
                    on ? "bg-ink text-card border-ink" : "border-line text-soft hover:text-ink"
                  }`}
                >
                  <span aria-hidden="true">{c.emoji}</span> {c.key}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diet banner */}
      {diet !== "all" && (
        <div className="max-w-6xl mx-auto px-4 pt-5">
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              diet === "veg" ? "border-veg/30 bg-veg/5" : "border-nonveg/30 bg-nonveg/5"
            }`}
          >
            <VegMark type={diet} size={18} />
            <p className={`text-sm font-semibold ${dietText}`}>
              {diet === "veg" ? "Veg menu" : "Non-veg menu"}
              <span className="font-normal text-soft"> · veg &amp; non-veg are prepared separately{diet === "nonveg" ? " · drinks shared" : ""}</span>
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {visibleCombos.length > 0 && (
          <section id="sec-Combos" className="pt-8">
            <SectionTitle emoji="🎁" title="Combos" count={visibleCombos.length} sub="Save more with our curated combos" />
            {/* Swipe row on phones so the food sections stay close; grid from sm up */}
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
              {visibleCombos.map((combo) => (
                <div key={combo.id} className="snap-start shrink-0 w-[82%] min-[480px]:w-[60%] sm:w-auto flex">
                  <ComboCard combo={combo} />
                </div>
              ))}
            </div>
          </section>
        )}

        {groups.map((g) => (
          <section key={g.key} id={`sec-${g.key}`} className="pt-10">
            <SectionTitle emoji={g.emoji} title={g.key} count={g.items.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {g.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}

        {total === 0 && (
          <div className="py-20 text-center">
            <p className="font-hand text-3xl text-gold">Hmm, nothing here.</p>
            <p className="mt-2 text-soft">
              No dishes match &ldquo;{query}&rdquo;.{" "}
              <button onClick={() => { setQuery(""); setDiet("all"); }} className="text-gold underline">
                Show the full menu
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ emoji, title, count, sub }: { emoji: string; title: string; count: number; sub?: string }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="font-display font-black text-3xl text-ink">
          <span className="brush">{title}</span>
        </h2>
        {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
      </div>
      <span className="text-xs text-muted flex items-center gap-1.5">
        <span aria-hidden="true">{emoji}</span> {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}
