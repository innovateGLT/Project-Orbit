'use strict';

var mongoose = require('mongoose');

var ProjectStatsSchema = new mongoose.Schema({

    keyword: {
        type: String,
        default: '',
        index: true
    },
    user_id: {
        type: String,
        default: false,
        index: true
    },
    category: {
        type: String,
        default: false,
        index: true
    },
    project_count: {
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

module.exports = mongoose.model('ProjectStats', ProjectStatsSchema);