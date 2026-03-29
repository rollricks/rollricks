"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { generateEventWhatsApp, WHATSAPP_NUMBER } from "@/lib/whatsapp";

const packages = [
  {
    tier: "PREMIUM",
    name: "THE FULL DEPLOY",
    people: "150+ people",
    occasion: "Weddings",
    price: "21,999+",
    includes: [
      "Unlimited rolls",
      "Full drinks menu",
      "Live branded cart",
      "5+ hr service",
      "2 helpers + chef",
      "Custom signage",
      "Photo-ready decor",
    ],
    badge: null,
    highlight: false,
  },
  {
    tier: "STANDARD",
    name: "THE STANDARD",
    people: "80\u2013100 people",
    occasion: null,
    price: "11,999",
    includes: [
      "100 Rolls",
      "50 drinks",
      "Live counter setup",
      "3 hr service",
      "Branded packaging",
      "1 helper",
    ],
    badge: "Most Popular",
    highlight: true,
  },
  {
    tier: "BASIC",
    name: "THE STARTER",
    people: "40\u201350 people",
    occasion: null,
    price: "5,999",
    includes: [
      "50 Rolls",
      "25 drinks",
      "Basic setup",
      "1.5 hr service",
      "Eco packaging",
    ],
    badge: null,
    highlight: false,
  },
];

const addOns = [
  {
    title: "Birthday Special",
    price: "+\u20B9999",
    description: "Custom signage on cart",
  },
  {
    title: "Reel-Ready Setup",
    price: "+\u20B9499",
    description: "Content-ready corner with lights",
  },
];

const eventTypes = [
  "Birthday Parties",
  "College Fests",
  "Office Events",
  "Weddings",
  "Private Bookings",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function EventsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    const cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!form.eventType) {
      setFormError("Please select an event type.");
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "event_enquiries"), {
        name: form.name.trim(),
        phone: cleanPhone,
        eventType: form.eventType,
        eventDate: form.eventDate || null,
        guestCount: form.guestCount ? Number(form.guestCount) : null,
        notes: form.notes.trim() || null,
        createdAt: Timestamp.now(),
      });
    } catch (err) {
      console.warn("Firebase save failed, continuing to WhatsApp:", err);
    }

    const whatsappUrl = generateEventWhatsApp({
      name: form.name.trim(),
      eventType: form.eventType,
      date: form.eventDate || "TBD",
      guests: form.guestCount ? Number(form.guestCount) : 0,
      phone: cleanPhone,
      notes: form.notes.trim() || undefined,
    });

    window.open(whatsappUrl, "_blank");
    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-[#e4e4e7]">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-7xl text-[#FFD600] tracking-wider leading-tight"
        >
          YOUR PARTY. OUR ROLLS.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#a1a1aa] font-body mt-4 max-w-xl mx-auto text-lg"
        >
          From birthdays to weddings, we bring the live roll counter experience
          to your event. Hot, fresh, and unforgettable.
        </motion.p>
      </section>

      {/* Packages */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className={`relative rounded-2xl bg-[#111] p-6 space-y-4 border ${
                pkg.highlight
                  ? "border-[#FFD600] shadow-[0_0_30px_rgba(255,214,0,0.1)]"
                  : "border-[#27272a]"
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD600] text-[#09090b] text-xs font-bold font-body uppercase tracking-wider">
                  {pkg.badge}
                </div>
              )}

              {/* Tier */}
              <p className="text-[#52525b] text-xs font-bold uppercase tracking-widest font-body">
                {pkg.tier}
              </p>

              {/* Name */}
              <h3 className="font-display text-3xl text-[#e4e4e7] tracking-wider">
                {pkg.name}
              </h3>

              {/* People */}
              <p className="text-[#a1a1aa] text-sm font-body">
                {pkg.people}
                {pkg.occasion && (
                  <span className="text-[#71717a]"> &middot; {pkg.occasion}</span>
                )}
              </p>

              {/* Price */}
              <p className="font-display text-4xl text-[#FFD600]">
                ₹{pkg.price}
              </p>

              {/* Includes */}
              <ul className="space-y-2 pt-2 border-t border-[#27272a]">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-body text-[#a1a1aa]"
                  >
                    <span className="text-[#22C55E] mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Add-ons */}
      <section className="px-4 pb-16 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl text-[#FFD600] tracking-wider text-center mb-6"
        >
          ADD-ONS
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {addOns.map((addon) => (
            <motion.div
              key={addon.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-[#111] border border-[#27272a] p-5 space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xl text-[#e4e4e7] tracking-wider">
                  {addon.title}
                </h4>
                <span className="font-display text-lg text-[#FFD600]">
                  {addon.price}
                </span>
              </div>
              <p className="text-sm text-[#71717a] font-body">
                {addon.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* What We Do */}
      <section className="px-4 pb-16 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl text-[#FFD600] tracking-wider mb-6"
        >
          WHAT WE DO
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {eventTypes.map((type) => (
            <motion.span
              key={type}
              variants={fadeUp}
              transition={{ duration: 0.3 }}
              className="px-4 py-2 rounded-full border border-[#27272a] bg-[#18181b] text-sm font-body text-[#a1a1aa] hover:border-[#FFD600] hover:text-[#FFD600] transition-colors"
            >
              {type}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Enquiry Form */}
      <section className="px-4 pb-20 max-w-lg mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl text-[#FFD600] tracking-wider text-center mb-6"
        >
          BOOK YOUR EVENT
        </motion.h2>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Your name *"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
          />

          {/* Phone */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] font-body">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone number *"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                updateField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              required
              className="w-full pl-14 pr-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
            />
          </div>

          {/* Event Type */}
          <select
            value={form.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body transition-colors appearance-none"
          >
            <option value="" disabled>
              Event type *
            </option>
            <option value="Birthday">Birthday</option>
            <option value="College Fest">College Fest</option>
            <option value="Office Event">Office Event</option>
            <option value="Wedding">Wedding</option>
            <option value="Other">Other</option>
          </select>

          {/* Date + Guests row */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => updateField("eventDate", e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body transition-colors"
            />
            <input
              type="number"
              placeholder="Guests"
              min={1}
              value={form.guestCount}
              onChange={(e) => updateField("guestCount", e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
            />
          </div>

          {/* Notes */}
          <textarea
            placeholder="Any special request (optional)"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors resize-none"
          />

          {/* Error */}
          {formError && (
            <p className="text-[#E53935] text-sm font-body">{formError}</p>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 text-center">
              <p className="text-[#22C55E] font-body font-medium">
                Enquiry sent! We&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-[#FFD600] text-[#09090b] font-bold text-lg font-body active:scale-[0.97] transition-all disabled:opacity-50 hover:brightness-110"
          >
            {submitting ? "Sending..." : "Send Enquiry"}
          </button>

          <p className="text-center text-xs text-[#52525b] font-body">
            You&apos;ll be redirected to WhatsApp to confirm your booking
          </p>
        </motion.form>
      </section>
    </main>
  );
}
