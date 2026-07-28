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

        visitCount: {
            type: Number,
            default: 1,
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