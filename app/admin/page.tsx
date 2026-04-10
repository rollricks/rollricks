"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  where,
  Timestamp,
} from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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

type AdminSection = "orders" | "analytics" | "menu";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [firebaseErrorDetail, setFirebaseErrorDetail] = useState<{
    code?: string;
    message?: string;
    authState?: string;
    projectId?: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("orders");

  const [menuAvailability, setMenuAvailability] = useState<
    Record<string, boolean>
  >({});
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const prevOrderCount = useRef(0);
  const isFirstLoad = useRef(true);

  // Play notification sound when new order arrives
  const playNotification = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
      // Second beep
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = "sine";
        gain2.gain.value = 0.3;
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      }, 200);
    } catch {
      // Audio not available
    }
  }, []);

  // Restore session on reload — if Firebase already has a signed-in
  // user (persisted in IndexedDB), skip the login screen.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) setIsLoggedIn(true);
    });
    return () => unsub();
  }, []);

  // Login handler — Firebase email/password only. The old env-var
  // fallback was removed because (a) it bypassed Firestore auth context
  // entirely, leaving rules effectively unenforced, and (b) credentials
  // baked into NEXT_PUBLIC_ vars are visible to anyone who views the
  // page source. Create a real Firebase Auth user in the console.
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const authPromise = signInWithEmailAndPassword(auth, adminId.trim(), password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout — check your connection")), 8000)
      );
      await Promise.race([authPromise, timeoutPromise]);
      setIsLoggedIn(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setLoginError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setLoginError("Too many failed attempts. Try again in a few minutes.");
      } else if (code === "auth/network-request-failed") {
        setLoginError("Network error. Check your internet connection.");
      } else {
        setLoginError((err as Error).message || "Login failed.");
      }
    } finally {
      setLoggingIn(false);
    }
  }

  // Listen to orders. Two cost-saving constraints applied here:
  //   1. Only today's orders — without this, the listener pulls every
  //      order ever for every reload, which would torch the Firestore
  //      free tier the moment volume picked up.
  //   2. The listener auto-detaches when the admin tab is in the
  //      background (visibilitychange) and re-attaches on focus, so
  //      reads aren't billed while the admin isn't looking.
  useEffect(() => {
    if (!isLoggedIn) return;

    let unsubscribe: (() => void) | null = null;

    function parseOrderDoc(d: import("firebase/firestore").QueryDocumentSnapshot): Order {
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
    }

    function captureError(err: unknown, fallbackLabel: string) {
      console.error(fallbackLabel, err);
      const e = err as { code?: string; message?: string };
      setFirebaseErrorDetail({
        code: e.code,
        message: e.message || String(err),
        authState: auth.currentUser
          ? `signed in (${auth.currentUser.isAnonymous ? "anon" : auth.currentUser.email || "user"}, uid=${auth.currentUser.uid.slice(0, 8)})`
          : "not signed in",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      if (e.code === "permission-denied") {
        setFirebaseError(
          "Permission denied — Firestore security rules rejected this read. See debug panel below."
        );
      } else if (e.code === "unauthenticated") {
        setFirebaseError(
          "Not authenticated — admin login did not establish a Firebase auth context."
        );
      } else if (e.code === "failed-precondition") {
        setFirebaseError(
          "Missing Firestore index. Create the suggested index in Firebase console."
        );
      } else {
        setFirebaseError(
          `Could not load orders (${e.code || "unknown error"}). See debug panel below.`
        );
      }
    }

    function attachListener() {
      if (unsubscribe) return; // already attached
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const q = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
          orderBy("createdAt", "desc")
        );
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const ordersList = snapshot.docs.map(parseOrderDoc);
            const newCount = ordersList.filter((o) => o.status === "new").length;
            if (!isFirstLoad.current && newCount > prevOrderCount.current) {
              playNotification();
              setNewOrderAlert(true);
              setTimeout(() => setNewOrderAlert(false), 3000);
            }
            prevOrderCount.current = newCount;
            isFirstLoad.current = false;
            setOrders(ordersList);
            setFirebaseError(null);
            setFirebaseErrorDetail(null);
          },
          (err) => {
            // Fallback: drop the orderBy in case the composite index
            // hasn't been created yet
            if (unsubscribe) {
              unsubscribe();
              unsubscribe = null;
            }
            const fallbackQ = query(
              collection(db, "orders"),
              where("createdAt", ">=", Timestamp.fromDate(startOfDay))
            );
            unsubscribe = onSnapshot(
              fallbackQ,
              (snapshot) => {
                const ordersList = snapshot.docs.map(parseOrderDoc);
                ordersList.sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(ordersList);
                setFirebaseError(null);
                setFirebaseErrorDetail(null);
              },
              (fallbackErr) => captureError(fallbackErr, "Orders fallback error:")
            );
            captureError(err, "Orders listener error:");
          }
        );
      } catch (err) {
        captureError(err, "Firebase setup error:");
      }
    }

    function detachListener() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }

    // Pause the listener while the tab is hidden, resume on focus.
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        attachListener();
      } else {
        detachListener();
      }
    }

    attachListener();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      detachListener();
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
        // menu_config is publicly readable per the rules; no limit
        // needed since it's small (~22 docs).
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
    const completed = todayOrders.filter(
      (o) => o.status === "done"
    ).length;
    const avgOrderValue = todayOrders.length > 0 ? Math.round(revenue / todayOrders.length) : 0;
    return { count: todayOrders.length, revenue, pending, completed, avgOrderValue };
  }, [orders]);

  // Analytics data
  const analytics = useMemo(() => {
    // Top selling items across all orders
    const itemCounts: Record<string, { count: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { count: 0, revenue: 0 };
        }
        itemCounts[item.name].count += item.quantity;
        itemCounts[item.name].revenue += item.price;
      });
    });

    const topSellers = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const maxCount = topSellers[0]?.count ?? 1;

    // Payment method breakdown
    const paymentBreakdown: Record<string, number> = {};
    orders.forEach((o) => {
      const method = o.paymentMethod || "Unknown";
      paymentBreakdown[method] = (paymentBreakdown[method] || 0) + 1;
    });

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    orders.forEach((o) => {
      const s = o.status || "unknown";
      statusBreakdown[s] = (statusBreakdown[s] || 0) + 1;
    });

    // Total revenue all time
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Orders by hour (today)
    const today = new Date().toDateString();
    const hourly: Record<number, number> = {};
    orders.forEach((o) => {
      try {
        const d = new Date(o.createdAt);
        if (d.toDateString() === today) {
          const h = d.getHours();
          hourly[h] = (hourly[h] || 0) + 1;
        }
      } catch { /* skip */ }
    });

    return { topSellers, maxCount, paymentBreakdown, statusBreakdown, totalRevenue, totalOrders, avgOrderValue, hourly };
  }, [orders]);

  // Status change handler
  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const orderDoc = orders.find((o) => o.orderId === orderId);
      if (!orderDoc) return;

      await updateDoc(doc(db, "orders", orderDoc.id), {
        status: newStatus,
      });

      if (newStatus === "confirmed" || newStatus === "ready" || newStatus === "done") {
        const statusLabel =
          newStatus === "confirmed" ? "Confirmed" :
          newStatus === "ready" ? "Ready for Pickup" : "Done";
        const whatsappUrl = generateStatusWhatsApp(
          orderId,
          statusLabel,
          orderDoc.customerName,
          orderDoc.phone
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

  const statusColor: Record<string, string> = {
    new: "#FFD600",
    confirmed: "#3B82F6",
    preparing: "#8B5CF6",
    ready: "#22C55E",
    done: "#71717a",
  };

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
              type="email"
              placeholder="Admin email"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              autoComplete="email"
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
          <h1 className="font-display text-xl text-[#FFD600] tracking-wider">
            ROLLRICKS ADMIN
          </h1>
          <button
            onClick={() => {
              auth.signOut().catch(() => {});
              setIsLoggedIn(false);
            }}
            className="px-3 py-1.5 rounded-lg border border-[#27272a] text-xs font-body text-[#a1a1aa] hover:border-[#E53935] hover:text-[#E53935] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Section Tabs */}
      <div className="sticky top-[52px] z-40 bg-[#09090b]/95 backdrop-blur border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {(["orders", "analytics", "menu"] as AdminSection[]).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all ${
                activeSection === section
                  ? "bg-[#FFD600] text-[#09090b]"
                  : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              {section === "orders" ? "Live Orders" : section === "analytics" ? "Analytics" : "Menu Control"}
            </button>
          ))}
        </div>
      </div>

      {/* New order alert */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl bg-[#22C55E] text-white font-bold text-sm shadow-lg shadow-[#22C55E]/30"
          >
            New Order Received!
          </motion.div>
        )}
      </AnimatePresence>

      {firebaseError ? (
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
          <div className="rounded-xl bg-[#E53935]/10 border border-[#E53935]/30 p-6 text-center">
            <p className="text-[#E53935] font-body font-medium text-lg">
              {firebaseError}
            </p>
          </div>
          {firebaseErrorDetail && (
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-5 font-mono text-xs text-[#a1a1aa] space-y-2">
              <p className="text-[#FFD600] font-bold uppercase tracking-wider text-[10px] font-body">
                Debug info — share with support
              </p>
              <div className="break-all">
                <span className="text-[#71717a]">code:</span>{" "}
                <span className="text-[#e4e4e7]">{firebaseErrorDetail.code || "—"}</span>
              </div>
              <div className="break-all">
                <span className="text-[#71717a]">message:</span>{" "}
                <span className="text-[#e4e4e7]">{firebaseErrorDetail.message || "—"}</span>
              </div>
              <div className="break-all">
                <span className="text-[#71717a]">auth:</span>{" "}
                <span className="text-[#e4e4e7]">{firebaseErrorDetail.authState || "—"}</span>
              </div>
              <div className="break-all">
                <span className="text-[#71717a]">project:</span>{" "}
                <span className="text-[#e4e4e7]">{firebaseErrorDetail.projectId || "(env var missing!)"}</span>
              </div>
              <p className="text-[#71717a] pt-2 font-body">
                {!firebaseErrorDetail.projectId
                  ? "→ NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in Vercel. Add all NEXT_PUBLIC_FIREBASE_* env vars in Vercel → Project Settings → Environment Variables, then redeploy."
                  : firebaseErrorDetail.code === "permission-denied"
                  ? "→ Firestore security rules are blocking reads. Either tighten admin auth (use a real Firebase user instead of env-var fallback) or relax the rules for the orders collection during testing."
                  : firebaseErrorDetail.code === "unauthenticated"
                  ? "→ Anonymous Auth is likely disabled in Firebase Console. Enable it under Authentication → Sign-in method → Anonymous."
                  : "→ Open Firebase Console → Firestore → check if the orders collection has any documents. If empty, the customer write path is failing. If it has docs, share the error code above."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Quick Stats (always visible) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">
                Today&apos;s Orders
              </p>
              <p className="font-display text-2xl text-[#e4e4e7] mt-1">
                {todayStats.count}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">
                Revenue
              </p>
              <p className="font-display text-2xl text-[#FFD600] mt-1">
                ₹{todayStats.revenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">
                Pending
              </p>
              <p className="font-display text-2xl text-[#E53935] mt-1">
                {todayStats.pending}
              </p>
            </div>
            <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
              <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">
                Avg Order
              </p>
              <p className="font-display text-2xl text-[#22C55E] mt-1">
                ₹{todayStats.avgOrderValue}
              </p>
            </div>
          </motion.div>

          {/* ORDERS SECTION */}
          {activeSection === "orders" && (
            <section className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {STATUS_TABS.map((tab) => {
                  const count = tab === "All"
                    ? orders.length
                    : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase()).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        activeTab === tab
                          ? "bg-[#FFD600] text-[#09090b]"
                          : "bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:border-[#FFD600]/50"
                      }`}
                    >
                      {tab}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        activeTab === tab ? "bg-[#09090b]/20" : "bg-[#27272a]"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

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
          )}

          {/* ANALYTICS SECTION */}
          {activeSection === "analytics" && (
            <section className="space-y-6">
              {/* All-time summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
                  <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">Total Orders</p>
                  <p className="font-display text-2xl text-[#e4e4e7] mt-1">{analytics.totalOrders}</p>
                </div>
                <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
                  <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">Total Revenue</p>
                  <p className="font-display text-2xl text-[#FFD600] mt-1">₹{analytics.totalRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-xl bg-[#111] border border-[#27272a] p-4 text-center">
                  <p className="text-[#71717a] text-[10px] font-body uppercase tracking-wider">Avg Order</p>
                  <p className="font-display text-2xl text-[#22C55E] mt-1">₹{analytics.avgOrderValue}</p>
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="rounded-xl bg-[#111] border border-[#27272a] p-5">
                <h3 className="font-display text-lg text-[#FFD600] tracking-wider mb-4">
                  TOP SELLING ITEMS
                </h3>
                {analytics.topSellers.length === 0 ? (
                  <p className="text-[#71717a] text-sm">No order data yet</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {analytics.topSellers.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <span className="text-xs text-[#71717a] w-5 text-right font-mono">
                          #{i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-[#e4e4e7] truncate">{item.name}</span>
                            <span className="text-xs text-[#71717a] font-mono ml-2 flex-shrink-0">
                              {item.count} sold &middot; ₹{item.revenue.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {/* Bar chart */}
                          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / analytics.maxCount) * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 }}
                              className="h-full rounded-full"
                              style={{
                                background: i === 0 ? "#FFD600" : i === 1 ? "#22C55E" : i === 2 ? "#3B82F6" : "#8B5CF6",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Status & Payment Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order Status */}
                <div className="rounded-xl bg-[#111] border border-[#27272a] p-5">
                  <h3 className="font-display text-lg text-[#FFD600] tracking-wider mb-4">
                    ORDER STATUS
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: statusColor[status] || "#71717a" }}
                          />
                          <span className="text-sm capitalize text-[#e4e4e7]">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-[#a1a1aa]">{count}</span>
                          <span className="text-xs text-[#71717a]">
                            ({analytics.totalOrders > 0 ? Math.round((count / analytics.totalOrders) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-xl bg-[#111] border border-[#27272a] p-5">
                  <h3 className="font-display text-lg text-[#FFD600] tracking-wider mb-4">
                    PAYMENT METHODS
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {Object.entries(analytics.paymentBreakdown).map(([method, count]) => (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-sm text-[#e4e4e7] truncate mr-2">{method}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-[#a1a1aa]">{count}</span>
                          <span className="text-xs text-[#71717a]">
                            ({analytics.totalOrders > 0 ? Math.round((count / analytics.totalOrders) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(analytics.paymentBreakdown).length === 0 && (
                      <p className="text-[#71717a] text-sm">No data yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Today's Hourly Orders */}
              <div className="rounded-xl bg-[#111] border border-[#27272a] p-5">
                <h3 className="font-display text-lg text-[#FFD600] tracking-wider mb-4">
                  TODAY&apos;S ORDERS BY HOUR
                </h3>
                {Object.keys(analytics.hourly).length === 0 ? (
                  <p className="text-[#71717a] text-sm">No orders today yet</p>
                ) : (
                  <div className="flex items-end gap-1.5 h-32">
                    {Array.from({ length: 24 }, (_, h) => {
                      const count = analytics.hourly[h] || 0;
                      const maxH = Math.max(...Object.values(analytics.hourly), 1);
                      const height = count > 0 ? Math.max((count / maxH) * 100, 8) : 0;
                      return (
                        <div key={h} className="flex-1 flex flex-col items-center gap-1" title={`${h}:00 — ${count} orders`}>
                          <div className="w-full flex flex-col items-center justify-end h-24">
                            {count > 0 && (
                              <span className="text-[9px] font-mono text-[#a1a1aa] mb-0.5">{count}</span>
                            )}
                            <div
                              className="w-full rounded-t transition-all"
                              style={{
                                height: `${height}%`,
                                backgroundColor: count > 0 ? "#FFD600" : "#27272a",
                                minHeight: count > 0 ? "4px" : "2px",
                              }}
                            />
                          </div>
                          <span className="text-[8px] text-[#71717a] font-mono">
                            {h % 3 === 0 ? `${h}` : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* MENU CONTROL SECTION */}
          {activeSection === "menu" && (
            <section className="space-y-4 pb-12">
              <div className="rounded-xl bg-[#111] border border-[#27272a] divide-y divide-[#27272a]">
                {allMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
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
          )}
        </div>
      )}
    </main>
  );
}
