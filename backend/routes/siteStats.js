const express = require("express");
const router = express.Router();

const {
    getTodayStat,
    getHistory,
    getOnlineNow,
    addMovieView
} = require("../services/statisticsService");

const {
    visit,
    pageView,
    heartbeat
} = require("../services/visitorService");

/*
==========================
VISITOR
==========================
*/

router.post("/visit", async (req, res) => {

    try {

        const stat = await visit(
            req.body.fingerprint,
            req
        );

        res.json({
            success: true,
            stat
        });

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
HEARTBEAT
==========================
*/

router.post("/heartbeat", async (req, res) => {

    try {

        const { fingerprint } = req.body;

        if (!fingerprint) {

            return res.status(400).json({
                success: false,
                message: "fingerprint missing"
            });

        }

        await heartbeat(fingerprint);

        res.json({
            success: true
        });

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
GET TODAY STATS
==========================
*/

router.get("/stats", async (req, res) => {

    try {

        const stat = await getTodayStat();
        const onlineNow = await getOnlineNow();

        res.json({

            date: stat.date,
            pageViews: stat.pageViews,
            uniqueVisitors: stat.uniqueVisitors,
            movieViews: stat.movieViews,
            todayVisitors: stat.todayVisitors,
            onlineNow

        });

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
HISTORY
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
            success: true
        });

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
PAGE VIEW
==========================
*/

router.post("/page-view", async (req, res) => {

    try {

        await pageView(
            req.body.fingerprint,
            req
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;