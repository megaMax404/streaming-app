const mongoose = require("mongoose");

const siteStatSchema = new mongoose.Schema(
{
    date: {
        type: String,
        unique: true,
    },

    pageViews: {
        type: Number,
        default: 0,
    },

    uniqueVisitors: {
        type: Number,
        default: 0,
    },

    movieViews: {
        type: Number,
        default: 0,
    },

    todayVisitors: {
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model(
    "SiteStat",
    siteStatSchema
);