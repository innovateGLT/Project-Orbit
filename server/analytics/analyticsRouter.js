'use strict';

var express = require('express');
var router = express.Router();
var KeywordStats = require('./KeywordStatsSchema');
var ProjectStats = require('./ProjectStatsSchema');
var VisitorStats = require('./VisitorStatsSchema');
var PageStats = require('./PageStatsSchema');
var ObjectId = require('mongoose').Types.ObjectId;
var geoip = require('geoip-lite');
var crypto = require('crypto');


/* POST /users */
router.post('/keyword', function(req, res, next) {
    KeywordStats.create(req.body, function(err, keywordStat) {
        if (err) return next(err);
        req.body.created_at = new Date();
        res.json(keywordStat);
    });
});

router.post('/searched-project', function(req, res, next) {
    console.log(req.body);

    var catCounts = req.body.dat;


    for (var cat in catCounts) {
        var val = catCounts[cat];
        var stat = JSON.parse(JSON.stringify(req.body));
        delete stat.dat;
        stat.category = cat;
        stat.project_count = val;
        ProjectStats.create(stat, function(err, project) {
            if (err) return next(err);

        });
    }
    res.json({
        done: true
    });
});

router.post('/visitor', function(req, res, next) {

    var user_id = req.body.user_id;


    var country = req.body.country;


    // track page view
    PageStats.findOne({
        country: country
    }, {}, {
        sort: {
            'created_at': -1
        }
    }, function(err, pageStat) {
        if (err) return next(err);

        if (pageStat == null) {
            PageStats.create({
                count: 1,
                country: country
            }, function(err, user) {
                if (err) return next(err);

            });
        } else {
            console.log('pagestat', pageStat);

            var lastDate = pageStat.created_at;
            var now = new Date();

            if ((lastDate.getYear() == now.getYear()) && (lastDate.getMonth() == now.getMonth()) && (lastDate.getDate() == now.getDate())) {
                PageStats.findByIdAndUpdate(pageStat._id, {
                    $inc: {
                        count: 1
                    }
                }, function(err, user) {
                    if (err) return next(err);
                });
            } else {
                PageStats.create({
                    count: 1,
                    country: country
                }, function(err, user) {
                    if (err) return next(err);

                });
            }



        }
    })


    // track visit view
    VisitorStats.findOne({
        user_id: user_id
    }, {}, {
        sort: {
            'created_at': -1
        }
    }, function(err, user) {
        // console.log(user);
        if (err) return next(err);

        if (user == null) {
            req.body.created_at = new Date();
            VisitorStats.create(req.body, function(err, user) {
                if (err) return next(err);
                res.json(user);
            });
        } else {
            // console.log('foud_user', user);
            // 1000 milisec * 60 sec 
            var oneMIN = 1000 * 60;
            //10 means 10 mins
            var defaultInterval = 10;

            var lastVisitDate = user.created_at;
            var now = new Date();

            // Convert both dates to milliseconds
            var lastVisitTime = lastVisitDate.getTime();
            var currentTime = now.getTime();

            // Calculate the difference in milliseconds
            var difference_ms = currentTime - lastVisitTime;

            var interval = difference_ms / oneMIN; // calculate in min
            console.log('interval', interval);

            // create a new visit
            if (interval > defaultInterval) {
                req.body.created_at = new Date();
                VisitorStats.create(req.body, function(err, user) {
                    if (err) return next(err);
                    res.json(user);
                });
            } else {
                res.json(user);
            }



        }
    });



});


module.exports = router;