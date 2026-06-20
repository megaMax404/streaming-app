const mongoose = require("mongoose");
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const Banner = require("../models/Banner");
const express = require("express");
const router = express.Router();
const auth = require("../data/middleware/auth");
const createBackup = require("../utils/autoBackup");


//GET
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


//POST
router.post("/", auth, async (req, res) => {
  try {
    const allowedFields = [
      "image",
      "link",
      "type"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }
    if (
      sanitized.image?.length > 500 ||
      sanitized.link?.length > 500
    ) {
      return res.status(400).json({
        message: "Input too long"
      });
    }
    const banner = new Banner(sanitized);
    await banner.save();
    await createBackup();
    res.json(banner);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


//PUT
router.put("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    const allowedFields = [
      "image",
      "link",
      "type"
    ];

    const sanitized = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitized[key] = req.body[key];
      }
    }
    if (
      sanitized.image?.length > 500 ||
      sanitized.link?.length > 500
    ) {
      return res.status(400).json({
        message: "Input too long"
      });
    }
    await Banner.findByIdAndUpdate(
      req.params.id,
      sanitized
    );
    await createBackup();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//DELETE
router.delete("/:id", auth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }
  try {
    await Banner.findByIdAndDelete(
      req.params.id
    );
    await createBackup();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;