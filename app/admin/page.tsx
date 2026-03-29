"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { generateStatusWhatsApp } from "@/lib/whatsapp";
import { allMenuItems } from "@/lib/menu-data";
import OrderCard from "@/components/OrderCard";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
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

const STATUS_TABS = ["All", "New", "Confirmed", "Preparing", "Ready", "Done"];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const [menuAvailability, setMenuAvailability] = useState<
    Record<string, boolean>
  >({});

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    const envAdminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    const envAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // Check against env credentials first
    if (envAdminId && envAdminPassword && adminId.trim() === envAdminId && password === envAdminPassword) {
      setIsLoggedIn(true);
      setLoggingIn(false);
      return;
    }

    // Try Firebase auth as fallback (email + password) with 5s timeout
    try {
      const authPromise = signInWithEmailAndPassword(auth, adminId, password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 5000)
      );
      await Promise.race([authPromise, timeoutPromise]);
      setIsLoggedIn(true);
      setLoggingIn(false);
      return;
    } catch {
      // Firebase auth failed
    }

    setLoginError("Invalid Admin ID or Password.");
    setLoggingIn(false);
  }

  // Listen to orders
  useEffect(() => {
    if (!isLoggedIn) return;

    let unsubscribe: () => void;

    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ordersList: Order[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              orderId: data.orderId ?? d.id.slice(0, 8).toUpperCase(),
              customerName: data.customerName ?? data.name ?? "Customer",
              phone: data.phone ?? "",
              items: data.items ?? [],
              total: data.total ?? 0,
              pickupTime: data.pickupTime ?? "ASAP",
              paymentMethod: data.paymentMethod ?? "Cash",
              status: data.status ?? "new",
              createdAt: data.createdAt?.toDate?.()
                ? data.createdAt.toDate().toISOString()
                : data.createdAt ?? new Date().toISOString(),
            };
          });
          setOrders(ordersList);
        },
        (err) => {
          console.error("Orders listener error:", err);
          setFirebaseError(
            "Firebase not configured. Please add your Firebase credentials to .env.local"
          );
        }
      );
    } catch (err) {
      console.error("Firebase setup error:", err);
      setFirebaseError(
        "Firebase not configured. Please add your Firebase credentials to .env.local"
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn]);

  // Load menu config
  useEffect(() => {
    if (!isLoggedIn) return;

    const defaults: Record<string, boolean> = {};
    allMenuItems.forEach((item) => {
      defaults[item.id] = item.available;
    });

    async function loadMenuConfig() {
      try {
        const snapshot = await getDocs(collection(db, "menu_config"));
        const config: Record<string, boolean> = { ...defaults };
        snapshot.docs.forEach((d) => {
          if (d.data().available !== undefined) {
            config[d.id] = d.data().available;
          }
        });
        setMenuAvailability(config);
      } catch {
        setMenuAvailability(defaults);
      }
    }

    loadMenuConfig();
  }, [isLoggedIn]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter(
      (o) => o.status.toLowerCase() === activeTab.toLowerCase()
    );
  }, [orders, activeTab]);

  // Today's stats
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => {
      try {
        return new Date(o.createdAt).toDateString() === today;
      } catch {
        return false;
      }
    });
    const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = todayOrders.filter(
      (o) => o.status !== "done"
    ).length;
    return { count: todayOrders.length, revenue, pending };
  }, [orders]);

  // Status change handler
  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const orderDoc = orders.find((o) => o.orderId === orderId);
      if (!orderDoc) return;

      await updateDoc(doc(db, "orders", orderDoc.id), {
        status: newStatus,
      });

      if (newStatus === "confirmed" || newStatus === "ready") {
        const whatsappUrl = generateStatusWhatsApp(
          orderId,
          newStatus === "confirmed" ? "Confirmed" : "Ready for Pickup",
          orderDoc.customerName
        );
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  }

  // Menu toggle handler
  async function handleMenuToggle(itemId: string) {
    const newVal = !menuAvailability[itemId];
    setMenuAvailability((prev) => ({ ...prev, [itemId]: newVal }));

    try {
      await setDoc(
        doc(db, "menu_config", itemId),
        { available: newVal },
        { merge: true }
      );
    } catch (err) {
      console.error("Menu toggle failed:", err);
      setMenuAvailability((prev) => ({ ...prev, [itemId]: !newVal }));
    }
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center">
            <h1 className="font-display text-4xl text-[#FFD600] tracking-wider">
              ADMIN
            </h1>
            <p className="text-[#71717a] font-body mt-1 text-sm">
              RollRicks Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
            />

            {loginError && (
              <p className="text-[#E53935] text-sm font-body">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-lg font-body active:scale-[0.97] transition-all disabled:opacity-50 hover:brightness-110"
            >
              {loggingIn ? "Logging in..." : "Login"}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="min-h-screen bg-[#09090b] text-[#e4e4e7]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl text-[#FFD600] tracking-wider">
            ROLLRICKS ADMIN
          </h1>
          <button
            onClick={() => {
              auth.signOut().catch(() => {});
              setIsLoggedIn(false);
            }}
            className="px-4 py-2 rounded-lg border border-[#27272a] text-sm font-body text-[#a1a1aa] hover:border-[#E53935] hover:text-[#E53935] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {firebaseError ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="rounded-xl bg-[#E53935]/10 border border-[#E53935]/30 p-6">
            <p className="text-[#E53935] font-body font-medium text-lg">
              {firebaseError}
            </p>
            <p className="text-[#71717a] font-body text-sm mt-2">
              Add NEXT_PUBLIC_FIREBASE_* environment variables to your
              .env.local file and restart the dev server.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-xs font-body uppercase tracking-wider">
                Today&apos;s Orders
              </p>
              <p className="font-display text-3xl text-[#e4e4e7] mt-1">
                {todayStats.count}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-xs font-body uppercase tracking-wider">
                Today&apos;s Revenue
              </p>
              <p className="font-display text-3xl text-[#FFD600] mt-1">
                ₹{todayStats.revenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-xs font-body uppercase tracking-wider">
                Pending Orders
              </p>
              <p className="font-display text-3xl text-[#e4e4e7] mt-1">
                {todayStats.pending}
              </p>
            </div>
          </motion.div>

          {/* Orders Section */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-[#FFD600] tracking-wider">
              LIVE ORDERS
            </h2>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-[#FFD600] text-[#09090b]"
                      : "bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:border-[#FFD600]/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {filteredOrders.length === 0 ? (
                  <div className="rounded-xl bg-[#111] border border-[#27272a] p-12 text-center">
                    <p className="text-[#71717a] font-body">
                      {orders.length === 0
                        ? "No orders yet. Share your menu link!"
                        : `No ${activeTab.toLowerCase()} orders.`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map((order, idx) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                      >
                        <OrderCard
                          order={order}
                          onStatusChange={handleStatusChange}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Menu Control */}
          <section className="space-y-4 pb-12">
            <h2 className="font-display text-2xl text-[#FFD600] tracking-wider">
              MENU CONTROL
            </h2>

            <div className="rounded-xl bg-[#111] border border-[#27272a] divide-y divide-[#27272a]">
              {allMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        item.type === "veg" ? "bg-[#22C55E]" : "bg-[#E53935]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-body text-[#e4e4e7] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs font-mono text-[#71717a]">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleMenuToggle(item.id)}
                    className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 ${
                      menuAvailability[item.id] !== false
                        ? "bg-[#22C55E]"
                        : "bg-[#27272a]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                        menuAvailability[item.id] !== false
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
