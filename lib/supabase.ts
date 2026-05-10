import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

declare global {
  // Reuse a single client across hot-reloads in dev, otherwise each
  // edit spawns a new realtime websocket and the old ones leak.
  // eslint-disable-next-line no-var
  var __supabase: SupabaseClient | undefined;
}

export const supabase: SupabaseClient =
  globalThis.__supabase ??
  createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabase = supabase;
}

// ── Shape mappers (snake_case DB → camelCase UI) ──

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRow {
  id: string;
  order_id: string;
  idempotency_key: string | null;
  customer_name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickup_time: string | null;
  payment_method: string | null;
  status: string;
  created_at: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickupTime: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export function rowToOrder(r: OrderRow): Order {
  return {
    id: r.id,
    orderId: r.order_id ?? r.id.slice(0, 8).toUpperCase(),
    customerName: r.customer_name ?? "Customer",
    phone: r.phone ?? "",
    items: Array.isArray(r.items) ? r.items : [],
    total: typeof r.total === "string" ? Number(r.total) : r.total ?? 0,
    pickupTime: r.pickup_time ?? "ASAP",
    paymentMethod: r.payment_method ?? "Cash",
    status: r.status ?? "new",
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}
