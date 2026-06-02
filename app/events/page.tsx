"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { generateEventWhatsApp, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { CheckCircle2, Cake, Users, Star, Sparkles, Camera } from "lucide-react";

// ─── Image library ──────────────────────────────────────────
const IMG = {
  birthdayKids:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=75",
  birthdayCake:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=75",
  birthdayMilestone:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=75",
  wedding:
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=75",
  collegeFest:
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=900&q=75",
  office:
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=75",
  houseParty:
    "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=900&q=75",
  engagement:
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=900&q=75",
  hero:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=75",
  cart:
    "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=75",
};

// ─── Birthday concepts ───────────────────────────────────────
//
// Intentionally NO fixed inclusion lists or hard caps. Each birthday
// is custom-quoted on a quick call so we can flex the menu (kids
// portions, dietary mix, photo corner, signage, hours) to whatever
// the host actually wants. Showing "Starting from ₹X+" sets the
// floor without commoditising the offering — a paint-by-numbers
// price list trains customers to compare us with caterers on per-
// roll cost. We compete on experience.
const birthdayPackages = [
  {
    icon: Cake,
    tier: "KIDS BIRTHDAY",
    name: "MINI ROCKSTAR",
    people: "Up to 25 kids",
    image: IMG.birthdayKids,
    pitch:
      "Mini-size rolls, fruity mojitos, balloons on the cart and a custom name signage so the birthday star is the star of the cart.",
    highlight: "Kid-safe portions · No caffeine",
  },
  {
    icon: Sparkles,
    tier: "TEEN / SWEET 16",
    name: "INSTA-WORTHY",
    people: "30–50 guests",
    image: IMG.birthdayCake,
    pitch:
      "Reel-ready cart with fairy lights, full bestseller menu, custom name signage and a photo backdrop. Designed to look insane on stories.",
    highlight: "★ Most booked teen package",
  },
  {
    icon: Star,
    tier: "MILESTONE",
    name: "THE BIG DAY",
    people: "50+ guests",
    image: IMG.birthdayMilestone,
    pitch:
      "Live tandoor on-site, full menu unlocked, branded cart, 2 helpers + chef. The kind of party people still talk about months later.",
    highlight: "Custom branding · Tandoor live counter",
  },
];

// ─── Event type cards with images (replaces text chips) ─────
const eventTypes = [
  { label: "Birthday Parties", image: IMG.birthdayCake, popular: true },
  { label: "House Parties", image: IMG.houseParty, popular: false },
  { label: "College Fests", image: IMG.collegeFest, popular: true },
  { label: "Office Events", image: IMG.office, popular: false },
  { label: "Weddings", image: IMG.wedding, popular: false },
  { label: "Engagement", image: IMG.engagement, popular: false },
];

