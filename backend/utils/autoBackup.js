const Movie = require("../models/Movie");
const Banner = require("../models/Banner");
const Article = require("../models/Article");
const Backup = require("../models/Backup");

async function createBackup() {
  try {
    const movies = await Movie.find().lean();
    const banners = await Banner.find().lean();
    const articles = await Article.find().lean();

    const cleanDocs = (docs) =>
      docs.map(({ _id, __v, ...rest }) => rest);

    // บันทึก backup ลง MongoDB
    await Backup.create({
      exportDate: new Date(),
      movies: cleanDocs(movies),
      banners: cleanDocs(banners),
      articles: cleanDocs(articles),
    });

    // ดึง backup ทั้งหมด (ใหม่ → เก่า)
    const backups = await Backup.find()
      .sort({ exportDate: -1 });

    const MAX_BACKUPS = 5;

    // ลบ backup เก่าเกิน limit
    if (backups.length > MAX_BACKUPS) {
      const oldBackups = backups.slice(MAX_BACKUPS);

      for (const backup of oldBackups) {
        await Backup.deleteOne({
          _id: backup._id
        });
      }
    }

    console.log("Mongo backup completed");
  } catch (err) {
    console.error("AUTO BACKUP ERROR", err);
  }
}

module.exports = createBackup;