const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    maxlength: 2000,
    default: ""
  },

  link: {
    type: String,
    maxlength: 500,
    default: ""
  },

  placement: {
    type: String,
    enum: ["top", "left", "right", "mobile-bottom"],
    default: "top"
  },

  position: {
    type: String,
    enum: ["home", "movie"],
    default: "movie"
  },

  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model(
  "Banner",
  bannerSchema
);