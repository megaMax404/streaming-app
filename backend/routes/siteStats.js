const express = require("express");
const router = express.Router();

const Visitor = require("../models/Visitor");

const {
    getTodayStat,
    getHistory,
    addMovieView,
    addPageView,
    addUniqueVisitor
} = require("../services/statisticsService");

const {
    findOrCreateVisitor,
    heartbeat
} = require("../services/visitorService");
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

        const {
            visitor,
            isUniqueToday
        } = await findOrCreateVisitor(
            fingerprint,
            req
        );

        const now = new Date();
        //------------------------------------
        // SITE STAT
        //------------------------------------

        const stat =
            await getTodayStat();

        if (isUniqueToday) {
            await addUniqueVisitor(stat);
        }

        const PAGEVIEW_TIMEOUT = 30 * 1000;

        const shouldCountPageView =
            !visitor.lastPageView ||
            (now - visitor.lastPageView) > PAGEVIEW_TIMEOUT;

        if (shouldCountPageView) {
            await addPageView(visitor, now);
        } else {
            await Promise.all([
                visitor.save(),
                stat.save()
            ]);
        }

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

        await heartbeat(fingerprint);

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
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const onlineNow = await Visitor.countDocuments({
            lastSeen: { $gte: fiveMinutesAgo }
        });

        res.json({
            date: stat.date,
            pageViews: stat.pageViews,
            uniqueVisitors: stat.uniqueVisitors,
            movieViews: stat.movieViews,
            todayVisitors: stat.todayVisitors,
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

        const history = await getHistory(days);

        res.json(history);

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
        await addMovieView();

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
    try {
        const { fingerprint } = req.body;
        if (!fingerprint) {
            return res.status(400).json({
                success: false
            });
        }

        const {
            visitor
        } = await findOrCreateVisitor(
            fingerprint,
            req
        );
        const now = new Date();
        const PAGE_TIMEOUT = 30000;
        const shouldCount =
            !visitor.lastPageView ||
            (now - visitor.lastPageView) >
            PAGE_TIMEOUT;

        if (shouldCount) {
            await addPageView(visitor, now);
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