export type Diet = "veg" | "nonveg";

// Menu sections shown as category chips. Order here = order on /menu.
export const SECTIONS = [
  { key: "Rolls", emoji: "🌯" },
  { key: "Chinese", emoji: "🥡" },
  { key: "Tandoor", emoji: "🔥" },
  { key: "Snacks", emoji: "🌽" },
  { key: "Cutlet", emoji: "🥔" },
  { key: "Soup", emoji: "🍲" },
  { key: "Drinks", emoji: "🥤" },
] as const;

export type Section = (typeof SECTIONS)[number]["key"];

export type Addon = {
  id: string;
  name: string;
  price: number;
};

export type MenuItem = {
  id: string; // stable — used by menu_config (admin availability) and carts
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // legacy grouping label, e.g. "Rolls (Veg)"
  section: Section;
  type: Diet; // drinks are "veg" and shown under both diets
  badge?: string;
  available: boolean;
  image?: string;
  addons?: Addon[];
};

export type MenuCategory = {
  name: string;
  emoji: string;
  items: MenuItem[];
};

// ───────────────────────────────────────────────────────────
//  Image library — RollRicks' own photography (Zomato shoot +
//  cart photos), compressed to WebP. Items without an in-house
//  photo have no image and render a branded tile instead of stock.
// ───────────────────────────────────────────────────────────
const IMG = {
  vegRoll: "/menu/veg-roll.webp",
  achariRoll: "/menu/achari-roll.webp",
  paneerKhatiRoll: "/menu/paneer-khati-roll.webp",
  paneerTikkaRoll: "/menu/paneer-tikka-roll.webp",
  soyaChaapRoll: "/menu/soya-chaap-roll.webp",
  cheeseBreadRoll: "/menu/cheese-bread-roll.webp",
  paneerBreadRoll: "/menu/paneer-bread-roll.webp",
  eggRoll: "/menu/egg-roll.webp",
  chickenRoll: "/menu/chicken-roll.webp",
  doubleEggChickenRoll: "/menu/double-egg-chicken-roll.webp",
  chickenBreadRoll: "/menu/chicken-bread-roll.webp",

  hakkaNoodles: "/menu/hakka-noodles.webp",
  manchurianNoodles: "/menu/manchurian-noodles.webp",
  paneerNoodles: "/menu/paneer-noodles.webp",
  friedRice: "/menu/fried-rice.webp",
  paneerFriedRice: "/menu/paneer-fried-rice.webp",
  allMix: "/menu/all-mix.webp",
  chilliPaneer: "/menu/chilli-paneer-box.webp",
  chilliMushroom: "/menu/chilli-mushroom-box.webp",
  chilliChicken: "/menu/chilli-chicken.webp",
  chickenHakkaNoodles: "/menu/chicken-hakka-noodles.webp",
  chickenFriedRice: "/menu/chicken-fried-rice.webp",
  chickenAllMix: "/menu/chicken-all-mix.webp",
  friedChicken: "/menu/fried-chicken.webp",

  paneerTikka: "/menu/paneer-tikka-skewers.webp",
  soyaChaap: "/menu/soya-chaap.webp",
  malaiChaap: "/menu/malai-soya-chaap.webp",
  chickenTikka: "/menu/chicken-tikka.webp",
  malaiChickenTikka: "/menu/malai-chicken-tikka.webp",

  vegCutlet: "/menu/veg-cutlet.webp",

  coldCoffee: "/menu/cold-coffee.webp",
  mintMojito: "/menu/mint-mojito.webp",
} as const;

