const express = require("express");
const router = express.Router();

const SiteStat = require("../models/SiteStat");
const Visitor = require("../models/Visitor");
const getLocation = require("../utils/getLocation");
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

        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress;
            console.log("REAL IP =", ip);
        const location =
            await getLocation(ip);
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

            visitor = await Visitor.create({
                fingerprint,

                ip,

                country: location.country,

                city: location.city,

                firstVisit: now,

                lastVisit: now,

                lastSeen: now,

                lastPageView: now,

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

            visitor.lastVisit = now;
            visitor.lastSeen = now;
            visitor.ip = ip;

            if (
                visitor.country === "Unknown" ||
                !visitor.country
            ) {

                visitor.country = location.country;

                visitor.city = location.city;

            }
            visitor.visitCount += 1;

            await visitor.save();
            const check = await Visitor.findById(visitor._id);
            console.log(check);
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

        if (isUniqueToday) {
            stat.uniqueVisitors += 1;
            stat.todayVisitors += 1;
        }

        const PAGEVIEW_TIMEOUT = 30 * 1000;

        const shouldCountPageView =
            !visitor.lastPageView ||
            (now - visitor.lastPageView) > PAGEVIEW_TIMEOUT;

        if (shouldCountPageView) {
            stat.pageViews += 1;

            visitor.lastPageView = now;

            await visitor.save();
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
GET HISTORY
==========================
*/

router.get("/history", async (req, res) => {
    try {
        const days = Number(req.query.days || 7);

        const history = await SiteStat.find()
            .sort({ date: -1 })
            .limit(days);

        res.json(history.reverse());

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
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

/*
==========================
PAGE-VIEW
==========================
*/

router.post("/page-view", async (req, res) => {
    console.log("PAGE VIEW HIT");
    console.log(req.body);


    try {
        const { fingerprint } = req.body;

        const now = new Date();

        const today = now.toISOString().slice(0, 10);

        let visitor = await Visitor.findOne({
            fingerprint
        });

        if (!visitor) {

            visitor = await Visitor.create({
                fingerprint,
                firstVisit: now,
                lastVisit: now,
                lastSeen: now,
                lastPageView: now,
                visitCount: 1
            });

        }

        const PAGE_TIMEOUT = 30000;

        const shouldCount =
            !visitor.lastPageView ||
            (now - visitor.lastPageView) > PAGE_TIMEOUT;

        if (shouldCount) {

            let stat =
                await SiteStat.findOne({
                    date: today
                });

            if (!stat) {

                stat = await SiteStat.create({
                    date: today
                });

            }

            stat.pageViews++;

            await stat.save();

            visitor.lastPageView = now;

            await visitor.save();

        }

        res.json({
            success: true
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;