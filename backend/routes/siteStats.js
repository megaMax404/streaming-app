const express = require("express");
const router = express.Router();

const SiteStat = require("../models/SiteStat");
const Visitor = require("../models/Visitor");

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

            visitor.visitCount += 1;

            await visitor.save();

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

        stat.todayVisitors += 1;

        if (isUniqueToday) {

            stat.uniqueVisitors += 1;

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
GET TODAY
==========================
*/

router.get("/", async (req, res) => {

    try {

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        const stat =
            await SiteStat.findOne({
                date: today
            });

        res.json(stat);

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;