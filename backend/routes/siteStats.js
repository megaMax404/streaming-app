console.log("SITE STATS ROUTE LOADED");
const express = require("express");
const router = express.Router();

const SiteStat = require("../models/SiteStat");
const Visitor = require("../models/Visitor");
console.log("Visitor model file =", require.resolve("../models/Visitor"));
console.log(Visitor.schema.obj);
/*
==========================
VISITOR
==========================
*/

router.post("/visit", async (req, res) => {

    try {

        const fingerprint = req.body.fingerprint;

        if (!fingerprint) {
            return res.status(400).json({
                success: false,
                message: "fingerprint missing"
            });
        }

        //------------------------------------
        // TODAY
        //------------------------------------

        const now = new Date();

        const today =
            now.toISOString().slice(0, 10);

        //------------------------------------
        // VISITOR
        //------------------------------------

        let visitor =
            await Visitor.findOne({
                fingerprint
            });

        let isUniqueToday = false;

        if (!visitor) {

            visitor =
                await Visitor.create({
                    fingerprint,
                    firstVisit: now,
                    lastVisit: now,
                    lastSeen: now,
                    visitCount: 1
                });

            isUniqueToday = true;

        } else {

            const last =
                visitor.lastVisit
                    .toISOString()
                    .slice(0, 10);

            if (last !== today) {

                isUniqueToday = true;

            }
            console.log("UPDATE VISITOR");
            visitor.lastVisit = now;
            visitor.lastSeen = now;
            visitor.visitCount += 1;

            await visitor.save();
            const check = await Visitor.findById(visitor._id);

            console.log("AFTER SAVE");
            console.log(check);
            console.log(visitor);
        }

        //------------------------------------
        // SITE STAT
        //------------------------------------

        let stat =
            await SiteStat.findOne({
                date: today
            });

        if (!stat) {

            stat =
                await SiteStat.create({

                    date: today

                });

        }

        stat.pageViews += 1;

        if (isUniqueToday) {
            stat.uniqueVisitors += 1;
            stat.todayVisitors += 1;
        }

        await stat.save();

        res.json({

            success: true,

            stat

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false

        });

    }

});

/*
==========================
HEARTBEAT
==========================
*/

router.post("/heartbeat", async (req, res) => {

    try {

        const { fingerprint } = req.body;

        if (!fingerprint) {
            return res.status(400).json({
                success: false
            });
        }

        await Visitor.findOneAndUpdate(
            { fingerprint },
            {
                lastSeen: new Date()
            }
        );

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
==========================
GET TODAY STATS
==========================
*/

router.get("/stats", async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        const stat = await SiteStat.findOne({ date: today });

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const onlineNow = await Visitor.countDocuments({
            lastSeen: { $gte: fiveMinutesAgo }
        });

        res.json({
            date: today,

            pageViews: stat?.pageViews || 0,

            uniqueVisitors: stat?.uniqueVisitors || 0,

            movieViews: stat?.movieViews || 0,

            todayVisitors: stat?.todayVisitors || 0,

            onlineNow,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

/*
==========================
MOVIE VIEW
==========================
*/

router.post("/movie-view", async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        let stat = await SiteStat.findOne({ date: today });

        if (!stat) {
            stat = await SiteStat.create({
                date: today,
            });
        }

        stat.movieViews += 1;

        await stat.save();

        res.json({
            success: true,
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
        });

    }
});

module.exports = router;