'use strict';

var mongoose = require('mongoose');

var SkillsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: ""
    },
    peopleSoftId: {
        type: Number,
        default: ""
    },
    category: {
        type: String,
        default: ""
    },
    technology: {
        type: String,
        default: ""
    },
    skill: {
        type: String,
        default: ""
    },
    rating: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    subdepartment: {
        type: String,
        default: ""
    },
    groupName: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    }
 

}, {collection: 'skills'});
module.exports = mongoose.model('Skills', SkillsSchema);

