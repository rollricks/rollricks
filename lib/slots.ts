import { supabase } from "./supabase";

// Today's active (non-cancelled) order count per pickup slot label.
// Uses the slot_counts() function (supabase/migrations/002), which
// exposes counts only — no customer data. Falls back to the legacy
// direct read until that migration is applied.
export async function fetchSlotCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const { data, error } = await supabase.rpc("slot_counts");
  if (!error) {
    (data ?? []).forEach((r: { pickup_time: string; n: number }) => {
      if (r.pickup_time) counts[r.pickup_time] = Number(r.n) || 0;
    });
    return counts;
  }
  if (error.code !== "PGRST202" && error.code !== "42883") throw error;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { data: rows } = await supabase
    .from("orders")
    .select("pickup_time, status")
    .gte("created_at", startOfDay.toISOString())
    .limit(200);
  (rows ?? []).forEach((row) => {
    if (row.status === "cancelled" || typeof row.pickup_time !== "string") return;
    counts[row.pickup_time] = (counts[row.pickup_time] || 0) + 1;
  });
  return counts;
}
