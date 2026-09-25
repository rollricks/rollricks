import Link from "next/link";
import { Instagram, MessageCircle, MapPin, Clock } from "lucide-react";
import { BRAND, HOURS, LOCATIONS } from "@/lib/site";
import Seal from "./Seal";

export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line bg-card mt-10">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-28 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Seal size={56} />
            <div>
              <p className="font-display font-black text-3xl text-gold leading-none">ROLLRICKS</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted mt-1">{BRAND.seal}</p>
            </div>
          </div>
          <p className="mt-5 font-hand text-3xl text-ink leading-tight">
            Roll. Eat. Repeat. <span className="text-nonveg">♥</span>
          </p>
          <p className="mt-2 text-sm text-soft italic">&ldquo;{BRAND.tagline}&rdquo;</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-display font-bold text-lg text-ink">Find the cart</p>
          {LOCATIONS.map((l) => (
            <a key={l.id} href={l.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-soft hover:text-gold">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {l.line1}, {l.line2}, {l.city}
              </span>
            </a>
          ))}
          <p className="flex gap-2 text-soft">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" /> {HOURS.days}, {HOURS.label}
          </p>
          <div className="flex gap-2 pt-1">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-line text-soft hover:text-gold"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-line text-soft hover:text-gold"
            >
              <Instagram className="w-4 h-4" /> @{BRAND.instagram}
            </a>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm content-start" aria-label="Footer">
          <p className="col-span-2 font-display font-bold text-lg text-ink mb-1">Explore</p>
          <Link href="/menu/" className="text-soft hover:text-gold">Menu</Link>
          <Link href="/track/" className="text-soft hover:text-gold">Track order</Link>
          <Link href="/events/" className="text-soft hover:text-gold">Events & catering</Link>
          <Link href="/partner/" className="text-soft hover:text-gold">Partner with us</Link>
          <Link href="/#story" className="text-soft hover:text-gold">Our story</Link>
          <Link href="/#faq" className="text-soft hover:text-gold">FAQ</Link>
        </nav>
      </div>
      <div className="border-t border-line py-4 text-center text-[11px] text-muted pb-[calc(16px+env(safe-area-inset-bottom))]">
        © {new Date().getFullYear()} RollRicks · Jabalpur
      </div>
    </footer>
  );
}
