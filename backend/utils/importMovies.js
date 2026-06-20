require("dotenv").config();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const movies = require("../data/movies.json");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo connected");
    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    for (const movie of movies) {
      await Movie.updateOne(
        { title: movie.title },
        { $set: movie },
        { upsert: true }
      );
    }

    console.log("Movies synced!");
    process.exit();
  })
  .catch(err => console.log(err));