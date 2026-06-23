const mongoose = require("mongoose");

const BackupSchema = new mongoose.Schema({
  exportDate: {
    type: Date,
    default: Date.now
  },

  movies: Array,
  banners: Array,
  articles: Array
});

module.exports = mongoose.model("Backup", BackupSchema);