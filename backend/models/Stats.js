const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    visits: {
        type: Number,
        default: 0
    },

    todayVisitors: {
        type: Number,
        default: 0
    },

    lastResetDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Stats", statsSchema);