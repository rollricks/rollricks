"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  ChefHat,
  Heart,
  Instagram,
  MapPin,
  Clock,
  MessageCircle,
  Navigation,
  Quote,
} from "lucide-react";
import { hitItems } from "@/lib/menu-data";
import { useMenuAvailability } from "@/lib/useMenuAvailability";
import { BRAND, HOURS, LOCATIONS, addressLine } from "@/lib/site";
import { FAQ } from "@/lib/faq";
import { REVIEWS } from "@/lib/reviews";
import MenuItem from "@/components/MenuItem";
import Seal from "@/components/Seal";
import StatusPill from "@/components/StatusPill";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";
import LoopVideo from "@/components/LoopVideo";
import BrandRibbon from "@/components/BrandRibbon";

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.12 * i, duration: 0.5, ease: "easeOut" } }),
};

const serveTiles = [
  { label: "Rolls", emoji: "🌯", href: "/menu/?section=Rolls" },
  { label: "Tandoor", emoji: "🔥", href: "/menu/?section=Tandoor" },
  { label: "Chinese", emoji: "🥡", href: "/menu/?section=Chinese" },
  { label: "Snacks", emoji: "🌽", href: "/menu/?section=Snacks" },
  { label: "Drinks", emoji: "🥤", href: "/menu/?section=Drinks" },
  { label: "Combos", emoji: "🎁", href: "/menu/?section=Combos" },
];

const steps = [
  { n: "01", title: "Order", text: "Pick your food and a pickup slot." },
  { n: "02", title: "Pay", text: "UPI in one tap, or pay at the cart." },
  { n: "03", title: "Pick up hot", text: "Straight off the tawa, sealed with taste." },
];

const values = [
  { icon: Leaf, title: "Fresh Ingredients", text: "Bought and prepped fresh for every evening." },
  { icon: ShieldCheck, title: "Hygienic Preparation", text: "Veg & non-veg are prepared separately." },
  { icon: ChefHat, title: "Authentic Taste", text: "Tandoor smoke, street masala, big flavours." },
  { icon: Heart, title: "Made With Love", text: "Jo dil se banata hai, vo dil tak jaata hai." },
];

const polaroids: { src: string; label: string; rotate: number; video?: string }[] = [
  { src: "/images/story/first-cart.webp", label: "Our first cart in Jabalpur", rotate: -4 },
  { src: "/videos/prep-poster.webp", video: "/videos/prep.mp4", label: "Freshly prepared with love", rotate: 3 },
  { src: "/images/story/rolls-memories.webp", label: "Rolls that create memories", rotate: -2 },
  { src: "/images/story/happier-people.webp", label: "Good food. Happier people.", rotate: 4 },
];

const journey = [
  { stage: "Started", title: "An idea", text: "Serve food that feels special — no fancy restaurant needed." },
  { stage: "Started", title: "The first cart", text: "One RollRicks cart, one tandoor, one promise." },
  { stage: "Growing", title: "Our people", text: "Regulars, families and friends who keep coming back." },
  { stage: "Growing", title: "Events & bulk orders", text: "Birthdays, fests and office parties." },
  { stage: "Next", title: "More carts", text: "Building toward RollRicks in more neighbourhoods." },
  { stage: "Next", title: "RollRicks network", text: "Partner-run carts on one brand and one system." },
];

const cameraRoll = [
  "/images/food/roll-hd-night.webp",
  "/images/story/happier-people.webp",
  "/images/food/malai-tikka-night.webp",
  "/images/food/chinese-tandoor-mojito.webp",
  "/images/food/fried-chicken-night.webp",
  "/images/story/freshly-prepared.webp",
  "/images/food/tikka-fire.webp",
  "/images/food/roll-night.webp",
];

