const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie");
const Banner = require("../models/Banner");
const Article = require("../models/Article");

async function createBackup() {
  try {
    const backupDir =
      path.join(
        __dirname,
        "../backups"
      );

    if (
      !fs.existsSync(
        backupDir
      )
    ) {
      fs.mkdirSync(
        backupDir
      );
    }

    const movies = await Movie.find().lean();
    const banners = await Banner.find().lean();
    const articles = await Article.find().lean();

    const cleanDocs = (docs) =>
      docs.map(({ _id, __v, ...rest }) => rest);

    const backup = {
      exportDate: new Date().toISOString(),
      movies: cleanDocs(movies),
      banners: cleanDocs(banners),
      articles: cleanDocs(articles),
    };

    const filename =
      `backup-${Date.now()}.json`;

    fs.writeFileSync(
      path.join(
        backupDir,
        filename
      ),
      JSON.stringify(
        backup,
        null,
        2
      )
    );

    // =========================
    // เก็บแค่ 10 ไฟล์ล่าสุด
    // =========================
    const backups = fs
      .readdirSync(
        backupDir
      )
      .filter(file =>
        file.endsWith(
          ".json"
        )
      )
      .sort(
        (a, b) => {
          const aTime =
            fs.statSync(
              path.join(
                backupDir,
                a
              )
            ).mtimeMs;

          const bTime =
            fs.statSync(
              path.join(
                backupDir,
                b
              )
            ).mtimeMs;

          return (
            bTime -
            aTime
          );
        }
      );

    const MAX_BACKUPS = 5;

    if (backups.length > MAX_BACKUPS) {
      backups
        .slice(MAX_BACKUPS)
        .forEach(file => {
          fs.unlinkSync(
            path.join(
              backupDir,
              file
            )
          );
        });
    }

  } catch (err) {
    console.error(
      "AUTO BACKUP ERROR",
      err
    );
  }
}

module.exports =
  createBackup;