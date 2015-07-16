'use strict';

var express = require('express');
var router = express.Router();
var ContactUs = require('./contactUsSchema');
var ObjectId = require('mongoose').Types.ObjectId;
var geoip = require('geoip-lite');
var crypto = require('crypto');

/* Get messages. */
router.get('/', function(req, res, next) {
    
    var pageNo = req.query.pageNo || 1;
    var recordsPerPage = req.query.recordsPerPage;
    
    var query = ContactUs.find({}, null, {
        sort: {
            _id: -1,
        }
    });
    
    // skip previous records and limit record retrieval to recordsPerPage
    query
        .skip((pageNo - 1) * recordsPerPage)
        .limit(recordsPerPage);
    
    query
        .exec(function(err, users) {
            if (err) return next(err);
            
            res.json(users);
        });
});

/* Submit message */
router.post('/', function(req, res, next) {

    ContactUs.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;