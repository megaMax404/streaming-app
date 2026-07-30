const Visitor = require("../models/Visitor");
const getLocation = require("../utils/getLocation");

async function findOrCreateVisitor(fingerprint, req) {

    const now = new Date();

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    const location =
        await getLocation(ip);

    let visitor =
        await Visitor.findOne({ fingerprint });

    let isNew = false;

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

            lastPageView: null,

            visitCount: 1

        });

        isNew = true;
        isUniqueToday = true;

    } else {

        const lastVisitDay =
            visitor.lastVisit
                .toISOString()
                .slice(0, 10);

        const today =
            now.toISOString().slice(0, 10);

        if (lastVisitDay !== today) {
            isUniqueToday = true;
        }

        visitor.lastVisit = now;
        visitor.lastSeen = now;
        visitor.ip = ip;

        if (!visitor.country || visitor.country === "Unknown") {
            visitor.country = location.country;
            visitor.city = location.city;
        }

        visitor.visitCount++;
        await visitor.save();
    }

    return {
        visitor,
        isNew,
        isUniqueToday
    };
}

async function heartbeat(fingerprint){
    return await Visitor.findOneAndUpdate(
        { fingerprint },
        {
            lastSeen:new Date()
        }
    );
}

module.exports = {
    findOrCreateVisitor,
    heartbeat
};