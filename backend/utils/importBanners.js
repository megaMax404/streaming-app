const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
const mongoose = require("mongoose");

const Banner = require("../models/Banner");
const banners = require("../data/banners.json");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo connected");

    await Banner.deleteMany({});

    for (const banner of banners) {
      await Banner.create({
        image: banner.image,
        link: banner.link,
        type: banner.type
      });
    }

    console.log("Banners imported!");
    process.exit();
  })
  .catch(console.log);