const express = require("express");
const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie");
const Banner = require("../models/Banner");
const Article = require("../models/Article");
const auth = require("../data/middleware/auth");

const router = express.Router();

const backupsDir = path.join(
  __dirname,
  "../backups"
);

function cleanDocs(docs) {
  return docs.map(({ _id, __v, ...rest }) => rest);
}

async function restoreData(backup) {
  if (backup.movies) {
    await Movie.deleteMany({});
    await Movie.insertMany(
      cleanDocs(backup.movies)
    );
  }

  if (backup.banners) {
    await Banner.deleteMany({});
    await Banner.insertMany(
      cleanDocs(backup.banners)
    );
  }

  if (backup.articles) {
    await Article.deleteMany({});
    await Article.insertMany(
      cleanDocs(backup.articles)
    );
  }
}

/*
=========================
LIST BACKUPS
=========================
*/
router.get("/list", auth, (req, res) => {
  try {
    const files =
      fs.readdirSync(backupsDir);

    const backups = files
      .filter((file) =>
        file.endsWith(".json")
      )
      .sort()
      .reverse();

    res.json(backups);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

/*
=========================
READ BACKUP FILE
=========================
*/
router.get(
  "/file/:filename",
  auth,
  (req, res) => {
    try {
      const filePath = path.join(
        backupsDir,
        req.params.filename
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          message:
            "Backup not found"
        });
      }

      const data = JSON.parse(
        fs.readFileSync(
          filePath,
          "utf8"
        )
      );

      res.json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false
      });
    }
  }
);

/*
=========================
IMPORT BACKUP FROM FRONTEND
=========================
*/
router.post("/", auth, async (req, res) => {
  try {
    const backup = req.body;

    await restoreData(backup);

    res.json({
      success: true
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

/*
=========================
RESTORE BACKUP FROM SERVER FILE
=========================
*/
router.post(
  "/file",
  auth,
  async (req, res) => {
    try {
      const { filename } = req.body;

      const backupPath = path.join(
        backupsDir,
        filename
      );

      if (
        !fs.existsSync(backupPath)
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Backup not found"
        });
      }

      const backup = JSON.parse(
        fs.readFileSync(
          backupPath,
          "utf8"
        )
      );

      await restoreData(backup);

      res.json({
        success: true
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false
      });
    }
  }
);

module.exports = router;

