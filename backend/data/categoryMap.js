import { categories } from "./categories";

/* =========================
   SLUG GENERATOR
========================= */
const normalize = (text) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // space -> -
    .replace(/[^\w\u0E00-\u0E7F-]/g, ""); // keep thai/eng/num/-
};

/* =========================
   AUTO CATEGORY MAP
========================= */
export const categoryMap = categories.map((category) => ({
  name: category,
  slug:
    category === "หนังทั้งหมด"
      ? "all"
      : normalize(category),
}));

/* =========================
   LOOKUP HELPERS
========================= */
export const categoryToSlug = (name) => {
  if (!name) return "all";

  const found = categoryMap.find(
    (item) => item.name === name
  );

  return found?.slug || normalize(name);
};

export const slugToCategory = (slug) => {
  if (!slug || slug === "all") {
    return "หนังทั้งหมด";
  }

  const found = categoryMap.find(
    (item) => item.slug === slug
  );

  return found?.name || decodeURIComponent(slug);
};