// Add-ons shown on the RollRicks veg menu creative (Chinese section).
const CHINESE_ADDONS: Addon[] = [
  { id: "paneer", name: "Add Paneer", price: 30 },
  { id: "manchurian", name: "Add Manchurian", price: 20 },
];

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
      section: "Rolls",
      type: "veg",
      badge: "Budget Hit",
      available: true,
      image: IMG.vegRoll,
    },
    {
      id: "v-roll-achari",
      name: "Achari Roll",
      description: "Tangy pickle-spiced veg filling wrapped in roti",
      price: 120,
      category: "Rolls (Veg)",
      section: "Rolls",
      type: "veg",
      badge: "New",
      available: true,
      image: IMG.achariRoll,
    },
    {
      id: "v-roll-paneer-khati",
      name: "Paneer Khati Roll",
      description: "Soft paneer wrapped in roti with mint chutney",
      price: 140,
      category: "Rolls (Veg)",
      section: "Rolls",
      type: "veg",
      available: true,
      image: IMG.paneerKhatiRoll,
    },
    {
      id: "v-roll-paneer-tikka",
      name: "Paneer Tikka Roll",
      description: "Tandoori-marinated paneer, onions & spicy sauce",
      price: 140,
      category: "Rolls (Veg)",
      section: "Rolls",
      type: "veg",
      badge: "★ Most Ordered",
      available: true,
      image: IMG.paneerTikkaRoll,
    },
    {
      id: "v-roll-soya-chaap",
      name: "Soya Chaap Roll",
      description: "Smoky soya chaap wrapped with chutney & onions",
      price: 150,
      category: "Rolls (Veg)",
      section: "Rolls",
      type: "veg",
      available: true,
      image: IMG.soyaChaapRoll,
    },
    {
      id: "v-roll-cheese-bread",
      name: "Cheese Bread Roll",
      description: "Golden crispy bread loaded with cheese & spicy stuffing",
      price: 130,
      category: "Rolls (Veg)",
      section: "Rolls",
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
      section: "Rolls",
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
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.hakkaNoodles,
      addons: CHINESE_ADDONS,
    },
    {
      id: "v-chi-manchurian-noodles",
      name: "Manchurian Noodles",
      description: "Hakka noodles tossed in manchurian gravy — street style",
      price: 140,
      category: "Chinese (Veg)",
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.manchurianNoodles,
    },
    {
      id: "v-chi-paneer-noodles",
      name: "Paneer Noodles",
      description: "Stir-fried noodles loaded with paneer cubes",
      price: 160,
      category: "Chinese (Veg)",
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.paneerNoodles,
    },
    {
      id: "v-chi-veg-fried-rice",
      name: "Veg Fried Rice",
      description: "Light, smoky wok-fried rice with mixed veggies",
      price: 120,
      category: "Chinese (Veg)",
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.friedRice,
      addons: CHINESE_ADDONS,
    },
    {
      id: "v-chi-manchurian-fried-rice",
      name: "Manchurian Fried Rice",
      description: "Fried rice tossed with manchurian gravy",
      price: 140,
      category: "Chinese (Veg)",
      section: "Chinese",
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
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.paneerFriedRice,
    },
    {
      id: "v-chi-all-mix",
      name: "All Mix",
      description: "Noodles + fried rice + manchurian — the ultimate plate",
      price: 170,
      category: "Chinese (Veg)",
      section: "Chinese",
      type: "veg",
      badge: "Value",
      available: true,
      image: IMG.allMix,
    },
    {
      id: "v-chi-chilli-paneer",
      name: "Chilli Paneer",
      description: "Crispy paneer in spicy Indo-Chinese chilli sauce",
      price: 199,
      category: "Chinese (Veg)",
      section: "Chinese",
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
      section: "Chinese",
      type: "veg",
      available: true,
      image: IMG.chilliMushroom,
    },
  ],
};

