const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Movie = require("../models/Movie");
const auth = require("../data/middleware/auth");
const rateLimit = require("express-rate-limit");

const heavyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many heavy requests"
  }
});
/*
=========================
LOGIN
=========================
*/
router.post("/login", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      message: "Password required"
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      message: "Invalid password format"
    });
  }

  if (password.length > 200) {
    return res.status(400).json({
      message: "Password too long"
    });
  }
  
  const valid = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!valid) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token
  });
});

/*
=========================
CHECK VIDEOS
=========================
*/
router.post(
  "/check-videos",
  auth,
  heavyLimiter,
  async (req, res) => {

  try {

    const movies = await Movie.find();

    let ok = 0;
    let dead = 0;
    const deadMovies = [];

    const allowedDomains = [
      "pixeldrain.com",
      "drive.google.com",
      "cdn.example.com",
      "playerufa2.com",
      "vdohls.com",
      "w3schools.com"
    ];

    for (const movie of movies) {
      if (!movie.video || !movie.video.trim()) {
        dead++;

        deadMovies.push({
          _id: movie._id,
          title: movie.title,
          video: movie.video
        });

        continue;
      }

      try {
        console.log(movie.video);
        const url = new URL(movie.video);
        console.log(new URL(movie.video).hostname);

        if (
          !allowedDomains.some(domain =>
            url.hostname.includes(domain)
          )
        ) {
          throw new Error("Blocked domain");
        }

        const response = await fetch(movie.video);

        if (!response.ok) {
          throw new Error("Dead link");
        }

        ok++;
      } catch {
        dead++;

        deadMovies.push({
          _id: movie._id,
          title: movie.title,
          video: movie.video
        });
      }
    }

    res.json({
      success: true,
      total: movies.length,
      ok,
      dead,
      deadMovies
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;