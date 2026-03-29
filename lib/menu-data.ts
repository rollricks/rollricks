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
};

export type MenuCategory = {
  name: string;
  emoji: string;
  items: MenuItem[];
};

const ourSpecialsVeg: MenuCategory = {
  name: "Our Specials (Veg)",
  emoji: "⭐",
  items: [
    {
      id: "spec-cheese-bread-roll",
      name: "Cheese Bread Roll",
      description: "Golden crispy bread, loaded with cheese & spicy stuffing",
      price: 120,
      category: "Our Specials (Veg)",
      type: "veg",
      badge: "★ Hero Item",
      available: true,
    },
    {
      id: "spec-crispy-paneer-bread-roll",
      name: "Crispy Paneer Bread Roll",
      description: "Paneer stuffed crispy roll with mint chutney",
      price: 120,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-masala-cheese-popper",
      name: "Masala Cheese Popper",
      description: "Crispy poppers loaded with masala cheese filling",
      price: 140,
      category: "Our Specials (Veg)",
      type: "veg",
      badge: "Most Ordered",
      available: true,
    },
    {
      id: "spec-paneer-tikka-roll",
      name: "Paneer Tikka Roll",
      description: "Marinated paneer tikka wrapped in soft roti with chutney & onions",
      price: 130,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-crispy-paneer-cutlet",
      name: "Crispy Paneer Cutlet",
      description: "Crunch in every bite. Served with green chutney",
      price: 100,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-veg-cutlet",
      name: "Veg Cutlet",
      description: "Classic mixed veg cutlet, crispy outside, soft inside",
      price: 70,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-pizza-sandwich",
      name: "Pizza Sandwich",
      description: "Cheesy pizza-style sandwich with tangy sauce & loaded toppings",
      price: 130,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
  ],
};

const tandoorSpecialVeg: MenuCategory = {
  name: "Tandoor Special (Veg)",
  emoji: "🔥",
  items: [
    {
      id: "tand-smokey-paneer-tikka",
      name: "Smokey Paneer Tikka",
      description: "Real tandoor smoky flavour. Charred paneer, bell peppers, onion",
      price: 180,
      category: "Tandoor Special (Veg)",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
    },
    {
      id: "tand-malai-soya-chaap",
      name: "Malai Soya Chaap",
      description: "Creamy malai marinated soya chaap, slow grilled",
      price: 180,
      category: "Tandoor Special (Veg)",
      type: "veg",
      badge: "★ Signature",
      available: true,
    },
    {
      id: "tand-tandoori-soya-chaap",
      name: "Tandoori Soya Chaap",
      description: "Smoky tandoori-spiced soya chaap, charred to perfection",
      price: 170,
      category: "Tandoor Special (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "tand-mushroom-tikka",
      name: "Mushroom Tikka",
      description: "Smoky grilled button mushrooms with tangy masala",
      price: 200,
      category: "Tandoor Special (Veg)",
      type: "veg",
      available: true,
    },
  ],
};

const chineseCornerVeg: MenuCategory = {
  name: "Chinese Corner (Veg)",
  emoji: "🥡",
  items: [
    {
      id: "chi-chilli-paneer",
      name: "Chilli Paneer",
      description: "Indo-Chinese classic. Crispy paneer in spicy chilli sauce",
      price: 180,
      category: "Chinese Corner (Veg)",
      type: "veg",
      badge: "Most Ordered",
      available: true,
    },
    {
      id: "chi-chilli-mushroom",
      name: "Chilli Mushroom",
      description: "Wok-tossed mushrooms in signature spicy sauce",
      price: 230,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-manchurian-noodles",
      name: "Manchurian Noodles",
      description: "Hakka noodles tossed with manchurian gravy. Street style",
      price: 130,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-paneer-noodles",
      name: "Paneer Noodles",
      description: "Stir-fried noodles loaded with paneer cubes",
      price: 140,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-hakka-noodles",
      name: "Hakka Noodles",
      description: "Classic hakka noodles — light, tasty, goes with everything",
      price: 110,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-manchurian-fried-rice",
      name: "Manchurian Fried Rice",
      description: "Fried rice tossed with manchurian gravy and veggies",
      price: 130,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-paneer-fried-rice",
      name: "Paneer Fried Rice",
      description: "Wok-tossed fried rice with paneer and fresh veggies",
      price: 140,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-all-mix",
      name: "All Mix",
      description: "Noodles, fried rice, and manchurian — the ultimate combo plate",
      price: 160,
      category: "Chinese Corner (Veg)",
      type: "veg",
      badge: "Value",
      available: true,
    },
  ],
};

const nonVegTandoor: MenuCategory = {
  name: "Tandoor Special (Non-Veg)",
  emoji: "🔥",
  items: [
    {
      id: "nv-malai-chicken-tikka",
      name: "Malai Chicken Tikka",
      description: "Creamy marinated chicken, char-grilled on tandoor",
      price: 220,
      category: "Tandoor Special (Non-Veg)",
      type: "nonveg",
      badge: "★ Hero",
      available: true,
    },
    {
      id: "nv-chicken-tikka-sticks",
      name: "Chicken Tikka (2 Sticks)",
      description: "Two sticks of juicy tandoor chicken tikka",
      price: 200,
      category: "Tandoor Special (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-fried-chicken",
      name: "Fried Chicken",
      description: "Crispy southern-style fried chicken",
      price: 170,
      category: "Tandoor Special (Non-Veg)",
      type: "nonveg",
      badge: "Popular",
      available: true,
    },
  ],
};

const nonVegChinese: MenuCategory = {
  name: "Chinese Corner (Non-Veg)",
  emoji: "🥡",
  items: [
    {
      id: "nv-chilli-chicken",
      name: "Chilli Chicken",
      description: "Crispy chicken in spicy Indo-Chinese sauce",
      price: 200,
      category: "Chinese Corner (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-hakka-noodles",
      name: "Chicken Hakka Noodles",
      description: "Wok-tossed noodles with tender chicken strips",
      price: 160,
      category: "Chinese Corner (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-fried-rice",
      name: "Chicken Fried Rice",
      description: "Smoky wok-fried rice with juicy chicken pieces",
      price: 150,
      category: "Chinese Corner (Non-Veg)",
      type: "nonveg",
      available: true,
    },
  ],
};

const nonVegRolls: MenuCategory = {
  name: "Roll Corner (Non-Veg)",
  emoji: "🌯",
  items: [
    {
      id: "nv-egg-roll",
      name: "Egg Roll",
      description: "Fresh egg wrapped in soft roti with onion, chutney & masala",
      price: 100,
      category: "Roll Corner (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-roll",
      name: "Chicken Roll",
      description: "Tender chicken filling, wrapped with mint chutney",
      price: 120,
      category: "Roll Corner (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-double-egg-chicken-roll",
      name: "Double Egg Chicken Roll",
      description: "Double egg + chicken filling. Our biggest roll",
      price: 170,
      category: "Roll Corner (Non-Veg)",
      type: "nonveg",
      badge: "Value Pack",
      available: true,
    },
  ],
};

const nonVegSpecials: MenuCategory = {
  name: "Our Specials (Non-Veg)",
  emoji: "🍗",
  items: [
    {
      id: "nv-crispy-chicken-cutlet",
      name: "Crispy Chicken Cutlet",
      description: "Juicy chicken cutlet, golden fried and crunchy",
      price: 130,
      category: "Our Specials (Non-Veg)",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-wings",
      name: "Chicken Wings",
      description: "Spicy glazed chicken wings",
      price: 170,
      category: "Our Specials (Non-Veg)",
      type: "nonveg",
      available: true,
    },
  ],
};

const drinks: MenuCategory = {
  name: "Drinks",
  emoji: "🥤",
  items: [
    {
      id: "drk-cold-coffee",
      name: "Cold Coffee",
      description: "Rich & creamy iced coffee",
      price: 80,
      category: "Drinks",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
    },
    {
      id: "drk-blue-currant-mojito",
      name: "Blue Currant Mojito",
      description: "Bright blue — looks amazing on camera",
      price: 50,
      category: "Drinks",
      type: "veg",
      badge: "★ Refreshing",
      available: true,
    },
    {
      id: "drk-green-mint-mojito",
      name: "Green Mint Mojito",
      description: "Cool and refreshing mint mojito",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-mint-mojito",
      name: "Mint Mojito",
      description: "Classic fresh mint with lime and soda",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-guava-masala-soda",
      name: "Guava Masala Soda",
      description: "Tangy guava with black salt & masala fizz",
      price: 50,
      category: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-masala-soda",
      name: "Masala Soda",
      description: "Fizzy soda with a punch of spicy masala",
      price: 30,
      category: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-filter-coffee",
      name: "Filter Coffee",
      description: "South Indian style hot filter coffee",
      price: 30,
      category: "Drinks",
      type: "veg",
      available: true,
    },
  ],
};

const desserts: MenuCategory = {
  name: "Desserts",
  emoji: "🍫",
  items: [
    {
      id: "des-brownie-sizzler",
      name: "Brownie Sizzler",
      description: "Hot brownie with ice cream on a sizzling plate",
      price: 150,
      category: "Desserts",
      type: "veg",
      available: true,
    },
  ],
};

export const menuCategories: MenuCategory[] = [
  ourSpecialsVeg,
  tandoorSpecialVeg,
  chineseCornerVeg,
  nonVegTandoor,
  nonVegChinese,
  nonVegRolls,
  nonVegSpecials,
  drinks,
  desserts,
];

export const allMenuItems: MenuItem[] = menuCategories.flatMap(
  (cat) => cat.items
);

export function getMenuTabCategories(): string[] {
  return ["Combos", "Veg", "Non-Veg", "Drinks", "Desserts"];
}
