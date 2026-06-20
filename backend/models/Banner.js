const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    maxlength: 500
  },

  link: {
    type: String,
    maxlength: 500
  },

  type: {
    type: String,
    default: "image",
    maxlength: 20
  }
}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Banner",
  bannerSchema
);