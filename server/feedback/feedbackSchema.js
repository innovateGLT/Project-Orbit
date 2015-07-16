'use strict';

var mongoose = require('mongoose');

var FeedbackSchema = new mongoose.Schema({
    
    topic: Object,
    
    subtopic: Object,
    
    user: mongoose.Schema.Types.Mixed,
    
    message: String
    
});

module.exports = mongoose.model('Feedback', FeedbackSchema);