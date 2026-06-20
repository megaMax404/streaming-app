const express = require("express");
const Stats = require("../models/Stats");
const router = express.Router();
const auth = require("../data/middleware/auth");



// เพิ่มยอดวิว
router.post("/visit", async (req, res) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create({
        visits: 0,
        todayVisitors: 0,
        lastResetDate: new Date()
      });
    }

    const now = new Date();

    const lastReset = new Date(stats.lastResetDate);

    const isDifferentDay =
      now.getFullYear() !== lastReset.getFullYear() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getDate() !== lastReset.getDate();

    if (isDifferentDay) {
      stats.todayVisitors = 0;
      stats.lastResetDate = now;
    }

    stats.visits += 1;
    stats.todayVisitors += 1;

    await stats.save();

    res.json({
      success: true,
      visits: stats.visits
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

// อ่านสถิติ
router.get("/", auth, async (req, res) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create({
        visits: 0,
        todayVisitors: 0,
        lastResetDate: new Date()
      });
      const now = new Date();

      const lastReset = new Date(stats.lastResetDate);

      const isDifferentDay =
        now.getFullYear() !== lastReset.getFullYear() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getDate() !== lastReset.getDate();

      if (isDifferentDay) {
        stats.todayVisitors = 0;
        stats.lastResetDate = now;
        await stats.save();
      }
    }

    res.json(stats);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;