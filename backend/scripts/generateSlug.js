require("dotenv").config();

const mongoose = require("mongoose");

const Movie = require("../models/Movie");

function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0E00-\u0E7F-]/g, "");
}

async function run() {

  await mongoose.connect(process.env.MONGO_URI);

  const movies = await Movie.find();

  for (const movie of movies) {

    movie.slug = makeSlug(movie.title);

    await movie.save();

    console.log(movie.title, movie.slug);

  }

  console.log("DONE");

  process.exit();

}

run();