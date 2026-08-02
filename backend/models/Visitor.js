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
        browser: {
            type: String,
            default: "",
        },

        language: {
            type: String,
            default: "",
        },

        platform: {
            type: String,
            default: "",
        },

        screen: {
            width: Number,
            height: Number,
        },

        timezone: {
            type: String,
            default: "",
        },

        referrer: {
            type: String,
            default: "",
        },

    },
    {
        timestamps: true,
    });

console.log("VISITOR MODEL LOADED");
console.log(visitorSchema.obj);

module.exports = mongoose.model(
    "Visitor",
    visitorSchema
);