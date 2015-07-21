'use strict';

var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
    
    for_user: Object,
    
    by_user:  Object,
    
    alert_type: String,
    
    project_name: String,
    
    project_id: String,
    
    message: String,
    
    poke_ctr: {
        type: Number,
        default: 1
    },
    
    created_date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Alert', AlertSchema);