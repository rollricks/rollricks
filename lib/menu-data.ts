export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  type: "veg" | "nonveg";
  badge?: string;
  available: boolean;
  image?: string;
};

export type MenuCategory = {
  name: string;
  emoji: string;
  items: MenuItem[];
};

// ───────────────────────────────────────────────────────────
//  Image library
//
//  Local /menu/*.webp files are RollRicks' own food photography,
//  compressed to ~50-100KB each. Unsplash URLs fill the gaps for
//  items the cart hasn't shot yet (drinks, chicken roll, fried
//  chicken) — those were hand-picked against the dish name, not
//  generic stock.
// ───────────────────────────────────────────────────────────
const IMG = {
  // Real photos (RollRicks-owned)
  roll: "/menu/roll.webp",
  cheeseBreadRoll: "/menu/cheese-bread-roll.webp",
  paneerBreadRoll: "/menu/paneer-bread-roll.webp",
  noodles: "/menu/noodles.webp",
  friedRice: "/menu/fried-rice.webp",
  manchurian: "/menu/manchurian.webp",
  chilliPaneer: "/menu/chilli-paneer.webp",
  chilliMushroom: "/menu/chilli-mushroom.webp",
  paneerTikka: "/menu/paneer-tikka.webp",
  soyaChaap: "/menu/soya-chaap.webp",
  malaiChaap: "/menu/malai-chaap.webp",
  chickenTikka: "/menu/chicken-tikka.webp",
  mushroomTikka: "/menu/mushroom-tikka.webp",

  // Verified Unsplash matches for items without an in-house photo
  chickenRoll:
    "https://images.unsplash.com/photo-1699728088614-7d1d4277414b?auto=format&fit=crop&w=600&q=70",
  friedChicken:
    "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=600&q=70",
  coldCoffee:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=70",
  blueMojito:
    "https://images.unsplash.com/photo-1551782450-3939704166fc?auto=format&fit=crop&w=600&q=70",
  mintMojito:
    "https://images.unsplash.com/photo-1632995561645-86a7777d3e7a?auto=format&fit=crop&w=600&q=70",
  masalaSoda:
    "https://images.unsplash.com/photo-1621330716555-5cad596c4562?auto=format&fit=crop&w=600&q=70",
} as const;

// ───────────────────────────────────────────────────────────
//  VEG MENU
// ───────────────────────────────────────────────────────────

const vegRolls: MenuCategory = {
  name: "Rolls (Veg)",
  emoji: "🌯",
  items: [
    {
      id: "v-roll-veg-khati",
      name: "Veg Khati Roll",
      description: "Classic veg wrap with onions, chutney & masala",
      price: 99,
      category: "Rolls (Veg)",
      type: "veg",
      badge: "Budget Hit",
      available: true,
      image: IMG.roll,
    },
    {
      id: "v-roll-paneer-khati",
      name: "Paneer Khati Roll",
      description: "Soft paneer wrapped in roti with mint chutney",
      price: 140,
      category: "Rolls (Veg)",
      type: "veg",
      available: true,
      image: IMG.roll,
    },
    {
      id: "v-roll-paneer-tikka",
      name: "Paneer Tikka Roll",
      description: "Tandoori-marinated paneer, onions & spicy sauce",
      price: 140,
      category: "Rolls (Veg)",
      type: "veg",
      badge: "★ Most Ordered",
      available: true,
      image: IMG.paneerTikka,
    },
    {
      id: "v-roll-soya-chaap",
      name: "Soya Chaap Roll",
      description: "Smoky soya chaap wrapped with chutney & onions",
      price: 150,
      category: "Rolls (Veg)",
      type: "veg",
      available: true,
      image: IMG.soyaChaap,
    },
    {
      id: "v-roll-cheese-bread",
      name: "Cheese Bread Roll",
      description: "Golden crispy bread loaded with cheese & spicy stuffing",
      price: 130,
      category: "Rolls (Veg)",
      type: "veg",
      badge: "★ Hero Item",
      available: true,
      image: IMG.cheeseBreadRoll,
    },
    {
      id: "v-roll-paneer-bread",
      name: "Paneer Bread Roll",
      description: "Paneer stuffed crispy bread roll with mint chutney",
      price: 130,
      category: "Rolls (Veg)",
      type: "veg",
      available: true,
      image: IMG.paneerBreadRoll,
    },
  ],
};

