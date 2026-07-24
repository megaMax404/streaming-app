const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
{
    fingerprint: {
        type: String,
        unique: true,
    },

    firstVisit: {
        type: Date,
        default: Date.now,
    },

    lastVisit: {
        type: Date,
        default: Date.now,
    },

    visitCount: {
        type: Number,
        default: 1,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model(
    "Visitor",
    visitorSchema
);