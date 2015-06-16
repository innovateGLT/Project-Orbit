'use strict';

var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    title: String,
    category: String,
    chargeable: Boolean,
    description: String,
    skillset: Array,
    effortRequired: {
        type: String,
        default: '1 Hour(s)'
    },
    skillCategory: {
        type: String,
        default: 'Technical'
    },
    timeAvailability: {
        type: String,
        default: '10 hours per Day'
    },
    country: {
        type: String,
        default: 'CANADA'
    },
    postedEndDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    user: mongoose.Schema.Types.Mixed,
    featured: {
        type: Boolean,
        default: false
    },
    appliedUsers: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    invitedUsers: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    selectedUsers: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    status: {
        type: String,
        default: 'Open'
    },
    visibility: {
        type: String,
        default: 'global'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, {
    strict: false
});

module.exports = mongoose.model('Project', ProjectSchema);