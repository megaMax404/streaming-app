const Visitor = require("../models/Visitor");
const getLocation = require("../utils/getLocation");

const {
    getTodayStat,
    addUniqueVisitor,
    addPageView
} = require("./statisticsService");

/*
==========================
CREATE / FIND VISITOR
==========================
*/

async function findOrCreateVisitor(fingerprint, req) {

    const now = new Date();

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    const location = await getLocation(ip);
    const {
        browser,
        language,
        platform,
        screen,
        timezone,
        referrer
    } = req.body;

    console.log(req.body);

    let visitor = await Visitor.findOne({ fingerprint });

    let isUniqueToday = false;

    if (!visitor) {

        visitor = new Visitor({
            fingerprint,

            ip,

            country: location.country,
            city: location.city,

            browser,
            language,
            platform,

            screen,

            timezone,

            referrer,

            firstVisit: now,
            lastVisit: now,
            lastSeen: now,

            lastPageView: null,

            visitCount: 1
        });

        isUniqueToday = true;

    } else {

        const today = now.toISOString().slice(0, 10);
        const lastVisit =
            visitor.lastVisit.toISOString().slice(0, 10);

        if (today !== lastVisit) {
            isUniqueToday = true;
        }

        visitor.lastVisit = now;
        visitor.lastSeen = now;
        visitor.ip = ip;

        visitor.browser = browser;
        visitor.language = language;
        visitor.platform = platform;
        visitor.screen = screen;
        visitor.timezone = timezone;
        visitor.referrer = referrer;

        if (!visitor.country || visitor.country === "Unknown") {
            visitor.country = location.country;
            visitor.city = location.city;
        }

        visitor.visitCount++;
    }

    console.log("VISITOR BEFORE SAVE");
    console.log(visitor);
    
    return {
        visitor,
        isUniqueToday
    };
}

/*
==========================
VISIT
==========================
*/

async function visit(fingerprint, req) {

    if (!fingerprint)
        throw new Error("fingerprint missing");

    const {
        visitor,
        isUniqueToday
    } = await findOrCreateVisitor(
        fingerprint,
        req
    );

    if (isUniqueToday) {
        await addUniqueVisitor();
    }

    const now = new Date();

    const PAGEVIEW_TIMEOUT = 30000;

    let stat;

    if (
        !visitor.lastPageView ||
        now - visitor.lastPageView > PAGEVIEW_TIMEOUT
    ) {

        stat = await addPageView(visitor);

    } else {

        stat = await getTodayStat();

        await visitor.save();
    }

    return stat;
}

/*
==========================
PAGE VIEW
==========================
*/

async function pageView(fingerprint, req) {

    if (!fingerprint)
        throw new Error("fingerprint missing");

    const {
        visitor
    } = await findOrCreateVisitor(
        fingerprint,
        req
    );

    const now = new Date();

    const PAGE_TIMEOUT = 30000;

    if (
        !visitor.lastPageView ||
        now - visitor.lastPageView > PAGE_TIMEOUT
    ) {

        await addPageView(visitor);

    } else {

        await visitor.save();

    }

    return true;
}

/*
==========================
HEARTBEAT
==========================
*/

async function heartbeat(fingerprint) {

    return await Visitor.findOneAndUpdate(
        { fingerprint },
        {
            $set: {
                lastSeen: new Date()
            }
        },
        {
            returnDocument: "after"
        }
    );

}

module.exports = {
    visit,
    pageView,
    heartbeat,
    findOrCreateVisitor
};