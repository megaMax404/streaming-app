const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No image",
      });
    }

    const base64 =
      `data:${file.mimetype};base64,` +
      file.buffer.toString("base64");

    const result =
      await cloudinary.uploader.upload(base64, {
        folder: "streaming-app",
      });

    res.json({
      url: result.secure_url,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;