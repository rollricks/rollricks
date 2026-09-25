"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase, rowToOrder, type OrderRow } from "@/lib/supabase";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import TrackStatus from "@/components/TrackStatus";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickupTime: string;
  paymentMethod: string;
  status: "new" | "confirmed" | "preparing" | "ready" | "done";
  createdAt: string;
}

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // The phone number actually being tracked (set on submit). Keeping it
  // separate from `searching` means the poll below keeps running after
  // the first result lands.
  const [trackedPhone, setTrackedPhone] = useState<string | null>(null);

  useEffect(() => {
    if (!trackedPhone) return;
    const p = trackedPhone;

    setOrders([]);
    setNotFound(false);
    setError(null);

    let active = true;
    let first = true;

    async function fetchOrders() {
      // Phone-scoped lookup (supabase/migrations/002). Customers can no
      // longer read the orders table directly.
      let { data, error: err } = await supabase.rpc("track_orders", { p_phone: p });
      if (err && (err.code === "PGRST202" || err.code === "42883")) {
        // Migration 002 not applied yet — legacy direct read.
        ({ data, error: err } = await supabase
          .from("orders")
          .select("*")
          .eq("phone", p)
          .order("created_at", { ascending: false })
          .limit(20));
      }

      if (!active) return;
      const wasFirst = first;
      first = false;
      setSearching(false);
      setHasSearched(true);

      if (err) {
        console.error("Supabase error:", err);
        if (wasFirst) setError("Tracking not available yet. Contact us on WhatsApp!");
        return;
      }

      const ordersList: OrderData[] = ((data ?? []) as unknown[]).map((r) => rowToOrder(r as OrderRow) as unknown as OrderData);
      if (ordersList.length === 0) {
        setNotFound(true);
        setOrders([]);
        return;
      }
      setOrders(ordersList);
      if (wasFirst) {
        const activeOrder = ordersList.find((o) => o.status !== "done");
        setExpandedOrder(activeOrder?.id ?? ordersList[0]?.id ?? null);
      }
      setNotFound(false);
    }

    fetchOrders();

    // Live-ish updates: re-check every 15s while the tab is visible, and
    // immediately when the customer comes back to the tab.
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") fetchOrders();
    }, 15_000);
    const onVisible = () => document.visibilityState === "visible" && fetchOrders();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [trackedPhone]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.length !== 10) return;
    setSearching(true);
    // Re-submit of the same number still refetches
    setTrackedPhone(null);
    setTimeout(() => setTrackedPhone(phone), 0);
  }

  const statusLabel: Record<string, string> = {
    new: "Received",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    done: "Completed",
  };

  const statusColor: Record<string, string> = {
    new: "#FFD600",
    confirmed: "#3B82F6",
    preparing: "#8B5CF6",
    ready: "#22C55E",
    done: "#71717a",
  };

  function formatTime(iso: string) {
    if (!iso) return "Just now";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "Just now";
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const activeOrders = orders.filter((o) => o.status !== "done");
  const pastOrders = orders.filter((o) => o.status === "done");

  return (
    <main className="min-h-screen bg-base text-ink px-4 py-12">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Title */}
        <motion.div
          initial={false}
          transition={{ duration: 0.5 }}
          className="rise text-center"
        >
          <h1 className="font-display text-5xl md:text-6xl text-gold tracking-wider">
            TRACK ORDER
          </h1>
          <p className="text-soft mt-2 font-body">
            Enter your phone number to find your orders
          </p>
        </motion.div>

        {/* Phone Input Form */}
        <motion.form
          initial={false}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="rise space-y-4"
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-body text-lg">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(val);
              }}
              placeholder="Your 10-digit number"
              className="w-full pl-14 pr-4 py-4 rounded-xl bg-raised border border-line focus:border-gold focus:outline-none text-lg font-body text-ink placeholder:text-muted transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={phone.length !== 10 || searching}
            className="w-full py-4 rounded-xl bg-accent text-on-accent font-bold text-lg font-body active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
          >
            {searching ? "Searching..." : "Find My Orders"}
          </button>
        </motion.form>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {searching && (
            <motion.div
              key="loading"
              initial={false}
              exit={{ opacity: 0 }}
              className="rise space-y-4"
            >
              <div className="h-16 rounded-xl bg-raised animate-pulse" />
              <div className="h-40 rounded-xl bg-raised animate-pulse" />
              <div className="h-10 rounded-xl bg-raised animate-pulse" />
            </motion.div>
          )}

          {/* Orders Found */}
          {!searching && orders.length > 0 && (
            <motion.div
              key="orders"
              initial={false}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rise space-y-6"
            >
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg text-gold tracking-wider">
                    ACTIVE ORDERS ({activeOrders.length})
                  </h2>
                  {activeOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={false}
                      className="rise rounded-xl bg-card border border-line overflow-hidden"
                    >
                      {/* Order header - always visible */}
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-gold font-bold">
                            #{order.orderId}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${statusColor[order.status]}15`,
                              color: statusColor[order.status],
                            }}
                          >
                            {statusLabel[order.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-lg text-gold">
                            ₹{order.total}
                          </span>
                          <span className="text-muted text-xs">
                            {expandedOrder === order.id ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={false}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="rise overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-line">
                              {/* Status tracker */}
                              <div className="pt-4">
                                <TrackStatus status={order.status} />
                              </div>

                              {/* Items */}
                              <ul className="space-y-1.5 pt-2">
                                {order.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center justify-between text-sm font-body"
                                  >
                                    <span className="text-ink">
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="font-mono text-soft">
                                      ₹{item.price}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              {/* Meta */}
                              <div className="grid grid-cols-2 gap-2 text-xs border-t border-line pt-3">
                                <div>
                                  <span className="text-muted">Pickup: </span>
                                  <span className="text-ink">{order.pickupTime}</span>
                                </div>
                                <div>
                                  <span className="text-muted">Payment: </span>
                                  <span className="text-ink">{order.paymentMethod}</span>
                                </div>
                                <div>
                                  <span className="text-muted">Placed: </span>
                                  <span className="text-ink">{formatTime(order.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Past Orders */}
              {pastOrders.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-sm text-muted tracking-wider uppercase">
                    Past Orders ({pastOrders.length})
                  </h2>
                  {pastOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={false}
                      className="rise rounded-xl bg-card border border-line overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-soft">
                            #{order.orderId}
                          </span>
                          <span className="text-[10px] text-muted">
                            {formatTime(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted">
                            ₹{order.total}
                          </span>
                          <span className="text-[10px] text-veg">Done</span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={false}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="rise overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-line">
                              <ul className="space-y-1.5 pt-3">
                                {order.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center justify-between text-sm font-body text-muted"
                                  >
                                    <span>
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="font-mono">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}

              <p className="text-center text-xs text-muted font-body">
                This page updates in real-time. No need to refresh.
              </p>
            </motion.div>
          )}

          {/* Not Found */}
          {!searching && notFound && hasSearched && (
            <motion.div
              key="notfound"
              initial={false}
              exit={{ opacity: 0 }}
              className="rise text-center space-y-4 py-8"
            >
              <div className="text-5xl">🤷</div>
              <p className="text-soft font-body text-lg">
                No orders found for this number
              </p>
              <Link
                href="/menu"
                className="inline-block px-6 py-3 rounded-xl bg-accent text-on-accent font-bold font-body hover:brightness-110 transition-all"
              >
                Place a new order?
              </Link>
            </motion.div>
          )}

          {/* Error */}
          {!searching && error && hasSearched && (
            <motion.div
              key="error"
              initial={false}
              exit={{ opacity: 0 }}
              className="rise text-center space-y-4 py-8"
            >
              <div className="rounded-xl bg-nonveg/10 border border-nonveg/30 p-5">
                <p className="text-nonveg font-body font-medium">
                  {error}
                </p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to track my order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-veg text-white font-bold font-body hover:brightness-110 transition-all"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.105-1.132l-.29-.174-3.012.79.806-2.942-.19-.302A7.96 7.96 0 014 12a8 8 0 1116 0 8 8 0 01-8 8z" />
                </svg>
                Chat on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
