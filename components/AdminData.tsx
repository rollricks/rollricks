"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Admin-only "Enquiries & Data" tab: event + partner enquiries, and
// one-tap CSV exports of everything (orders, enquiries) so the owner
// always has their own copy of the business data. Reads go through the
// admin RLS policies — this only works when signed in as the admin.

type Row = Record<string, unknown>;

function toCsv(rows: Row[]): string {
  if (!rows.length) return "";
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const cell = (v: unknown) => {
    const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

function download(name: string, rows: Row[]) {
  // BOM so Excel opens ₹ / Hindi text correctly
  const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rollricks-${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const fmt = (iso: unknown) =>
  typeof iso === "string"
    ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "";

export default function AdminData() {
  const [events, setEvents] = useState<Row[]>([]);
  const [partners, setPartners] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const [e, p] = await Promise.all([
      supabase.from("event_enquiries").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("partner_enquiries").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (e.error || p.error) setError((e.error || p.error)?.message ?? "Could not load enquiries");
    setEvents(e.data ?? []);
    setPartners(p.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function exportTable(table: "orders" | "event_enquiries" | "partner_enquiries") {
    setExporting(table);
    const all: Row[] = [];
    // page through in chunks so large tables still export fully
    for (let from = 0; ; from += 1000) {
      const { data, error: err } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: true })
        .range(from, from + 999);
      if (err) {
        setError(err.message);
        break;
      }
      all.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    if (all.length) download(table, all);
    setExporting(null);
  }

  const card = "rounded-xl bg-card border border-line";

  return (
    <section className="space-y-5 pb-12">
      <div className={`${card} p-4`}>
        <p className="text-sm font-semibold text-ink">Download your data</p>
        <p className="text-xs text-muted mt-0.5">CSV files open in Excel / Google Sheets. Keep a copy every month.</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              ["orders", "All orders"],
              ["event_enquiries", "Event enquiries"],
              ["partner_enquiries", "Partner enquiries"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => exportTable(t)}
              disabled={!!exporting}
              className="flex items-center justify-center gap-2 h-11 rounded-lg bg-accent text-on-accent text-sm font-bold disabled:opacity-60"
            >
              {exporting === t ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-nonveg">{error}</p>}

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">Partner enquiries ({partners.length})</h3>
        <button onClick={load} className="flex items-center gap-1 text-xs text-soft" aria-label="Refresh">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <div className={`${card} divide-y divide-line`}>
        {partners.length === 0 && <p className="px-4 py-3 text-sm text-muted">{loading ? "Loading…" : "No partner enquiries yet."}</p>}
        {partners.map((r) => (
          <div key={String(r.id)} className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">
                {String(r.name ?? "")}
                {!!r.interest && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-gold text-[10px] font-bold uppercase">
                    {r.interest === "own-cart" ? "Own cart" : r.interest === "idea-check" ? "Idea check" : "Exploring"}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted">{fmt(r.created_at)}</span>
            </div>
            <p className="text-soft">
              <a href={`tel:+91${r.phone}`} className="text-gold underline">{String(r.phone ?? "")}</a> · {String(r.city ?? "")}
              {r.budget ? ` · ${r.budget}` : ""}
              {r.preferred_location ? ` · ${r.preferred_location}` : ""}
            </p>
            {!!r.why && <p className="text-xs text-muted mt-1">Why: {String(r.why)}</p>}
            {!!r.message && <p className="text-xs text-muted mt-0.5">{String(r.message)}</p>}
          </div>
        ))}
      </div>

      <h3 className="font-display text-lg text-ink">Event enquiries ({events.length})</h3>
      <div className={`${card} divide-y divide-line`}>
        {events.length === 0 && <p className="px-4 py-3 text-sm text-muted">{loading ? "Loading…" : "No event enquiries yet."}</p>}
        {events.map((r) => (
          <div key={String(r.id)} className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">{String(r.name ?? "")}</span>
              <span className="text-xs text-muted">{fmt(r.created_at)}</span>
            </div>
            <p className="text-soft">
              <a href={`tel:+91${r.phone}`} className="text-gold underline">{String(r.phone ?? "")}</a> · {String(r.package ?? "")}
              {r.event_date ? ` · ${r.event_date}` : ""}
              {r.guests ? ` · ${r.guests} guests` : ""}
            </p>
            {!!r.notes && <p className="text-xs text-muted mt-1">{String(r.notes)}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
