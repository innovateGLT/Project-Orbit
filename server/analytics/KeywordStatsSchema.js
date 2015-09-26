'use strict';

var mongoose = require('mongoose');

var KeywordStatsSchema = new mongoose.Schema({

    name: {
        type: String,
        default: '',
        index: true
    },
    user_id: {
        type: String,
        default: false,
        index: true
    },
    role: {
        type: String,
        default: 'regular',
        index: true
    },
    job_role: {
        type: String,
        default: 'regular',
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

module.exports = mongoose.model('KeywordStats', KeywordStatsSchema);