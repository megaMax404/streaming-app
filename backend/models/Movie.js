const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 150
  },
  image: {
    type: String,
    maxlength: 500
  },

  video: {
    type: String,
    maxlength: 500
  },

  videoType: {
    type: String,
    enum: ["hls", "mp4"],
    default: "hls"
  },

  trailer: {
    type: String,
    maxlength: 500
  },

  description: {
    type: String,
    maxlength: 2000
  },

  content: {
    type: String,
    maxlength: 10000
  },

  highlights: [{
    type: String,
    maxlength: 300
  }],

  summary: {
    type: String,
    maxlength: 1000
  },
  rating: {
    type: Number,
    default: 0
  },
  year: {
    type: Number,
    min: 1900
  },
  views: {
    type: Number,
    default: 0
  },

  language: {
    type: String,
    maxlength: 50
  },

  subtitle: {
    type: String,
    maxlength: 50
  },

  category: [{
    type: String,
    maxlength: 50
  }],

  deleted: {
    type: Boolean,
    default: false
  },

  deletedAt: Date,

  videoStatus: {
    type: String,
    default: "unknown"
  },
  slug: {
    type: String,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});
movieSchema.index({
  deleted: 1,
  slug: 1
});

movieSchema.index({
  createdAt: -1,
  deleted: 1
});

movieSchema.index({
  category: 1
});

module.exports = mongoose.model("Movie", movieSchema);