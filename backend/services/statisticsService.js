const SiteStat = require("../models/SiteStat");

async function getTodayStat() {
    const today = new Date().toISOString().slice(0, 10);

    let stat = await SiteStat.findOne({ date: today });

    if (!stat) {
        stat = await SiteStat.create({ date: today });
    }

    return stat;
}

async function getHistory(days = 7) {
    return await SiteStat.find()
        .sort({ date: -1 })
        .limit(days);
}

async function addMovieView() {
    const stat = await getTodayStat();

    stat.movieViews++;

    await stat.save();

    return stat;
}

async function addPageView(visitor, now) {
    const stat = await getTodayStat();

    stat.pageViews++;

    visitor.lastPageView = now;

    await Promise.all([
        visitor.save(),
        stat.save()
    ]);

    return stat;
}

async function addUniqueVisitor(stat) {
    stat.uniqueVisitors++;
    stat.todayVisitors++;

    await stat.save();

    return stat;
}

module.exports = {
    getTodayStat,
    getHistory,
    addMovieView,
    addPageView,
    addUniqueVisitor
};