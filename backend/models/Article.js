const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },

  intro: {
    type: String,
    maxlength: 3000
  },

  section1Title: {
    type: String,
    maxlength: 150
  },

  section1Content: {
    type: String,
    maxlength: 8000
  },

  section2Title: {
    type: String,
    maxlength: 150
  },

  section2Content: {
    type: String,
    maxlength: 8000
  },

  section3Title: {
    type: String,
    maxlength: 150
  },

  section3Content: {
    type: String,
    maxlength: 8000
  },

  section4Title: {
    type: String,
    maxlength: 150
  },
  
  section4Content: {
    type: String,
    maxlength: 8000
  },
}, {
  timestamps: true
});

module.exports =
  mongoose.model(
    "Article",
    articleSchema
  );