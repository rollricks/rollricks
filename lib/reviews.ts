// Genuine customer reviews ONLY — copy them word for word from Google,
// Zomato, Instagram DMs or WhatsApp (with the customer's OK to use
// their first name). Never write or paraphrase reviews here.
// The "People are talking" block on the home page stays hidden until
// this list has at least one entry.
export type Review = {
  quote: string;
  name: string; // first name / initial, as the customer agreed
  ordered?: string; // e.g. "Paneer Tikka Roll"
  rating?: 1 | 2 | 3 | 4 | 5;
  source?: "Google" | "Zomato" | "Instagram" | "WhatsApp";
};

export const REVIEWS: Review[] = [];
