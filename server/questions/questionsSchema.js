'use strict';

var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    content: String,
    project_id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.Mixed,
    createdDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Question', ProjectSchema);