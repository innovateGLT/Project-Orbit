'use strict';

var mongoose = require('mongoose');

var PokeSchema = new mongoose.Schema({
    
    for_user: Object,
    
    by_user:  Object,
    
    poke_ctr: {
        type: Number,
        default: 1
    }
    
});

module.exports = mongoose.model('Poke', PokeSchema);