export default function HomePage() {
  const { withAvailability } = useMenuAvailability();
  const loc = LOCATIONS[0];

  return (
    <div className="overflow-x-clip">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section data-theme="dark" className="relative overflow-hidden bg-[#0E0803]">
        {/* Mobile: the real cart at night, full-bleed. Its lit sign is the logo. */}
        <div className="md:hidden absolute inset-0">
          <LoopVideo
            src="/videos/hero-cart.mp4"
            poster="/videos/hero-cart-poster.webp"
            label="The RollRicks cart lit up at night in Katanga, Jabalpur"
            // This clip has a lot of night sky on top: zoom + lift so the seal
            // and menu lightboxes sit above the headline.
            className="w-full h-full object-cover object-top origin-top scale-125 -translate-y-[21%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0803] from-[18%] via-[#0E0803]/70 via-[38%] to-transparent to-[60%]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0E0803]/70 to-transparent" />
        </div>

        {/* Desktop: warm food spread as a dim backdrop */}
        <div className="hidden md:block absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cart/hero-night.webp"
            alt=""
            className="w-full h-full object-cover opacity-25 blur-[3px] scale-105 kenburns"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0803] via-[#0E0803]/85 to-[#0E0803]/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 min-h-[min(calc(100svh-4rem),880px)] md:min-h-[720px] flex items-end md:items-center md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-10">
          <div className="w-full pb-7 pt-[50svh] md:py-16 max-w-xl">
            <motion.div custom={0} variants={rise} initial="hidden" animate="visible" className="mb-4">
              <StatusPill className="bg-black/50 backdrop-blur" />
            </motion.div>

            <motion.p
              custom={0.5}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="hidden md:block font-display font-black text-7xl lg:text-8xl leading-[0.92] text-[#F2C14E] tracking-tight drop-shadow-[0_4px_24px_rgba(242,193,78,0.25)]"
              aria-hidden="true"
            >
              ROLLRICKS
            </motion.p>
            <motion.p
              custom={0.8}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="hidden md:block mt-2 text-[11px] uppercase tracking-[0.4em] text-[#E8D5B5]"
            >
              Sealed with Taste
            </motion.p>

            <motion.h1
              custom={1}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="md:mt-7 font-display italic font-black text-[2rem] leading-[1.08] sm:text-4xl lg:text-[2.6rem] text-[#FFF8EE] tracking-tight"
            >
              <span className="sr-only">RollRicks — </span>
              &ldquo;Jo Dil Se Banata Hai,
              <br />
              Vo Dil Tak Jaata Hai.&rdquo;
            </motion.h1>
            <motion.p
              custom={1.6}
              variants={rise}
              initial="hidden"
              animate="visible"
              className="mt-2 font-hand text-[1.7rem] leading-none text-[#F2C14E]"
            >
              5-star food. Street-side.
            </motion.p>

            <motion.div custom={2.2} variants={rise} initial="hidden" animate="visible" className="mt-6 grid grid-cols-2 sm:flex gap-3">
              <Link
                href="/menu/"
                className="inline-flex items-center justify-center gap-1.5 h-12 px-4 sm:px-6 whitespace-nowrap rounded-full bg-[#F2C14E] text-[#1A0A00] font-bold text-[13px] sm:text-sm uppercase tracking-wide sm:tracking-wider glow hover:brightness-110 active:scale-95 transition-all"
              >
                Order now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#serve"
                className="inline-flex items-center justify-center h-12 px-4 sm:px-6 whitespace-nowrap rounded-full border border-[#F2C14E]/70 text-[#F2C14E] font-bold text-[13px] sm:text-sm uppercase tracking-wide sm:tracking-wider bg-black/30 backdrop-blur hover:bg-[#F2C14E]/10 active:scale-95 transition-all"
              >
                Explore menu
              </a>
            </motion.div>
            <motion.p custom={2.8} variants={rise} initial="hidden" animate="visible" className="mt-4 text-xs text-[#E8D5B5]/85 leading-relaxed">
              📍 {addressLine(loc)} · {HOURS.days}, {HOURS.label}
              <span className="text-[#E8D5B5]/60"> · {HOURS.closedNote}</span>
            </motion.p>
          </div>

          {/* Desktop: the cart video as a tall glowing story card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="hidden md:block relative justify-self-end w-[320px] lg:w-[360px]"
          >
            <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden border border-[#F2C14E]/30 shadow-[0_30px_80px_-20px_rgba(242,193,78,0.35)]">
              <LoopVideo
                src="/videos/hero-cart.mp4"
                poster="/videos/hero-cart-poster.webp"
                label="The RollRicks cart lit up at night in Katanga, Jabalpur"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="absolute -left-40 bottom-10 font-hand text-2xl text-[#F2C14E] -rotate-6 leading-tight text-right">
              Katanga,
              <br />
              every evening ♥
            </p>
          </motion.div>
        </div>
      </section>

      <BrandRibbon />

      {/* ── TODAY'S HITS ─────────────────────────────────── */}
      <section className="py-10 sm:py-16 max-w-6xl mx-auto">
        <Reveal className="px-4 flex items-end justify-between gap-4 mb-6">
          <SectionHeading eyebrow="Straight from the tawa" title="Today's Hits" />
          <Link href="/menu/" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-gold whitespace-nowrap">
            Full menu <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-hide px-4 pb-2">
          {hitItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05} className="snap-start shrink-0 w-[62%] min-[420px]:w-[46%] sm:w-auto">
              <MenuItem item={withAvailability(item)} size="lg" />
            </Reveal>
          ))}
        </div>
        <div className="px-4 mt-4 sm:hidden">
          <Link href="/menu/" className="inline-flex items-center gap-1 text-sm font-bold text-gold">
            See the full menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── WHAT ARE YOU FEELING? ────────────────────────── */}
      <section id="serve" className="py-9 sm:py-12 px-4 max-w-6xl mx-auto scroll-mt-20">
        <Reveal>
          <SectionHeading eyebrow="What we serve" title="What are you feeling?" />
        </Reveal>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5">
          {[
            { diet: "veg", label: "Veg", sub: "Rolls, tandoor, Chinese & more", img: "/menu/paneer-tikka-roll.webp", ring: "hover:ring-veg" },
            { diet: "nonveg", label: "Non-Veg", sub: "Egg, chicken, tikka & more", img: "/menu/chicken-tikka.webp", ring: "hover:ring-nonveg" },
          ].map((t, i) => (
            <Reveal key={t.diet} delay={i * 0.08}>
              <Link
                href={`/menu/?diet=${t.diet}`}
                className={`group relative block aspect-[4/5] sm:aspect-[16/10] rounded-3xl overflow-hidden ring-2 ring-transparent ${t.ring} transition-all`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <span
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                      t.diet === "veg" ? "bg-[#15803D]" : "bg-[#C0392B]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white" /> {t.label}
                  </span>
                  <p className="mt-2 font-display font-black text-3xl sm:text-5xl text-white">{t.label} Menu</p>
                  <p className="text-xs sm:text-sm text-white/80 mt-1">{t.sub}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {serveTiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.04}>
              <Link
                href={t.href}
                className="flex flex-col items-center justify-center gap-1 py-4 rounded-2xl bg-card border border-line hover:border-gold hover:-translate-y-0.5 transition-all"
              >
                <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-ink">{t.label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-9 sm:py-12 px-4 max-w-6xl mx-auto">
        <Reveal className="rounded-3xl border border-line bg-card p-5 sm:p-10">
          <p className="font-hand text-2xl text-gold">No login. No queue.</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">How it works</h2>
          <div className="mt-5 grid grid-cols-[1fr_38%] sm:grid-cols-[1fr_220px] lg:grid-cols-[1fr_260px] gap-5 sm:gap-10 items-center">
          <div>
          <ol className="grid gap-5">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-3 sm:gap-5 items-start">
                <span className="font-display font-black text-4xl sm:text-5xl text-accent/80 leading-none w-10 sm:w-14 flex-shrink-0">{s.n}</span>
                <span>
                  <span className="block font-display font-bold text-xl text-ink">{s.title}</span>
                  <span className="block text-sm text-soft mt-1">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          </div>
          <div className="relative">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden border border-line bg-raised shadow-xl rotate-2">
              <LoopVideo
                src="/videos/handover.mp4"
                poster="/videos/handover-poster.webp"
                label="A RollRicks order being packed and handed over at the cart"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="absolute -bottom-3 -left-3 px-2.5 py-1 rounded-full bg-accent text-on-accent text-[10px] font-bold uppercase tracking-wider shadow">
              Real orders, real cart
            </p>
          </div>
          </div>
        </Reveal>
      </section>

      {/* ── OUR STORY: FROM CODE TO KATHI ───────────────── */}
      <div className="relative mt-6 bg-raised/60 torn-top">
      <section id="story" className="pt-20 pb-16 px-4 max-w-6xl mx-auto scroll-mt-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
          <Reveal>
            <p className="font-hand text-3xl text-gold -rotate-2 inline-block">Our Story</p>
            <h2 className="mt-1 font-display font-black text-5xl sm:text-6xl text-ink leading-[0.95] tracking-tight">
              From code
              <br />
              to kathi.
            </h2>
            <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-muted">More than just rolls</p>
            <p className="mt-6 font-display italic text-2xl text-soft leading-snug">
              &ldquo;Subah servers handle karta hoon.
              <br />
              Shaam ko rolls.&rdquo;
            </p>
            <div className="mt-6 space-y-4 text-soft leading-relaxed">
              <p>
                RollRicks started with a simple idea: serve great food that brings people together, food that feels
                special without needing a fancy restaurant.
              </p>
              <p>
                What began as a small food cart in Jabalpur has grown into a place where friends, families and food
                lovers make memories, one roll at a time. We believe street food can be affordable, exciting, hygienic
                and made with genuine care.
              </p>
              <p className="text-ink font-medium">
                Fresh ingredients. Authentic flavours. Good people. And a whole lot of love in every bite.
              </p>
            </div>
          </Reveal>

          {/* scrapbook collage */}
          <div className="relative">
            <span className="hidden sm:block absolute -top-6 right-4 z-10 font-hand text-2xl text-gold rotate-6">
              Real people. Real food. Real moments.
            </span>
            <div className="flex lg:grid lg:grid-cols-2 gap-5 overflow-x-auto lg:overflow-visible snap-x scrollbar-hide -mx-4 px-4 py-6 lg:mx-0 lg:px-0">
              {polaroids.map((p, i) => (
                <motion.figure
                  key={p.src}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  className="polaroid shrink-0 snap-center w-[70%] min-[420px]:w-[55%] lg:w-auto"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#1A0F07]">
                    {p.video ? (
                      <LoopVideo src={p.video} poster={p.src} label={p.label} className="w-full h-full object-cover object-[center_40%]" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.src} alt={p.label} loading="lazy" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <figcaption className="pt-2 text-center font-hand text-xl text-[#3D1A05] leading-none">
                    {p.label} <span className="text-[#C0392B]">♥</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>

        {/* Why RollRicks */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06} className="rounded-2xl border border-line bg-card p-5">
              <v.icon className="w-7 h-7 text-gold" strokeWidth={1.6} />
              <p className="mt-3 font-display font-bold text-lg text-ink leading-tight">{v.title}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">{v.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Journey */}
        <Reveal className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-hand text-2xl text-gold">One roll at a time</p>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-ink">Our journey</h3>
            </div>
          </div>
        </Reveal>
        <ol className="mt-6 flex gap-3 overflow-x-auto snap-x scrollbar-hide -mx-4 px-4 pb-2 lg:grid lg:grid-cols-6 lg:mx-0 lg:px-0">
          {journey.map((j, i) => {
            const next = j.stage === "Next";
            return (
              <motion.li
                key={j.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative snap-start shrink-0 w-[58%] min-[420px]:w-[42%] lg:w-auto rounded-2xl p-4 border ${
                  next ? "border-dashed border-line-strong bg-transparent" : "border-line bg-card"
                }`}
              >
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    next ? "border border-gold text-gold" : j.stage === "Growing" ? "bg-accent/20 text-gold" : "bg-accent text-on-accent"
                  }`}
                >
                  {j.stage}
                </span>
                <p className="mt-3 font-display font-bold text-lg text-ink leading-tight">{j.title}</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">{j.text}</p>
                {i < journey.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-line-strong z-10" />
                )}
              </motion.li>
            );
          })}
        </ol>
      </section>

      </div>

      {/* ── EVENTS ───────────────────────────────────────── */}
      <section className="py-9 sm:py-12 px-4 max-w-6xl mx-auto">
        <Reveal data-theme="dark" className="relative overflow-hidden rounded-3xl bg-[#0E0803] min-h-[420px] flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/food/tikka-fire.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0803] via-[#0E0803]/75 to-transparent sm:bg-gradient-to-r sm:from-[#0E0803] sm:via-[#0E0803]/80 sm:to-transparent" />
          <div className="relative p-6 sm:p-12 max-w-xl">
            <p className="font-hand text-2xl text-[#F2C14E]">Party orders · Bulk orders · Special requests</p>
            <h2 className="mt-1 font-display font-black text-4xl sm:text-5xl text-[#FFF8EE] leading-[1.02]">
              Bring RollRicks to your event.
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Birthdays", "College Fests", "Office Parties", "Private Events", "Bulk Orders"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full border border-[#F2C14E]/40 text-xs text-[#E8D5B5]">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/events/"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#F2C14E] text-[#1A0A00] font-bold text-sm uppercase tracking-wider"
              >
                Book an event <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`${BRAND.whatsappUrl}?text=${encodeURIComponent("Hi RollRicks! I'd like to book you for an event.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-[#FFF8EE]/40 text-[#FFF8EE] font-bold text-sm uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp us
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── PARTNER TEASER ───────────────────────────────── */}
      <section className="py-9 sm:py-12 px-4 max-w-6xl mx-auto">
        <Reveal className="rounded-3xl border border-line bg-card p-6 sm:p-10 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <p className="font-hand text-2xl text-gold">Partner with RollRicks</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-ink leading-[1.02]">
              One cart.
              <br />A bigger journey.
            </h2>
            <p className="mt-4 text-soft leading-relaxed">
              Want your own food business? Run your own RollRicks cart. <strong className="text-ink">You bring the drive, we bring the system:</strong> cart setup, brand, menu, recipes, training, ordering tech and support. Got your own idea instead? We&apos;ll tell you honestly if it can work.
            </p>
            <Link
              href="/partner/"
              className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-on-accent font-bold text-sm uppercase tracking-wider glow"
            >
              Explore partnership <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ol className="relative space-y-3 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-line-strong">
            {[
              ["One cart", "Where we are today", true],
              ["Local brand", "Growing in Jabalpur", true],
              ["Events + bulk orders", "Growing", true],
              ["Multiple carts", "Next", false],
              ["RollRicks partner network", "Building toward", false],
            ].map(([t, s, done]) => (
              <li key={t as string} className="relative">
                <span
                  className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full ${done ? "bg-accent" : "border-2 border-gold bg-card"}`}
                />
                <p className="font-display font-bold text-ink">{t}</p>
                <p className="text-xs text-muted">{s}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ── REVIEWS (genuine only) + CAMERA ROLL ─────────── */}
      <section className="py-10 sm:py-16 max-w-6xl mx-auto">
        {REVIEWS.length > 0 && (
          <div className="px-4 mb-12">
            <Reveal>
              <SectionHeading eyebrow="Real people. Real food." title="People are talking" />
            </Reveal>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REVIEWS.map((r, i) => (
                <Reveal key={i} delay={i * 0.05} className="rounded-2xl border border-line bg-card p-5">
                  <Quote className="w-6 h-6 text-gold" />
                  <p className="mt-3 text-ink leading-relaxed">{r.quote}</p>
                  <p className="mt-4 text-sm font-semibold text-ink">
                    {r.name}
                    {r.ordered && <span className="font-normal text-muted"> · ordered {r.ordered}</span>}
                  </p>
                  {r.rating && <p className="text-gold text-sm">{"★".repeat(r.rating)}</p>}
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal className="px-4 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Good food. Happier people." title="RollRicks after dark" />
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full border border-line text-sm font-bold text-ink hover:text-gold whitespace-nowrap"
          >
            <Instagram className="w-4 h-4" /> Follow @{BRAND.instagram}
          </a>
        </Reveal>
        <div className="mt-6 flex gap-3 overflow-x-auto snap-x scrollbar-hide px-4 pb-2">
          {cameraRoll.map((src, i) => (
            <Reveal key={src} delay={i * 0.04} className="snap-start shrink-0 w-[44%] sm:w-[23%] lg:w-[18%]">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-square rounded-2xl overflow-hidden bg-raised"
                aria-label="See more on Instagram"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </a>
            </Reveal>
          ))}
        </div>
        <div className="px-4 mt-4 sm:hidden">
          <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-gold">
            <Instagram className="w-4 h-4" /> Follow @{BRAND.instagram}
          </a>
        </div>
      </section>

      {/* ── FIND US ──────────────────────────────────────── */}
      <section id="find-us" className="py-9 sm:py-12 px-4 max-w-6xl mx-auto scroll-mt-20">
        <Reveal>
          <SectionHeading eyebrow="Jabalpur eats different" title="Find us" sub="Follow the warm lights and the tandoor smoke." />
        </Reveal>
        <div className="mt-6 grid md:grid-cols-[1fr_1.3fr] gap-4">
          {LOCATIONS.map((l) => (
            <Reveal key={l.id} className="rounded-3xl border border-line bg-card overflow-hidden flex flex-col">
              <div data-theme="dark" className="relative h-40 bg-[#0E0803]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/food/chinese-tandoor-mojito.webp" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0803] via-[#0E0803]/40 to-transparent" />
                <div className="absolute left-5 bottom-4 right-5 flex items-end gap-3">
                  <Seal size={52} className="ring-2 ring-[#F2C14E]/60" />
                  <div className="min-w-0">
                    <p className="font-display font-black text-2xl text-[#FFF8EE] leading-tight">{l.name}</p>
                    <StatusPill compact className="mt-1 bg-black/40" />
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
              <p className="flex gap-2 text-soft">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                <span>
                  {addressLine(l)}, {l.region}
                  {l.note && <span className="block text-xs text-muted mt-1">{l.note}</span>}
                </span>
              </p>
              <p className="flex gap-2 text-soft">
                <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                <span>
                  {HOURS.days}, {HOURS.label}
                  <span className="block text-xs text-muted mt-1">{HOURS.closedNote}</span>
                </span>
              </p>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <a
                  href={l.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-accent text-on-accent font-bold text-sm uppercase tracking-wide"
                >
                  <Navigation className="w-4 h-4" /> Directions
                </a>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] text-white font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-line text-ink font-bold text-sm"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.1} className="rounded-3xl overflow-hidden border border-line bg-raised min-h-[280px]">
            <iframe
              title="Map to RollRicks"
              src={loc.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[280px] border-0 grayscale-[30%] contrast-[1.05]"
            />
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="py-9 sm:py-12 px-4 max-w-3xl mx-auto scroll-mt-20">
        <Reveal>
          <SectionHeading eyebrow="Pooch lo" title="FAQ" align="center" />
        </Reveal>
        <Reveal className="mt-6">
          <Faq items={FAQ} />
        </Reveal>
      </section>
    </div>
  );
}