// ─── General event packages (existing, with images added) ───
const packages = [
  {
    tier: "STARTER",
    name: "THE STARTER",
    people: "40–50 people",
    occasion: "Small gatherings",
    price: "5,999",
    image: IMG.houseParty,
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
  {
    tier: "STANDARD",
    name: "THE STANDARD",
    people: "80–100 people",
    occasion: "Birthdays + house parties",
    price: "11,999",
    image: IMG.cart,
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
    tier: "PREMIUM",
    name: "THE FULL DEPLOY",
    people: "150+ people",
    occasion: "Weddings + big events",
    price: "21,999+",
    image: IMG.wedding,
    includes: [
      "Unlimited rolls + tandoor",
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
];

const addOns = [
  {
    icon: Cake,
    title: "Custom Birthday Signage",
    price: "+₹999",
    description: "Name + age on the cart, balloons, ribbons",
  },
  {
    icon: Camera,
    title: "Reel-Ready Setup",
    price: "+₹499",
    description: "Fairy lights + content-ready corner",
  },
  {
    icon: Users,
    title: "Extra Helper",
    price: "+₹799",
    description: "Faster service for bigger crowds",
  },
  {
    icon: Star,
    title: "Premium Live Counter",
    price: "+₹1,499",
    description: "Tandoor on-site, food cooked in front of guests",
  },
];

// ─── Quick "why us" stats ───────────────────────────────────
const whyUs = [
  { stat: "100+", label: "Events catered" },
  { stat: "30 min", label: "Setup time" },
  { stat: "0", label: "Hidden charges" },
  { stat: "5★", label: "Avg rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
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

  function pickPackage(label: string) {
    setForm((prev) => ({ ...prev, eventType: label }));
    // Scroll to the enquiry form so the customer sees their selection landed.
    document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" });
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
      const { error } = await supabase.from("event_enquiries").insert({
        name: form.name.trim(),
        phone: cleanPhone,
        package: form.eventType,
        event_date: form.eventDate || null,
        guests: form.guestCount ? Number(form.guestCount) : null,
        notes: form.notes.trim() || null,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase save failed, continuing to WhatsApp:", err);
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
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative px-4 pt-16 pb-12 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG.hero}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/70 via-[#09090b]/85 to-[#09090b]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
          <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider">
            Now booking events in Jabalpur
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-7xl text-[#FFD600] tracking-wider leading-tight"
        >
          YOUR PARTY.
          <br />
          OUR ROLLS.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#a1a1aa] font-body mt-5 max-w-xl mx-auto text-lg"
        >
          Birthdays, weddings, college fests — we bring the live roll counter
          experience to your venue. Hot, fresh, and unforgettable.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          href="#enquiry"
          className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-[#FFD600] text-[#09090b] font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
        >
          Book your event →
        </motion.a>

        {/* Why us stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-4 gap-3 mt-12 max-w-2xl mx-auto"
        >
          {whyUs.map((w) => (
            <motion.div
              key={w.label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <span className="font-display text-2xl md:text-3xl text-[#FFD600]">
                {w.stat}
              </span>
              <span className="text-[10px] md:text-xs text-[#71717a] font-body uppercase tracking-wider mt-0.5 text-center">
                {w.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── EVENT TYPES GALLERY ─────────────────────────── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-[#e4e4e7] tracking-wider text-center mb-2"
        >
          WHAT WE CATER
        </motion.h2>
        <p className="text-center text-sm text-[#71717a] font-body mb-8">
          Tap any event type to start your booking
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {eventTypes.map((evt) => (
            <motion.button
              key={evt.label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              onClick={() => pickPackage(evt.label)}
              className="group relative h-32 md:h-40 rounded-2xl overflow-hidden border border-[#27272a] hover:border-[#FFD600]/60 transition-all active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={evt.image}
                alt={evt.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
              {evt.popular && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#FFD600] text-[#09090b] text-[9px] font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}
              <span className="absolute bottom-3 left-3 right-3 font-display text-lg md:text-xl text-white tracking-wider text-left leading-tight">
                {evt.label.toUpperCase()}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ─── BIRTHDAY SPECIAL SECTION (NEW) ──────────────── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B9D]/10 border border-[#FF6B9D]/30">
            <Cake className="w-3.5 h-3.5 text-[#FF6B9D]" />
            <span className="text-[10px] font-bold text-[#FF6B9D] uppercase tracking-wider">
              Birthday Specials
            </span>
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-[#e4e4e7] tracking-wider text-center mb-2"
        >
          MAKE BIRTHDAYS UNFORGETTABLE
        </motion.h2>
        <p className="text-center text-sm text-[#71717a] font-body mb-8 max-w-md mx-auto">
          Curated birthday packages with rolls, drinks, decor and live counter — guests remember the food, you remember the smiles.
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {birthdayPackages.map((pkg) => {
            const Icon = pkg.icon;
            const whatsappMsg = `Hi RollRicks! 🎂 I want to book the ${pkg.name} (${pkg.tier}) birthday package for ${pkg.people}. Please share details.`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;
            return (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-[#111] border border-[#27272a] overflow-hidden flex flex-col hover:border-[#FF6B9D]/40 transition-colors"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#09090b]/85 backdrop-blur">
                    <Icon className="w-3 h-3 text-[#FF6B9D]" />
                    <span className="text-[9px] font-bold text-[#FF6B9D] uppercase tracking-wider">
                      {pkg.tier}
                    </span>
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-display text-2xl text-[#e4e4e7] tracking-wider leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">{pkg.people}</p>
                  </div>

                  {/* Pitch (the sell, not the spec sheet) */}
                  <p className="text-sm text-[#d4d4d8] font-body leading-relaxed">
                    {pkg.pitch}
                  </p>

                  {/* Highlight chip */}
                  <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B9D]/10 border border-[#FF6B9D]/30">
                    <Sparkles className="w-3 h-3 text-[#FF6B9D]" />
                    <span className="text-[10px] font-bold text-[#FF6B9D] uppercase tracking-wider">
                      {pkg.highlight}
                    </span>
                  </span>

                  {/* Pricing intentionally hidden — every birthday is
                      quoted on a quick call so we can flex the menu,
                      decor, hours and headcount to what the host
                      actually wants. Showing a number anchors people on
                      cost; hiding it sells the experience. */}
                  <div className="pt-3 border-t border-[#27272a] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FF6B9D]/15 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-[#FF6B9D]" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#71717a] font-body">
                        Fully Custom
                      </p>
                      <p className="text-sm text-[#e4e4e7] font-body font-medium">
                        Quote on call · Pay after event
                      </p>
                    </div>
                  </div>

                  {/* Big WhatsApp CTA — primary conversion path */}
                  <div className="mt-auto pt-2 flex flex-col gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                    >
                      <svg viewBox="0 0 32 32" fill="white" className="w-4 h-4">
                        <path d="M16.004 3.2C9.002 3.2 3.31 8.89 3.307 15.895c-.001 2.24.584 4.426 1.694 6.352L3.2 28.8l6.72-1.762a12.67 12.67 0 006.076 1.548h.005c7 0 12.693-5.692 12.696-12.695a12.62 12.62 0 00-3.72-8.977A12.62 12.62 0 0016.004 3.2z" />
                      </svg>
                      Get custom quote
                    </a>
                    <button
                      onClick={() => pickPackage(`Birthday — ${pkg.name}`)}
                      className="w-full py-2 rounded-xl border border-[#27272a] text-[#a1a1aa] text-xs font-body hover:border-[#FF6B9D]/50 hover:text-[#FF6B9D] transition-all"
                    >
                      Or share details via form →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust strip — "we'll respond fast" */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#71717a] font-body"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Replies in under 10 min
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            No advance — pay after the event
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            Free menu tasting for 50+ guest bookings
          </span>
        </motion.div>
      </section>

      {/* ─── GENERAL EVENT PACKAGES ──────────────────────── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl text-[#FFD600] tracking-wider text-center mb-2"
        >
          ALL EVENT PACKAGES
        </motion.h2>
        <p className="text-center text-sm text-[#71717a] font-body mb-8">
          Pick the tier that fits your crowd
        </p>
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
              className={`relative rounded-2xl bg-[#111] overflow-hidden flex flex-col border ${
                pkg.highlight
                  ? "border-[#FFD600] shadow-[0_0_30px_rgba(255,214,0,0.12)]"
                  : "border-[#27272a]"
              }`}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                {pkg.badge && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FFD600] text-[#09090b] text-[10px] font-bold uppercase tracking-wider">
                    {pkg.badge}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <p className="text-[#52525b] text-[10px] font-bold uppercase tracking-widest font-body">
                  {pkg.tier}
                </p>
                <h3 className="font-display text-3xl text-[#e4e4e7] tracking-wider">
                  {pkg.name}
                </h3>
                <p className="text-[#a1a1aa] text-xs font-body">
                  {pkg.people}
                  {pkg.occasion && (
                    <span className="text-[#71717a]"> · {pkg.occasion}</span>
                  )}
                </p>
                <p className="font-display text-4xl text-[#FFD600]">
                  ₹{pkg.price}
                </p>

                <ul className="space-y-1.5 pt-3 border-t border-[#27272a]">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs font-body text-[#a1a1aa]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => pickPackage(`${pkg.name} package`)}
                  className={`mt-auto pt-4 w-full py-2.5 rounded-xl font-bold text-sm active:scale-[0.97] transition-all ${
                    pkg.highlight
                      ? "bg-[#FFD600] text-[#09090b] hover:brightness-110"
                      : "bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46]"
                  }`}
                >
                  Pick this package →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── ADD-ONS ─────────────────────────────────────── */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl text-[#FFD600] tracking-wider text-center mb-2"
        >
          ADD-ONS
        </motion.h2>
        <p className="text-center text-sm text-[#71717a] font-body mb-6">
          Stack on extras for that final touch
        </p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {addOns.map((addon) => {
            const Icon = addon.icon;
            return (
              <motion.div
                key={addon.title}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 rounded-xl bg-[#111] border border-[#27272a] p-4 hover:border-[#FFD600]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FFD600]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FFD600]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-display text-base text-[#e4e4e7] tracking-wider truncate">
                      {addon.title}
                    </h4>
                    <span className="font-mono text-sm text-[#FFD600] flex-shrink-0">
                      {addon.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#71717a] font-body mt-0.5">
                    {addon.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ─── ENQUIRY FORM ────────────────────────────────── */}
      <section id="enquiry" className="px-4 pb-20 max-w-lg mx-auto scroll-mt-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl text-[#FFD600] tracking-wider text-center mb-2"
        >
          BOOK YOUR EVENT
        </motion.h2>
        <p className="text-center text-sm text-[#71717a] font-body mb-6">
          We&apos;ll confirm everything on WhatsApp within minutes
        </p>

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

          {/* Event Type — now also accepts free text from "pickPackage" */}
          <div className="relative">
            <input
              type="text"
              placeholder="Event type * (e.g., Birthday, Wedding)"
              value={form.eventType}
              onChange={(e) => updateField("eventType", e.target.value)}
              required
              list="event-type-options"
              className="w-full px-4 py-3.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:border-[#FFD600] focus:outline-none text-[#e4e4e7] font-body placeholder:text-[#52525b] transition-colors"
            />
            <datalist id="event-type-options">
              <option value="Birthday — MINI ROCKSTAR" />
              <option value="Birthday — INSTA-WORTHY" />
              <option value="Birthday — THE BIG DAY" />
              <option value="House Party" />
              <option value="College Fest" />
              <option value="Office Event" />
              <option value="Wedding" />
              <option value="Engagement" />
              <option value="Other" />
            </datalist>
          </div>

          {/* Date + Guests row */}
          <div className="grid grid-cols-2 gap-3">
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

          {formError && (
            <p className="text-[#E53935] text-sm font-body">{formError}</p>
          )}

          {success && (
            <div className="rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 text-center">
              <p className="text-[#22C55E] font-body font-medium">
                Enquiry sent! We&apos;ll get back to you on WhatsApp.
              </p>
            </div>
          )}

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

          {/* Quick WhatsApp shortcut */}
          <div className="text-center pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hi RollRicks! I want to book the cart for my event."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#71717a] hover:text-[#22C55E] underline transition-colors"
            >
              Or just message us directly on WhatsApp →
            </a>
          </div>
        </motion.form>
      </section>
    </main>
  );
}