// Snacks, cutlets and soups — from the RollRicks veg menu creative.
const vegSnacks: MenuCategory = {
  name: "Snacks (Veg)",
  emoji: "🌽",
  items: [
    {
      id: "v-snk-peanut-masala",
      name: "Peanut Masala",
      description: "Roasted peanuts tossed with onion, tomato, lemon & masala",
      price: 99,
      category: "Snacks (Veg)",
      section: "Snacks",
      type: "veg",
      available: true,
    },
    {
      id: "v-snk-crispy-corn",
      name: "Crispy Corn",
      description: "Golden fried corn kernels with a spicy masala toss",
      price: 79,
      category: "Snacks (Veg)",
      section: "Snacks",
      type: "veg",
      available: true,
    },
    {
      id: "v-cut-veg",
      name: "Crispy Veg Cutlet",
      description: "Crunchy spiced veg cutlets with onion rings & ketchup",
      price: 79,
      category: "Cutlet (Veg)",
      section: "Cutlet",
      type: "veg",
      available: true,
      image: IMG.vegCutlet,
    },
    {
      id: "v-cut-paneer",
      name: "Crispy Paneer Cutlet",
      description: "Paneer-stuffed crispy cutlets, fried golden",
      price: 99,
      category: "Cutlet (Veg)",
      section: "Cutlet",
      type: "veg",
      available: true,
    },
    {
      id: "v-soup-hot-sour",
      name: "Hot & Sour Soup",
      description: "Spicy, tangy Indo-Chinese soup with veggies",
      price: 79,
      category: "Soup (Veg)",
      section: "Soup",
      type: "veg",
      available: true,
    },
    {
      id: "v-soup-manchow",
      name: "Manchow Soup",
      description: "Garlicky veg soup topped with crispy fried noodles",
      price: 79,
      category: "Soup (Veg)",
      section: "Soup",
      type: "veg",
      available: true,
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
      section: "Tandoor",
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
      section: "Tandoor",
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
      section: "Tandoor",
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
      section: "Rolls",
      type: "nonveg",
      badge: "Budget Hit",
      available: true,
      image: IMG.eggRoll,
    },
    {
      id: "nv-roll-chicken",
      name: "Chicken Roll",
      description: "Tender chicken filling, wrapped with mint chutney",
      price: 140,
      category: "Rolls (Non-Veg)",
      section: "Rolls",
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
      section: "Rolls",
      type: "nonveg",
      badge: "Value Pack",
      available: true,
      image: IMG.doubleEggChickenRoll,
    },
    {
      id: "nv-roll-chicken-crispy-bread",
      name: "Chicken Crispy Bread Roll",
      description: "Crispy golden bread stuffed with spicy chicken filling",
      price: 150,
      category: "Rolls (Non-Veg)",
      section: "Rolls",
      type: "nonveg",
      available: true,
      image: IMG.chickenBreadRoll,
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
      section: "Chinese",
      type: "nonveg",
      badge: "Bestseller",
      available: true,
      image: IMG.chilliChicken,
    },
    {
      id: "nv-chi-chicken-hakka-noodles",
      name: "Chicken Hakka Noodles",
      description: "Wok-tossed noodles with tender chicken strips",
      price: 160,
      category: "Chinese (Non-Veg)",
      section: "Chinese",
      type: "nonveg",
      available: true,
      image: IMG.chickenHakkaNoodles,
    },
    {
      id: "nv-chi-chicken-fried-rice",
      name: "Chicken Fried Rice",
      description: "Smoky wok-fried rice with juicy chicken pieces",
      price: 160,
      category: "Chinese (Non-Veg)",
      section: "Chinese",
      type: "nonveg",
      available: true,
      image: IMG.chickenFriedRice,
    },
    {
      id: "nv-chi-chicken-all-mix",
      name: "Chicken All Mix",
      description: "Noodles + fried rice + chicken manchurian on one plate",
      price: 180,
      category: "Chinese (Non-Veg)",
      section: "Chinese",
      type: "nonveg",
      badge: "Value",
      available: true,
      image: IMG.chickenAllMix,
    },
    {
      id: "nv-chi-fried-chicken",
      name: "Fried Chicken",
      description: "Crispy southern-style fried chicken — golden & crunchy",
      price: 180,
      category: "Chinese (Non-Veg)",
      section: "Chinese",
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
      section: "Tandoor",
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
      section: "Tandoor",
      type: "nonveg",
      badge: "★ Signature",
      available: true,
      image: IMG.malaiChickenTikka,
    },
  ],
};

// ───────────────────────────────────────────────────────────
//  DRINKS (shared by veg and non-veg menus)
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
      section: "Drinks",
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
      section: "Drinks",
      type: "veg",
      badge: "★ Reel Bait",
      available: true,
    },
    {
      id: "drk-green-mint-mojito",
      name: "Green Mint Mojito",
      description: "Cool, fresh green mint mojito",
      price: 50,
      category: "Drinks",
      section: "Drinks",
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
      section: "Drinks",
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
      section: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-masala-soda",
      name: "Masala Soda",
      description: "Fizzy soda with a punch of spicy masala",
      price: 30,
      category: "Drinks",
      section: "Drinks",
      type: "veg",
      badge: "₹30 Only",
      available: true,
    },
  ],
};

export const menuCategories: MenuCategory[] = [
  vegRolls,
  vegChinese,
  vegTandoor,
  vegSnacks,
  nvRolls,
  nvChinese,
  nvTandoor,
  drinks,
];

export const allMenuItems: MenuItem[] = menuCategories.flatMap(
  (cat) => cat.items
);

// Home page "Today's Hits" — items already tagged Best Seller / Most
// Ordered / Hero Item in the menu data above (no new claims).
export const HIT_IDS = [
  "v-roll-paneer-tikka",
  "nv-roll-chicken",
  "v-tand-smoky-paneer-tikka",
  "v-roll-cheese-bread",
  "nv-tand-chicken-tikka",
  "drk-cold-coffee",
];

export const hitItems: MenuItem[] = HIT_IDS.map(
  (id) => allMenuItems.find((i) => i.id === id)!
).filter(Boolean);

// Cart line id for an item with add-ons, e.g. "v-chi-hakka-noodles+paneer".
// The base id stays a prefix so availability checks still work.
export function cartLineId(itemId: string, addonIds: string[]): string {
  return addonIds.length ? `${itemId}+${[...addonIds].sort().join("+")}` : itemId;
}
