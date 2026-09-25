"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { MenuItem } from "./menu-data";

// Admin-controlled availability from Supabase `menu_config`, kept live
// over Realtime. Same source the /admin Menu Control tab writes to.
export function useMenuAvailability() {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.from("menu_config").select("item_id, available");
      if (error || !active) return;
      const config: Record<string, boolean> = {};
      (data ?? []).forEach((row) => {
        if (typeof row.available === "boolean") config[row.item_id] = row.available;
      });
      setAvailability(config);
    }

    load();

    const channel = supabase
      .channel("menu_config-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_config" }, () => load())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const withAvailability = useCallback(
    (item: MenuItem): MenuItem => ({
      ...item,
      available: availability[item.id] !== undefined ? availability[item.id] : item.available,
    }),
    [availability]
  );

  return { availability, withAvailability };
}
