'use strict';

var mongoose = require('mongoose');

var RatingSchema = new mongoose.Schema({
    project_id: mongoose.Schema.Types.ObjectId,
    owner_id: {
        type: String,
        default: ""
    },
    rated_by: mongoose.Schema.Types.ObjectId,
    value: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('Rating', RatingSchema);