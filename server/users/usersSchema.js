'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    user_id: String,
    name: String,
    email: {
        type: String,
        default: ''
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'regular'
    },
    nickname: String,
    picture: String,
    given_name: {
        type: String,
        default: ''
    },
    family_name: {
        type: String,
        default: ''
    },
    dept: {
        type: String,
        default: ""
    },
    job_role: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    featured: {
        type: Boolean,
        default: false
    },
    skills: {
        type: Array,
        default: []
    },
    interests: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);