const vegChinese: MenuCategory = {
  name: "Chinese (Veg)",
  emoji: "🥡",
  items: [
    {
      id: "v-chi-hakka-noodles",
      name: "Hakka Noodles",
      description: "Wok-tossed noodles with garlic, soy & veggies",
      price: 120,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.noodles,
    },
    {
      id: "v-chi-manchurian-noodles",
      name: "Manchurian Noodles",
      description: "Hakka noodles tossed in manchurian gravy — street style",
      price: 140,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.manchurian,
    },
    {
      id: "v-chi-paneer-noodles",
      name: "Paneer Noodles",
      description: "Stir-fried noodles loaded with paneer cubes",
      price: 160,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.noodles,
    },
    {
      id: "v-chi-veg-fried-rice",
      name: "Veg Fried Rice",
      description: "Light, smoky wok-fried rice with mixed veggies",
      price: 120,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "v-chi-manchurian-fried-rice",
      name: "Manchurian Fried Rice",
      description: "Fried rice tossed with manchurian gravy",
      price: 140,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "v-chi-paneer-fried-rice",
      name: "Paneer Fried Rice",
      description: "Wok-tossed rice with paneer & fresh veggies",
      price: 160,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "v-chi-all-mix",
      name: "All Mix",
      description: "Noodles + fried rice + manchurian — the ultimate plate",
      price: 170,
      category: "Chinese (Veg)",
      type: "veg",
      badge: "Value",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "v-chi-chilli-paneer",
      name: "Chilli Paneer",
      description: "Crispy paneer in spicy Indo-Chinese chilli sauce",
      price: 199,
      category: "Chinese (Veg)",
      type: "veg",
      badge: "Bestseller",
      available: true,
      image: IMG.chilliPaneer,
    },
    {
      id: "v-chi-chilli-mushroom",
      name: "Chilli Mushroom",
      description: "Wok-tossed mushrooms in signature spicy sauce",
      price: 199,
      category: "Chinese (Veg)",
      type: "veg",
      available: true,
      image: IMG.chilliMushroom,
    },
  ],
};

const vegTandoor: MenuCategory = {
  name: "Tandoor (Veg)",
  emoji: "🔥",
  items: [
    {
      id: "v-tand-smoky-paneer-tikka",
      name: "Smoky Paneer Tikka",
      description: "Real tandoor smoky flavour — charred paneer, peppers, onion",
      price: 199,
      category: "Tandoor (Veg)",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
      image: IMG.paneerTikka,
    },
    {
      id: "v-tand-tandoori-soya-chaap",
      name: "Tandoori Soya Chaap",
      description: "Smoky tandoori-spiced soya chaap, charred to perfection",
      price: 180,
      category: "Tandoor (Veg)",
      type: "veg",
      available: true,
      image: IMG.soyaChaap,
    },
    {
      id: "v-tand-malai-soya-chaap-chapati",
      name: "Tandoori Malai Soya Chaap + Chapati",
      description: "Creamy malai chaap, slow-grilled, served with hot chapati",
      price: 199,
      category: "Tandoor (Veg)",
      type: "veg",
      badge: "★ Signature",
      available: true,
      image: IMG.malaiChaap,
    },
  ],
};

// ───────────────────────────────────────────────────────────
//  NON-VEG MENU
// ───────────────────────────────────────────────────────────

const nvRolls: MenuCategory = {
  name: "Rolls (Non-Veg)",
  emoji: "🌯",
  items: [
    {
      id: "nv-roll-egg",
      name: "Egg Roll",
      description: "Fresh egg wrapped in roti with onion, chutney & masala",
      price: 100,
      category: "Rolls (Non-Veg)",
      type: "nonveg",
      badge: "Budget Hit",
      available: true,
      image: IMG.roll,
    },
    {
      id: "nv-roll-chicken",
      name: "Chicken Roll",
      description: "Tender chicken filling, wrapped with mint chutney",
      price: 140,
      category: "Rolls (Non-Veg)",
      type: "nonveg",
      badge: "★ Most Ordered",
      available: true,
      image: IMG.chickenRoll,
    },
    {
      id: "nv-roll-double-egg-chicken",
      name: "Double Egg Chicken Roll",
      description: "Double egg + chicken — our biggest, juiciest roll",
      price: 170,
      category: "Rolls (Non-Veg)",
      type: "nonveg",
      badge: "Value Pack",
      available: true,
      image: IMG.chickenRoll,
    },
    {
      id: "nv-roll-chicken-crispy-bread",
      name: "Chicken Crispy Bread Roll",
      description: "Crispy golden bread stuffed with spicy chicken filling",
      price: 150,
      category: "Rolls (Non-Veg)",
      type: "nonveg",
      available: true,
      image: IMG.cheeseBreadRoll,
    },
  ],
};

