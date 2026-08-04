const SiteStat = require("../models/SiteStat");
const Visitor = require("../models/Visitor");

/*
==========================
GET TODAY STAT
==========================
*/

async function getTodayStat() {

    const today = new Date()
        .toISOString()
        .slice(0, 10);

    let stat = await SiteStat.findOne({
        date: today
    });

    if (!stat) {

        stat = await SiteStat.create({
            date: today
        });

    }

    return stat;
}

/*
==========================
HISTORY
==========================
*/

async function getHistory(days = 7) {

    const history = await SiteStat.find()
        .sort({
            date: -1
        })
        .limit(days);

    return history.reverse();

}

/*
==========================
MOVIE VIEW
==========================
*/

async function addMovieView() {

    const stat = await getTodayStat();

    stat.movieViews++;

    await stat.save();

    return stat;

}

/*
==========================
UNIQUE VISITOR
==========================
*/

async function addUniqueVisitor() {

    const stat = await getTodayStat();

    stat.uniqueVisitors++;
    stat.todayVisitors++;

    await stat.save();

    return stat;

}

/*
==========================
PAGE VIEW
==========================
*/

async function addPageView(visitor) {

    const stat = await getTodayStat();

    visitor.lastPageView = new Date();

    stat.pageViews++;

    await Promise.all([
        visitor.save(),
        stat.save()
    ]);

    return stat;

}

/*
==========================
ONLINE NOW
==========================
*/

async function getOnlineNow() {

    const fiveMinutesAgo =
        new Date(Date.now() - 5 * 60 * 1000);

    return await Visitor.countDocuments({

        lastSeen: {
            $gte: fiveMinutesAgo
        }

    });

}

/*
==========================
VISITOR LIST
==========================
*/

async function getVisitors(
    page = 1,
    limit = 20,
    search = "",
    date = ""
) {

    const skip = (page - 1) * limit;

    let query = {};

    // Search
    if (search) {

        query.$or = [

            {
                country: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                city: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                browser: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                platform: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    // Filter Date
    if (date) {

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        query.firstVisit = {

            $gte: start,
            $lte: end

        };

    }

    const total =
        await Visitor.countDocuments(query);

    const visitors =
        await Visitor.find(query)
            .sort({
                lastSeen: -1
            })
            .skip(skip)
            .limit(limit);

    return {

        total,
        page,
        limit,
        visitors

    };

}

module.exports = {
    getTodayStat,
    getHistory,
    addMovieView,
    addUniqueVisitor,
    addPageView,
    getOnlineNow,
    getVisitors

};