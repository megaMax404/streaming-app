const express = require("express");
const router = express.Router();

const SiteStat = require("../models/SiteStat");
const Visitor = require("../models/Visitor");

router.post("/visit", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers["user-agent"] || "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //---------------------------------------
    // ตรวจว่าคนนี้เคยเข้าวันนี้หรือยัง
    //---------------------------------------

    let visitor = await Visitor.findOne({
      ip,
      lastVisit: { $gte: today },
    });

    let isUnique = false;

    if (!visitor) {
      visitor = await Visitor.create({
        ip,
        userAgent,
        lastVisit: new Date(),
      });

      isUnique = true;
    } else {
      visitor.lastVisit = new Date();
      await visitor.save();
    }

    //---------------------------------------
    // Site Stat
    //---------------------------------------

    let stat = await SiteStat.findOne();

    if (!stat) {
      stat = await SiteStat.create({});
    }

    stat.totalVisits += 1;

    if (isUnique) {
      stat.uniqueVisitors += 1;
    }

    const lastDay = new Date(stat.lastReset);

    if (
      lastDay.getDate() !== new Date().getDate() ||
      lastDay.getMonth() !== new Date().getMonth() ||
      lastDay.getFullYear() !== new Date().getFullYear()
    ) {
      stat.todayVisits = 0;
      stat.lastReset = new Date();
    }

    stat.todayVisits += 1;

    await stat.save();

    res.json({
      success: true,
      totalVisits: stat.totalVisits,
      todayVisits: stat.todayVisits,
      uniqueVisitors: stat.uniqueVisitors,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;