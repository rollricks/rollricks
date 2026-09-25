import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, DM_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import LayoutShell from "@/components/LayoutShell";
import { BRAND, HOURS, LOCATIONS, SITE_URL } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0E0803" },
    { media: "(prefers-color-scheme: light)", color: "#F5EAD4" },
  ],
};

// Brand kit: Playfair Display (wordmark / headings) + DM Sans (body).
// Caveat is the handwritten accent from the menu creatives; DM Mono
// stays for order IDs and prices in checkout / admin.
const playfair = Playfair_Display({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const caveat = Caveat({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const description =
  "RollRicks — street food made with heart in Jabalpur. Kathi rolls, tandoor, Chinese and mojitos from our food cart, every evening 6:00 PM – 11:30 PM. Pre-order online, pay by UPI or at the cart, pick up hot.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RollRicks — Jo Dil Se Banata Hai, Vo Dil Tak Jaata Hai",
    template: "%s · RollRicks",
  },
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "RollRicks",
    locale: "en_IN",
    url: SITE_URL,
    title: "RollRicks — Sealed with Taste",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The RollRicks food cart at night" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RollRicks — Sealed with Taste",
    description,
    images: ["/og.jpg"],
  },
};

// Restaurant schema — factual fields only (no ratings/reviews).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: BRAND.name,
  slogan: BRAND.tagline,
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  logo: `${SITE_URL}/icon-512.png`,
  telephone: `+${BRAND.whatsapp}`,
  servesCuisine: ["Indian", "Street Food", "Indo-Chinese", "Tandoor"],
  priceRange: "₹",
  menu: `${SITE_URL}/menu/`,
  acceptsReservations: false,
  sameAs: [BRAND.instagramUrl],
  address: LOCATIONS.map((l) => ({
    "@type": "PostalAddress",
    addressLocality: `${l.area}, ${l.city}`,
    addressRegion: l.region,
    addressCountry: l.country,
  }))[0],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: HOURS.openDaysSchema,
    opens: "18:00",
    closes: "23:30",
  },
};

// Runs before first paint so the saved / system theme is applied with
// no flash. Admin always stays dark (it's used at the cart at night).
const themeScript = `(function(){try{var t=localStorage.getItem('rr-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}if(location.pathname.indexOf('/admin')===0)t='dark';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${caveat.variable} bg-base text-ink font-body min-h-screen`}
      >
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