const nvChinese: MenuCategory = {
  name: "Chinese (Non-Veg)",
  emoji: "🥡",
  items: [
    {
      id: "nv-chi-chilli-chicken",
      name: "Chilli Chicken",
      description: "Crispy chicken in spicy Indo-Chinese chilli sauce",
      price: 199,
      category: "Chinese (Non-Veg)",
      type: "nonveg",
      badge: "Bestseller",
      available: true,
      image: IMG.manchurian,
    },
    {
      id: "nv-chi-chicken-hakka-noodles",
      name: "Chicken Hakka Noodles",
      description: "Wok-tossed noodles with tender chicken strips",
      price: 160,
      category: "Chinese (Non-Veg)",
      type: "nonveg",
      available: true,
      image: IMG.noodles,
    },
    {
      id: "nv-chi-chicken-fried-rice",
      name: "Chicken Fried Rice",
      description: "Smoky wok-fried rice with juicy chicken pieces",
      price: 160,
      category: "Chinese (Non-Veg)",
      type: "nonveg",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "nv-chi-chicken-all-mix",
      name: "Chicken All Mix",
      description: "Noodles + fried rice + chicken manchurian on one plate",
      price: 180,
      category: "Chinese (Non-Veg)",
      type: "nonveg",
      badge: "Value",
      available: true,
      image: IMG.friedRice,
    },
    {
      id: "nv-chi-fried-chicken",
      name: "Fried Chicken",
      description: "Crispy southern-style fried chicken — golden & crunchy",
      price: 180,
      category: "Chinese (Non-Veg)",
      type: "nonveg",
      badge: "Popular",
      available: true,
      image: IMG.friedChicken,
    },
  ],
};

const nvTandoor: MenuCategory = {
  name: "Tandoor (Non-Veg)",
  emoji: "🔥",
  items: [
    {
      id: "nv-tand-chicken-tikka",
      name: "Chicken Tikka",
      description: "Juicy tandoor-grilled chicken tikka with smoky flavour",
      price: 210,
      category: "Tandoor (Non-Veg)",
      type: "nonveg",
      badge: "★ Best Seller",
      available: true,
      image: IMG.chickenTikka,
    },
    {
      id: "nv-tand-chicken-tikka-malai-chapati",
      name: "Chicken Tikka Malai + Chapati",
      description: "Creamy malai-marinated grilled chicken with hot chapati",
      price: 230,
      category: "Tandoor (Non-Veg)",
      type: "nonveg",
      badge: "★ Signature",
      available: true,
      image: IMG.chickenTikka,
    },
  ],
};

// ───────────────────────────────────────────────────────────
//  DRINKS
// ───────────────────────────────────────────────────────────

const drinks: MenuCategory = {
  name: "Drinks",
  emoji: "🥤",
  items: [
    {
      id: "drk-cold-coffee",
      name: "Cold Coffee",
      description: "Rich & creamy iced coffee",
      price: 99,
      category: "Drinks",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
      image: IMG.coldCoffee,
    },
    {
      id: "drk-blue-currant-mojito",
      name: "Blue Currant Mojito",
      description: "Bright blue mojito — looks amazing on camera",
      price: 50,
      category: "Drinks",
      type: "veg",
      badge: "★ Reel Bait",
      available: true,
      image: IMG.blueMojito,
    },
    {
      id: "drk-green-mint-mojito",
      name: "Green Mint Mojito",
      description: "Cool, fresh green mint mojito",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
      image: IMG.mintMojito,
    },
    {
      id: "drk-mint-mojito",
      name: "Mint Mojito",
      description: "Classic fresh mint with lime & soda",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
      image: IMG.mintMojito,
    },
    {
      id: "drk-guava-masala-soda",
      name: "Guava Masala Soda",
      description: "Tangy guava with black salt & masala fizz",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
      image: IMG.masalaSoda,
    },
    {
      id: "drk-masala-soda",
      name: "Masala Soda",
      description: "Fizzy soda with a punch of spicy masala",
      price: 30,
      category: "Drinks",
      type: "veg",
      badge: "₹30 Only",
      available: true,
      image: IMG.masalaSoda,
    },
  ],
};

export const menuCategories: MenuCategory[] = [
  vegRolls,
  vegChinese,
  vegTandoor,
  nvRolls,
  nvChinese,
  nvTandoor,
  drinks,
];

export const allMenuItems: MenuItem[] = menuCategories.flatMap(
  (cat) => cat.items
);

export function getMenuTabCategories(): string[] {
  return ["Combos", "Veg", "Non-Veg", "Drinks"];
}
