'use strict';

var mongoose = require('mongoose');

var PageStatsSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
        index: true
    },
    country: {
        type: String,
        default: false,
        index: true
    },
    created_at: {
        type: Date,
        default: new Date(),
        index: true
    },
});

module.exports = mongoose.model('PageStats', PageStatsSchema);