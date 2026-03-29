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
};

export const combos: Combo[] = [
  {
    id: "combo-404",
    name: "THE 404 COMBO",
    tag: "★ No.1 Bestseller",
    tagline: "Our most popular combo — crispy roll meets cold coffee",
    items: [
      { name: "Cheese Bread Roll", price: 120 },
      { name: "Cold Coffee", price: 80 },
    ],
    price: 170,
    originalPrice: 200,
    savings: 30,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-chaap-drop",
    name: "THE CHAAP DROP",
    tag: "★ Signature Combo",
    tagline: "Creamy chaap paired with a refreshing blue mojito",
    items: [
      { name: "Malai Soya Chaap", price: 180 },
      { name: "Blue Currant Mojito", price: 50 },
    ],
    price: 199,
    originalPrice: 230,
    savings: 31,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-smoky-pack",
    name: "THE SMOKY PACK",
    tag: "★ Full Meal Deal",
    tagline: "Smoky tikka, noodles, and cold coffee — the full experience",
    items: [
      { name: "Smokey Paneer Tikka", price: 180 },
      { name: "Manchurian Noodles", price: 130 },
      { name: "Cold Coffee", price: 80 },
    ],
    price: 340,
    originalPrice: 390,
    savings: 50,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-prod-deploy",
    name: "THE PROD DEPLOY",
    tag: "★ Non-Veg Hero",
    tagline: "Chicken tikka, chicken roll, and cold coffee — deployed to your table",
    items: [
      { name: "Malai Chicken Tikka", price: 220 },
      { name: "Chicken Roll", price: 120 },
      { name: "Cold Coffee", price: 80 },
    ],
    price: 360,
    originalPrice: 420,
    savings: 60,
    type: "nonveg",
  },
  {
    id: "combo-debug-meal",
    name: "THE DEBUG MEAL",
    tag: "★ Reel Bait",
    tagline: "Wings, poppers, and mojito — perfect for sharing and shooting reels",
    items: [
      { name: "Chicken Wings", price: 170 },
      { name: "Masala Cheese Popper", price: 140 },
      { name: "Blue Currant Mojito", price: 50 },
    ],
    price: 329,
    originalPrice: 360,
    savings: 31,
    type: "nonveg",
  },
  {
    id: "combo-entry-level",
    name: "THE ENTRY LEVEL",
    tag: "Budget Friendly",
    tagline: "Crispy cutlet and fizzy soda — great taste, easy on the wallet",
    items: [
      { name: "Crispy Paneer Cutlet", price: 100 },
      { name: "Guava Masala Soda", price: 50 },
    ],
    price: 140,
    originalPrice: 150,
    savings: 10,
    type: "veg",
  },
  {
    id: "combo-full-stack",
    name: "THE FULL STACK",
    tag: "★ 2-Person Share",
    tagline: "Fried chicken, double roll, noodles, and 2 mojitos — share the feast",
    items: [
      { name: "Fried Chicken", price: 170 },
      { name: "Double Egg Chicken Roll", price: 170 },
      { name: "Chicken Hakka Noodles", price: 160 },
      { name: "Blue Currant Mojito x2", price: 100 },
    ],
    price: 520,
    originalPrice: 600,
    savings: 80,
    type: "nonveg",
  },
  {
    id: "combo-bulk-pr",
    name: "THE BULK PR",
    tag: "★ Bulk Order",
    tagline: "10 rolls, 5 mojitos, 5 cold coffees — perfect for parties and events",
    items: [
      { name: "10 Rolls (any mix)", price: 1200 },
      { name: "5 Mojitos", price: 250 },
      { name: "5 Cold Coffees", price: 400 },
    ],
    price: 1249,
    originalPrice: 1850,
    savings: 601,
    type: "both",
  },
];

export const featuredCombos = combos.filter((c) => c.featured);
