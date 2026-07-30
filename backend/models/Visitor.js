console.log("Visitor.js loaded");
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
        lastSeen: {
            type: Date,
            default: Date.now,
        },

        lastPageView: {
            type: Date,
            default: null,
        },

        visitCount: {
            type: Number,
            default: 1,
        },
        country: {
            type: String,
            default: "Unknown",
        },

        city: {
            type: String,
            default: "",
        },

        ip: {
            type: String,
            default: "",
        },

    },
    {
        timestamps: true,
    });

console.log(visitorSchema.obj);

module.exports = mongoose.model(
    "Visitor",
    visitorSchema
);