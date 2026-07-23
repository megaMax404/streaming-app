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

    const cached = cache.get("movies");
    if (cached) {
      return res.json(cached);
    }

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

    cache.set("movies", movies, 60);

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
GET MOVIE BY SLUG
=========================
*/
router.get("/slug/:slug", async (req, res) => {
  try {
    const key = `movie_${req.params.slug}`;
    const cachedMovie = cache.get(key);
    if (cachedMovie) {

      const movie = { ...cachedMovie };

      await Movie.findByIdAndUpdate(
        movie._id,
        { $inc: { views: 1 } }
      );

      movie.views += 1;

      return res.json(movie);
    }

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

    cache.set(key, movie, 60);
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
    cache.clear("movies");
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

    const oldMovie = await Movie.findById(req.params.id).lean();

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      cleanData,
      { new: true }
    );

    cache.clear("movies");

    if (oldMovie?.slug) {
      cache.clear(`movie_${oldMovie.slug}`);
    }

    if (updatedMovie?.slug) {
      cache.clear(`movie_${updatedMovie.slug}`);
    }
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
    const movie = await Movie.findById(req.params.id).lean();

    await Movie.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedAt: new Date()
    });

    cache.clear("movies");

    if (movie?.slug) {
      cache.clear(`movie_${movie.slug}`);
    }

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

    const movie = await Movie.findById(req.params.id).lean();

    await Movie.findByIdAndUpdate(req.params.id, {
      deleted: false,
      deletedAt: null
    });

    cache.clear("movies");

    if (movie?.slug) {
      cache.clear(`movie_${movie.slug}`);
    }

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

    const movie = await Movie.findById(req.params.id).lean();

    await Movie.findByIdAndDelete(req.params.id);

    cache.clear("movies");

    if (movie?.slug) {
      cache.clear(`movie_${movie.slug}`);
    }

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

