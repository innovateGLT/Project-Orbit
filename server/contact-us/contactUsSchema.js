'use strict';

var mongoose = require('mongoose');

var ContactUsSchema = new mongoose.Schema({
    
    user: mongoose.Schema.Types.Mixed,
    
    message: String
    
});

module.exports = mongoose.model('ContactUs', ContactUsSchema);