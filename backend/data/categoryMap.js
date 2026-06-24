export const categoryMap = [
  { slug: "all", name: "หนังทั้งหมด" },
  { slug: "latest", name: "หนังใหม่ล่าสุด" },
  { slug: "2026", name: "หนังปี 2026" },
  { slug: "action", name: "Action บู๊" },
  { slug: "comedy", name: "Comedy ตลก" },
  { slug: "horror", name: "Horror สยองขวัญ" },
  { slug: "romance", name: "Romance รักโรแมนติก" },
  { slug: "thriller", name: "Thriller ระทึกขวัญ" },
  { slug: "marvel", name: "หนังมาเวล" },
  { slug: "netflix", name: "Netflix" },
  { slug: "animation", name: "Animation การ์ตูน" },
];

export const slugToCategory = (slug) => {
  return categoryMap.find(c => c.slug === slug)?.name || "หนังทั้งหมด";
};

export const categoryToSlug = (name) => {
  return categoryMap.find(c => c.name === name)?.slug || "all";
};