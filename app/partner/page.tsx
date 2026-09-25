"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChefHat,
  GraduationCap,
  Megaphone,
  MonitorSmartphone,
  Package,
  Smile,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const brings = [
  { icon: BadgeCheck, title: "Brand", text: "The RollRicks name, seal, cart look and packaging." },
  { icon: BookOpen, title: "Menu & recipes", text: "A tested menu and standard recipes, so every roll tastes the same." },
  { icon: ChefHat, title: "Operations", text: "Daily checklists, prep flow and quality standards." },
  { icon: GraduationCap, title: "Training", text: "Hands-on training for the cart team before and after launch." },
  { icon: MonitorSmartphone, title: "Technology", text: "Online ordering, UPI payments, order tracking and an admin dashboard. The system this site runs on." },
  { icon: Megaphone, title: "Marketing", text: "Instagram, launch creatives, menus and local promotion." },
  { icon: Package, title: "Supply guidance", text: "What to buy, how much, and from where." },
  { icon: Smile, title: "Customer experience", text: "How we serve, package and follow up, the RollRicks way." },
];

const stages = [
  { n: 1, title: "One cart", status: "Today" },
  { n: 2, title: "Local brand", status: "Growing" },
  { n: 3, title: "Events + bulk orders", status: "Growing" },
  { n: 4, title: "Multiple carts", status: "Next" },
  { n: 5, title: "RollRicks partner network", status: "Building toward" },
];

const process = [
  { title: "Send an enquiry", text: "Tell us about yourself, your city and what you have in mind." },
  { title: "We talk", text: "A call to understand each other, with no commitment either way." },
  { title: "Location & plan", text: "We look at the spot, the footfall and how a cart would run there." },
  { title: "Terms & paperwork", text: "Structure, costs and responsibilities are agreed in writing." },
  { title: "Launch together", text: "Cart setup, training and opening night." },
];

const BUDGETS = ["Under ₹2 lakh", "₹2–5 lakh", "₹5–10 lakh", "₹10 lakh+", "Prefer to discuss"];

const DISCLAIMER =
  "Partnership structure, costs and commercial terms are discussed individually and are subject to business and legal documentation. This page is an enquiry form only — RollRicks does not collect money or accept investments on this website.";

// Network graphic: the one real cart, then future nodes drawn dashed.
const nodes = [
  { x: 50, y: 52, label: "RollRicks · Jabalpur", real: true },
  { x: 27, y: 24, label: "Where we go next" },
  { x: 72, y: 20, label: "Future location" },
  { x: 27, y: 68, label: "Future location" },
  { x: 74, y: 66, label: "Your city?" },
];

