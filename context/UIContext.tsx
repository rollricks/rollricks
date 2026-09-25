"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { MenuItem } from "@/lib/menu-data";

// Global overlays: the cart drawer and the food-item bottom sheet.
// Both live in LayoutShell so any page (home hits, menu, events) can
// open them without navigating away.
type UIContextType = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  sheetItem: MenuItem | null;
  openItem: (item: MenuItem) => void;
  closeItem: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);

  const openCart = useCallback(() => {
    setSheetItem(null);
    setCartOpen(true);
  }, []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openItem = useCallback((item: MenuItem) => setSheetItem(item), []);
  const closeItem = useCallback(() => setSheetItem(null), []);

  return (
    <UIContext.Provider value={{ cartOpen, openCart, closeCart, sheetItem, openItem, closeItem }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextType {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
