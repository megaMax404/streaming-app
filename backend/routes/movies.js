const mongoose = require("mongoose");
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const express = require("express");
const router = express.Router();
const cache = require("../utils/cache");
const Movie = require("../models/Movie");
const auth = require("../data/middleware/auth");
const createBackup = require("../utils/autoBackup");
const { sanitizeObject } = require("../utils/sanitize");
const { isValidUrl } = require("../utils/urlValidator");

function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0E00-\u0E7F-]/g, "");
}

/*
=========================
GET ALL MOVIES
=========================
*/
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find(
      { deleted: false },
      {
        title: 1,
        slug: 1,
        image: 1,
        rating: 1,
        year: 1,
        views: 1,
        category: 1,
        createdAt: 1
      }
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json(movies);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
GET TRASH
=========================
*/
router.get("/trash/list", auth, async (req, res) => {

  try {
    const trash = await Movie.find({
      deleted: true
    }).lean();

    res.json(trash);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
GET MOVIE BY ID
=========================
*/
router.get("/slug/:slug", async (req, res) => {
  try {
    const movie = await Movie.findOne(
      {
        slug: req.params.slug,
        deleted: false
      },
      {
        __v: 0,
        deleted: 0,
        deletedAt: 0
      }
    ).lean();

    if (!movie || movie.deleted) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    await Movie.findByIdAndUpdate(
      movie._id,
      { $inc: { views: 1 } }
    );

    movie.views += 1;

    res.json(movie);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
});


/*
=========================
ADD MOVIE
=========================
*/
router.post("/", auth, async (req, res) => {

  try {
    const allowedFields = [
      "title",
      "image",
      "video",
      "trailer",
      "description",
      "content",
      "highlights",
      "summary",
      "rating",
      "year",
      "views",
      "language",
      "subtitle",
      "category"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }

    const cleanData = sanitizeObject(sanitized);

    if (cleanData.title) {
      cleanData.slug = makeSlug(cleanData.title);
    }
    if (
      !isValidUrl(cleanData.image) ||
      !isValidUrl(cleanData.video) ||
      !isValidUrl(cleanData.trailer)
    ) {
      return res.status(400).json({
        message: "Invalid URL"
      });
    }
    const movie = new Movie(cleanData);
    await movie.save();
    await createBackup();

    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
UPDATE MOVIE
=========================
*/
router.put("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    const allowedFields = [
      "title",
      "image",
      "video",
      "trailer",
      "description",
      "content",
      "highlights",
      "summary",
      "rating",
      "year",
      "views",
      "language",
      "subtitle",
      "category"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }

    const cleanData = sanitizeObject(sanitized);

    if (cleanData.title) {
      cleanData.slug = makeSlug(cleanData.title);
    }
    if (
      !isValidUrl(cleanData.image) ||
      !isValidUrl(cleanData.video) ||
      !isValidUrl(cleanData.trailer)
    ) {
      return res.status(400).json({
        message: "Invalid URL"
      });
    }
    await Movie.findByIdAndUpdate(
      req.params.id,
      cleanData
    );

    await createBackup();

    res.json({
      success: true
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
MOVE TO TRASH
=========================
*/
router.delete("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    await Movie.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedAt: new Date()
    });

    await createBackup();
    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
RESTORE MOVIE
=========================
*/
router.put("/trash/restore/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    await Movie.findByIdAndUpdate(req.params.id, {
      deleted: false,
      deletedAt: null
    });

    await createBackup();
    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/*
=========================
PERMANENT DELETE
=========================
*/
router.delete("/trash/permanent/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    await Movie.findByIdAndDelete(req.params.id);

    await createBackup();
    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;

