const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/streamtape", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "Missing url",
      });
    }

    console.log("Fetching:", url);

    const page = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      },
    });

    const html = page.data;

    const $ = cheerio.load(html);

    res.json({
      success: true,
      htmlLength: html.length,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;