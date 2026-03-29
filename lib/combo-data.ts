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
      { name: "Cheese Bread Roll", price: 129 },
      { name: "Cold Coffee", price: 89 },
    ],
    price: 179,
    originalPrice: 218,
    savings: 39,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-chaap-drop",
    name: "THE CHAAP DROP",
    tag: "★ Signature Combo",
    tagline: "Creamy chaap paired with a refreshing blue mojito",
    items: [
      { name: "Malai Tandoori Soya Chaap", price: 189 },
      { name: "Blue Currant Mojito", price: 69 },
    ],
    price: 229,
    originalPrice: 258,
    savings: 29,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-smoky-pack",
    name: "THE SMOKY PACK",
    tag: "★ Full Meal Deal",
    tagline: "Smoky tikka, noodles, and cold coffee — the full experience",
    items: [
      { name: "Smokey Paneer Tikka", price: 189 },
      { name: "Manchurian Noodles", price: 139 },
      { name: "Cold Coffee", price: 89 },
    ],
    price: 349,
    originalPrice: 417,
    savings: 68,
    type: "veg",
    featured: true,
  },
  {
    id: "combo-prod-deploy",
    name: "THE PROD DEPLOY",
    tag: "★ Non-Veg Hero",
    tagline: "Chicken tikka, chicken roll, and cold coffee — deployed to your table",
    items: [
      { name: "Malai Chicken Tikka", price: 229 },
      { name: "Chicken Roll", price: 129 },
      { name: "Cold Coffee", price: 89 },
    ],
    price: 369,
    originalPrice: 447,
    savings: 78,
    type: "nonveg",
  },
  {
    id: "combo-debug-meal",
    name: "THE DEBUG MEAL",
    tag: "★ Reel Bait",
    tagline: "Wings, poppers, and mojito — perfect for sharing and shooting reels",
    items: [
      { name: "Chicken Wings", price: 179 },
      { name: "Masala Cheese Popper", price: 149 },
      { name: "Blue Currant Mojito", price: 69 },
    ],
    price: 349,
    originalPrice: 397,
    savings: 48,
    type: "nonveg",
  },
  {
    id: "combo-entry-level",
    name: "THE ENTRY LEVEL",
    tag: "Budget Friendly",
    tagline: "Crispy cutlet and fizzy soda — great taste, easy on the wallet",
    items: [
      { name: "Crispy Paneer Cutlet", price: 109 },
      { name: "Guava Masala Soda", price: 59 },
    ],
    price: 149,
    originalPrice: 168,
    savings: 19,
    type: "veg",
  },
  {
    id: "combo-full-stack",
    name: "THE FULL STACK",
    tag: "★ 2-Person Share",
    tagline: "Fried chicken, double roll, noodles, and 2 mojitos — share the feast",
    items: [
      { name: "Fried Chicken", price: 179 },
      { name: "Double Egg Chicken Roll", price: 179 },
      { name: "Chicken Hakka Noodles", price: 169 },
      { name: "Blue Currant Mojito x2", price: 138 },
    ],
    price: 549,
    originalPrice: 665,
    savings: 116,
    type: "nonveg",
  },
  {
    id: "combo-bulk-pr",
    name: "THE BULK PR",
    tag: "★ Bulk Order",
    tagline: "10 rolls, 5 mojitos, 5 cold coffees — perfect for parties and events",
    items: [
      { name: "10 Rolls (any mix)", price: 1290 },
      { name: "5 Mojitos", price: 345 },
      { name: "5 Cold Coffees", price: 445 },
    ],
    price: 1299,
    originalPrice: 1600,
    savings: 301,
    type: "both",
  },
];

export const featuredCombos = combos.filter((c) => c.featured);