export default function PartnerPage() {
  const [form, setForm] = useState({ name: "", phone: "", city: "", budget: "", why: "", location: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const phone = form.phone.replace(/\D/g, "").slice(-10);
    if (!form.name.trim()) return setError("Please enter your name.");
    if (phone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
    if (!form.city.trim()) return setError("Please tell us your city.");

    setSubmitting(true);
    try {
      const { error: dbErr } = await supabase.from("partner_enquiries").insert({
        name: form.name.trim().slice(0, 80),
        phone,
        city: form.city.trim().slice(0, 80),
        budget: form.budget || null,
        why: form.why.trim().slice(0, 1000) || null,
        preferred_location: form.location.trim().slice(0, 200) || null,
        message: form.message.trim().slice(0, 2000) || null,
      });
      if (dbErr) throw dbErr;
    } catch (err) {
      // WhatsApp is the fallback channel — the enquiry still reaches us.
      console.warn("partner_enquiries save failed, continuing to WhatsApp:", err);
    }

    const text = `Hi RollRicks! I'm interested in partnering with you 🤝
Name: ${form.name.trim()}
Phone: ${phone}
City: ${form.city.trim()}
Budget (approx): ${form.budget || "—"}
Preferred location: ${form.location.trim() || "—"}
Why: ${form.why.trim() || "—"}
Message: ${form.message.trim() || "—"}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setSubmitting(false);
    setDone(true);
  }

  const input =
    "w-full h-12 px-4 rounded-xl bg-raised border border-line text-ink placeholder:text-muted focus:outline-none focus:border-gold";

  return (
    <div className="overflow-x-clip pb-10">
      {/* Hero */}
      <section data-theme="dark" className="relative bg-[#0E0803] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/story/first-cart.webp" alt="The RollRicks cart" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0803] via-[#0E0803]/70 to-[#0E0803]/30" />
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-14 sm:pt-32 sm:pb-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-3xl text-[#F2C14E]">
            Partner with RollRicks
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 font-display font-black text-5xl sm:text-7xl text-[#FFF8EE] leading-[0.95] tracking-tight"
          >
            One cart.
            <br />
            One brand.
            <br />
            <span className="text-[#F2C14E]">A bigger journey.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-[#E8D5B5] leading-relaxed"
          >
            You don&apos;t have to build a food business from zero. RollRicks is building toward a network of modern food carts, and we&apos;re looking for people who want to build one with us.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#F2C14E] text-[#1A0A00] font-bold text-sm uppercase tracking-wider glow">
              Interested? Talk to us <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how" className="inline-flex items-center h-12 px-6 rounded-full border border-[#F2C14E]/60 text-[#F2C14E] font-bold text-sm uppercase tracking-wider">
              How it works
            </a>
          </motion.div>
        </div>
      </section>

      {/* You bring / we bring */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="The idea is simple"
            title={
              <>
                You bring the drive.
                <br />
                We bring the system.
              </>
            }
            sub="The partner helps bring a RollRicks cart to life. RollRicks brings everything we've learned running our own cart."
          />
        </Reveal>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {brings.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.04} className="rounded-2xl border border-line bg-card p-5">
              <b.icon className="w-7 h-7 text-gold" strokeWidth={1.6} />
              <p className="mt-3 font-display font-bold text-lg text-ink">{b.title}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Network + stages */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal className="relative aspect-square max-w-md w-full mx-auto rounded-3xl border border-line bg-card overflow-hidden dot-grid">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {nodes.slice(1).map((n, i) => (
              <motion.line
                key={i}
                x1={nodes[0].x}
                y1={nodes[0].y}
                x2={n.x}
                y2={n.y}
                stroke="rgb(var(--c-gold))"
                strokeWidth="0.4"
                strokeDasharray="1.5 1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.6 }}
              />
            ))}
          </svg>
          {nodes.map((n, i) => (
            // Outer div owns the centring transform; motion only animates
            // the inner element so it can't overwrite the translate.
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <motion.div
                className="relative flex justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: n.real ? 0.1 : 0.6 + i * 0.3, duration: 0.35 }}
              >
                <span
                  className={`flex items-center justify-center rounded-full ${
                    n.real ? "w-12 h-12 bg-accent text-on-accent glow" : "w-8 h-8 border-2 border-dashed border-gold bg-card"
                  }`}
                >
                  {n.real ? "🛺" : ""}
                </span>
                <span
                  className={`absolute top-full mt-1 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    n.real ? "text-ink" : "text-muted"
                  }`}
                >
                  {n.label}
                </span>
              </motion.div>
            </div>
          ))}
          <p className="absolute bottom-4 inset-x-0 text-center font-hand text-2xl text-gold">Imagine RollRicks in your city.</p>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading eyebrow="Honest roadmap" title="Where we're going" />
          </Reveal>
          <ol className="mt-6 space-y-3">
            {stages.map((s, i) => {
              const future = s.status === "Next" || s.status === "Building toward";
              return (
                <Reveal key={s.n} delay={i * 0.06}>
                  <li
                    className={`flex items-center gap-4 rounded-2xl p-4 border ${
                      future ? "border-dashed border-line-strong" : "border-line bg-card"
                    }`}
                  >
                    <span
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-display font-black ${
                        future ? "border-2 border-gold text-gold" : "bg-accent text-on-accent"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className="flex-1 font-display font-bold text-lg text-ink">{s.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${future ? "text-gold" : "text-muted"}`}>{s.status}</span>
                  </li>
                </Reveal>
              );
            })}
          </ol>
          <p className="mt-4 text-xs text-muted">Stages 4 and 5 are plans, not things we&apos;ve done yet. We&apos;ll grow as fast as we can grow well.</p>
        </div>
      </section>

      {/* Process */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <Reveal>
          <SectionHeading eyebrow="No pressure, no promises" title="How a partnership starts" />
        </Reveal>
        <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {process.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05} className="rounded-2xl border border-line bg-card p-5">
              <span className="font-display font-black text-4xl text-accent/70">0{i + 1}</span>
              <p className="mt-2 font-display font-bold text-lg text-ink">{p.title}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Enquiry form */}
      <section id="enquire" className="max-w-2xl mx-auto px-4 py-10 scroll-mt-20">
        <Reveal className="rounded-3xl border border-line bg-card p-6 sm:p-8">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-veg mx-auto" />
              <h2 className="mt-4 font-display font-black text-3xl text-ink">Thank you, {form.name.split(" ")[0]}!</h2>
              <p className="mt-2 text-soft">
                We&apos;ve got your enquiry and will reach out on WhatsApp or a call. If WhatsApp didn&apos;t open,{" "}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-gold underline">
                  message us here
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <p className="font-hand text-2xl text-gold">Interested?</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">Talk to us</h2>
              <p className="mt-2 text-sm text-soft">Takes a minute. We&apos;ll get back to you personally.</p>
              <form onSubmit={submit} className="mt-6 grid gap-3" noValidate>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={input} placeholder="Your name *" value={form.name} onChange={set("name")} autoComplete="name" maxLength={80} />
                  <input
                    className={input}
                    placeholder="Phone (10 digits) *"
                    value={form.phone}
                    onChange={set("phone")}
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={14}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={input} placeholder="City *" value={form.city} onChange={set("city")} maxLength={80} />
                  <select className={input} value={form.budget} onChange={set("budget")} aria-label="Approximate budget">
                    <option value="">Approximate budget</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <input className={input} placeholder="Preferred location (area / market / campus)" value={form.location} onChange={set("location")} maxLength={200} />
                <textarea
                  className={`${input} h-24 py-3 resize-none`}
                  placeholder="Why are you interested?"
                  value={form.why}
                  onChange={set("why")}
                  maxLength={1000}
                />
                <textarea
                  className={`${input} h-24 py-3 resize-none`}
                  placeholder="Anything else you'd like us to know?"
                  value={form.message}
                  onChange={set("message")}
                  maxLength={2000}
                />
                {error && <p className="text-sm text-nonveg">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 h-12 rounded-xl bg-accent text-on-accent font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 glow disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Send enquiry
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-[11px] leading-relaxed text-muted border-t border-line pt-4">{DISCLAIMER}</p>
        </Reveal>
      </section>
    </div>
  );
}
