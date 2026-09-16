export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://streaming-backend-yzfm.onrender.com/sitemap.xml"
    );

    if (!response.ok) {
      return res
        .status(502)
        .setHeader("Content-Type", "text/plain; charset=utf-8")
        .send(
          `Backend sitemap returned ${response.status}`
        );
    }

    const xml = await response.text();

    res.setHeader(
      "Content-Type",
      "application/xml; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return res.status(200).send(xml);
  } catch (error) {
    console.error("SITEMAP PROXY ERROR:", error);

    return res
      .status(500)
      .setHeader("Content-Type", "text/plain; charset=utf-8")
      .send(
        `Failed to generate sitemap: ${error.message}`
      );
  }
}