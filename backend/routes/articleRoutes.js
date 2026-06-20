const mongoose = require("mongoose");
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const auth = require("../data/middleware/auth");
const { sanitizeObject } = require("../utils/sanitize");

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "intro",
      "section1Title",
      "section1Content",
      "section2Title",
      "section2Content",
      "section3Title",
      "section3Content",
      "section4Title",
      "section4Content"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }

    const cleanData = sanitizeObject(sanitized);
    const article = new Article(cleanData);
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    const allowedFields = [
      "title",
      "intro",
      "section1Title",
      "section1Content",
      "section2Title",
      "section2Content",
      "section3Title",
      "section3Content",
      "section4Title",
      "section4Content"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }

    const cleanData = sanitizeObject(sanitized);
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      cleanData,
      { new: true }
    );

    res.json(article); // <-- ขาดตรงนี้
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;