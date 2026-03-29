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

const ourSpecials: MenuCategory = {
  name: "Our Specials (Veg)",
  emoji: "⭐",
  items: [
    {
      id: "spec-cheese-bread-roll",
      name: "Cheese Bread Roll",
      description: "Golden crispy bread, loaded with cheese & spicy stuffing",
      price: 129,
      category: "Our Specials (Veg)",
      type: "veg",
      badge: "★ Hero Item",
      available: true,
    },
    {
      id: "spec-masala-cheese-popper",
      name: "Masala Cheese Popper",
      description: "Crispy poppers loaded with masala cheese filling",
      price: 149,
      category: "Our Specials (Veg)",
      type: "veg",
      badge: "Most Ordered",
      available: true,
    },
    {
      id: "spec-crispy-paneer-bread-roll",
      name: "Crispy Paneer Bread Roll",
      description: "Paneer stuffed crispy roll with mint chutney",
      price: 129,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-paneer-tikka-roll",
      name: "Paneer Tikka Roll",
      description: "Marinated paneer tikka wrapped in soft roti with chutney & onions",
      price: 139,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-crispy-paneer-cutlet",
      name: "Crispy Paneer Cutlet",
      description: "Crunch in every bite. Served with green chutney",
      price: 109,
      category: "Our Specials (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "spec-pizza-sandwich",
      name: "Pizza Sandwich",
      description: "Cheesy pizza-style sandwich with tangy sauce & loaded toppings",
      price: 130,
      originalPrice: 139,
      category: "Our Specials (Veg)",
      type: "veg",
      badge: "New",
      available: true,
    },
  ],
};

const tandoorSpecial: MenuCategory = {
  name: "Tandoor Special (Veg)",
  emoji: "🔥",
  items: [
    {
      id: "tand-smokey-paneer-tikka",
      name: "Smokey Paneer Tikka",
      description:
        "Real tandoor smoky flavour. Charred paneer, bell peppers, onion",
      price: 189,
      category: "Tandoor Special (Veg)",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
    },
    {
      id: "tand-malai-soya-chaap",
      name: "Malai Tandoori Soya Chaap",
      description: "Creamy malai marinated soya chaap, slow grilled",
      price: 189,
      category: "Tandoor Special (Veg)",
      type: "veg",
      badge: "★ Signature",
      available: true,
    },
    {
      id: "tand-mushroom-tikka",
      name: "Mushroom Tikka",
      description: "Smoky grilled button mushrooms with tangy masala",
      price: 209,
      category: "Tandoor Special (Veg)",
      type: "veg",
      available: true,
    },
  ],
};

const chineseCorner: MenuCategory = {
  name: "Chinese Corner (Veg)",
  emoji: "🥡",
  items: [
    {
      id: "chi-chilli-paneer",
      name: "Chilli Paneer",
      description: "Indo-Chinese classic. Crispy paneer in spicy chilli sauce",
      price: 189,
      category: "Chinese Corner (Veg)",
      type: "veg",
      badge: "Most Ordered",
      available: true,
    },
    {
      id: "chi-chilli-mushroom",
      name: "Chilli Mushroom",
      description: "Wok-tossed mushrooms in signature spicy sauce",
      price: 239,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-manchurian-noodles",
      name: "Manchurian Noodles",
      description:
        "Hakka noodles tossed with manchurian gravy. Street style",
      price: 139,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
    {
      id: "chi-hakka-noodles",
      name: "Hakka Noodles",
      description:
        "Classic hakka noodles — light, tasty, goes with everything",
      price: 119,
      category: "Chinese Corner (Veg)",
      type: "veg",
      available: true,
    },
  ],
};

const nonVegSpecials: MenuCategory = {
  name: "Non-Veg Specials",
  emoji: "🍗",
  items: [
    {
      id: "nv-malai-chicken-tikka",
      name: "Malai Chicken Tikka",
      description: "Creamy marinated chicken, char-grilled on tandoor",
      price: 229,
      category: "Non-Veg Specials",
      type: "nonveg",
      badge: "★ Hero",
      available: true,
    },
    {
      id: "nv-fried-chicken",
      name: "Fried Chicken",
      description: "Crispy southern-style fried chicken",
      price: 179,
      category: "Non-Veg Specials",
      type: "nonveg",
      badge: "Popular",
      available: true,
    },
    {
      id: "nv-chicken-wings",
      name: "Chicken Wings",
      description: "Spicy glazed chicken wings",
      price: 179,
      category: "Non-Veg Specials",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-egg-roll",
      name: "Egg Roll",
      description:
        "Fresh egg wrapped in soft roti with onion, chutney & masala",
      price: 109,
      category: "Non-Veg Specials",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-roll",
      name: "Chicken Roll",
      description: "Tender chicken filling, wrapped with mint chutney",
      price: 129,
      category: "Non-Veg Specials",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-double-egg-chicken-roll",
      name: "Double Egg Chicken Roll",
      description: "Double egg + chicken filling. Our biggest roll",
      price: 179,
      category: "Non-Veg Specials",
      type: "nonveg",
      badge: "Value Pack",
      available: true,
    },
    {
      id: "nv-chilli-chicken",
      name: "Chilli Chicken",
      description: "Crispy chicken in spicy Indo-Chinese sauce",
      price: 209,
      category: "Non-Veg Specials",
      type: "nonveg",
      available: true,
    },
    {
      id: "nv-chicken-hakka-noodles",
      name: "Chicken Hakka Noodles",
      description: "Wok-tossed noodles with tender chicken strips",
      price: 169,
      category: "Non-Veg Specials",
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
      price: 89,
      category: "Drinks",
      type: "veg",
      badge: "★ Best Seller",
      available: true,
    },
    {
      id: "drk-blue-currant-mojito",
      name: "Blue Currant Mojito",
      description: "Bright blue — looks amazing on camera",
      price: 69,
      category: "Drinks",
      type: "veg",
      badge: "★ Refreshing",
      available: true,
    },
    {
      id: "drk-green-mint-mojito",
      name: "Green Mint Mojito",
      description: "Cool and refreshing mint mojito",
      price: 69,
      category: "Drinks",
      type: "veg",
      available: true,
    },
    {
      id: "drk-guava-masala-soda",
      name: "Guava Masala Soda",
      description: "Tangy guava with black salt & masala fizz",
      price: 59,
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
      description: "Hot brownie with ice cream. Process completed successfully",
      price: 150,
      category: "Desserts",
      type: "veg",
      available: true,
    },
  ],
};

export const menuCategories: MenuCategory[] = [
  ourSpecials,
  tandoorSpecial,
  chineseCorner,
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
