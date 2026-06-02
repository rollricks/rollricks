export type Combo = {
  id: string;
  name: string;
  tag: string;
  tagline: string;
  items: { name: string; price: number }[];
  price: number;
  originalPrice: number;
  savings: number;
  type: "veg" | "nonveg" | "both";
  badge?: string;
  featured?: boolean;
  image?: string;
};

// Combo hero images — point at RollRicks' own photography for the
// dominant item in the combo. Drinks/chicken fall back to verified
// Unsplash since the cart hasn't shot those yet.
const IMG = {
  roll: "/menu/roll.webp",
  paneerTikka: "/menu/paneer-tikka.webp",
  cheeseBreadRoll: "/menu/cheese-bread-roll.webp",
  noodles: "/menu/noodles.webp",
  friedRice: "/menu/fried-rice.webp",
  malaiChaap: "/menu/malai-chaap.webp",
  chickenTikka: "/menu/chicken-tikka.webp",
  chickenRoll:
    "https://images.unsplash.com/photo-1699728088614-7d1d4277414b?auto=format&fit=crop&w=800&q=70",
  coldCoffee:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=70",
  mojito:
    "https://images.unsplash.com/photo-1551782450-3939704166fc?auto=format&fit=crop&w=800&q=70",
} as const;

export const combos: Combo[] = [
  // ─── FEATURED on home page ────────────────────────────────
  {
    id: "combo-desi-hit",
    name: "DESI HIT",
    tag: "★ Under ₹130",
    tagline: "Veg khati roll + mint mojito — pet bhi, jeb bhi",
    items: [
      { name: "Veg Khati Roll", price: 99 },
      { name: "Mint Mojito", price: 50 },
    ],
    price: 129,
    originalPrice: 149,
    savings: 20,
    type: "veg",
    featured: true,
    image: IMG.roll,
  },
  // PANEER LOVERS — paneer tikka roll + cold coffee
  {
    id: "combo-paneer-lovers",
    name: "PANEER LOVERS",
    tag: "★ Most Ordered",
    tagline: "Paneer tikka roll + cold coffee — match made in heaven",
    items: [
      { name: "Paneer Tikka Roll", price: 140 },
      { name: "Cold Coffee", price: 99 },
    ],
    price: 199,
    originalPrice: 239,
    savings: 40,
    type: "veg",
    featured: true,
    image: IMG.paneerTikka,
  },
  {
    id: "combo-chicken-hit",
    name: "CHICKEN HIT",
    tag: "★ Non-Veg Bestseller",
    tagline: "Tender chicken roll with chilled cold coffee — full deal",
    items: [
      { name: "Chicken Roll", price: 140 },
      { name: "Cold Coffee", price: 99 },
    ],
    price: 199,
    originalPrice: 239,
    savings: 40,
    type: "nonveg",
    featured: true,
    image: IMG.chickenRoll,
  },

  // ─── More combos shown on menu page only ──────────────────
  {
    id: "combo-student-pack",
    name: "STUDENT PACK",
    tag: "★ Just ₹99",
    tagline: "Veg khati roll + masala soda — full plate sirf ₹99 mein",
    items: [
      { name: "Veg Khati Roll", price: 99 },
      { name: "Masala Soda", price: 30 },
    ],
    price: 99,
    originalPrice: 129,
    savings: 30,
    type: "veg",
    featured: true,
    image: IMG.roll,
  },
  {
    id: "combo-chaap-night",
    name: "CHAAP NIGHT",
    tag: "★ Tandoor Special",
    tagline: "Malai chaap with hot chapati + cool mint mojito",
    items: [
      { name: "Tandoori Malai Soya Chaap + Chapati", price: 199 },
      { name: "Mint Mojito", price: 50 },
    ],
    price: 229,
    originalPrice: 249,
    savings: 20,
    type: "veg",
    featured: true,
    image: IMG.malaiChaap,
  },
  {
    id: "combo-tandoori-night",
    name: "TANDOORI NIGHT",
    tag: "★ Premium",
    tagline: "Grilled chicken tikka malai + chapati + mint mojito",
    items: [
      { name: "Chicken Tikka Malai + Chapati", price: 230 },
      { name: "Mint Mojito", price: 50 },
    ],
    price: 249,
    originalPrice: 280,
    savings: 31,
    type: "nonveg",
    featured: true,
    image: IMG.chickenTikka,
  },
  {
    id: "combo-noodle-maha",
    name: "NOODLE MAHA",
    tag: "★ Indo-Chinese Hit",
    tagline: "Manchurian noodles + chilli paneer + masala soda",
    items: [
      { name: "Manchurian Noodles", price: 140 },
      { name: "Chilli Paneer", price: 199 },
      { name: "Masala Soda", price: 30 },
    ],
    price: 319,
    originalPrice: 369,
    savings: 50,
    type: "veg",
    image: IMG.noodles,
  },
  {
    id: "combo-veg-feast",
    name: "BIG VEG THALI",
    tag: "★ Full Meal",
    tagline: "Cheese bread roll + paneer fried rice + cold coffee",
    items: [
      { name: "Cheese Bread Roll", price: 130 },
      { name: "Paneer Fried Rice", price: 160 },
      { name: "Cold Coffee", price: 99 },
    ],
    price: 329,
    originalPrice: 389,
    savings: 60,
    type: "veg",
    image: IMG.friedRice,
  },
  {
    id: "combo-mega-nonveg",
    name: "MEGA NON-VEG",
    tag: "★ 2-Person Share",
    tagline: "Chicken all mix + double egg chicken roll + 2 cold coffees",
    items: [
      { name: "Chicken All Mix", price: 180 },
      { name: "Double Egg Chicken Roll", price: 170 },
      { name: "Cold Coffee x2", price: 198 },
    ],
    price: 449,
    originalPrice: 548,
    savings: 99,
    type: "nonveg",
    image: IMG.friedRice,
  },
  {
    id: "combo-family-feast",
    name: "FAMILY FEAST",
    tag: "★ Veg + Non-Veg",
    tagline: "For 4 people. 2 paneer rolls + 2 chicken rolls + 4 mojitos",
    items: [
      { name: "Paneer Tikka Roll x2", price: 280 },
      { name: "Chicken Roll x2", price: 280 },
      { name: "Blue Currant Mojito x4", price: 200 },
    ],
    price: 679,
    originalPrice: 760,
    savings: 81,
    type: "both",
    featured: true,
    image: IMG.chickenRoll,
  },
];

export const featuredCombos = combos.filter((c) => c.featured);
