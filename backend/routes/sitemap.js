const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    const movies = await Movie.find(
      { deleted: false },
      { slug: 1, updatedAt: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    const urls = movies
      .filter((movie) => movie.slug)
      .map((movie) => {
        const lastmod = movie.updatedAt || movie.createdAt;

        return `
  <url>
    <loc>https://doohd.vip/movie/${encodeURIComponent(movie.slug)}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}
  </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.type("application/xml").send(sitemap);
  } catch (error) {
    console.error("SITEMAP ERROR:", error);

    res.status(500).type("text/plain").send("Failed to generate sitemap");
  }
});

module.exports = router;