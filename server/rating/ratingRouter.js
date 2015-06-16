'use strict';

var express = require('express');
var router = express.Router();
var Rating = require('./ratingSchema');
var ObjectId = require('mongoose').Types.ObjectId;

/* GET /rating listing. */
router.get('/', function(req, res, next) {
    // console.log(req);
    ;
    Rating.find({
        project_id: new ObjectId(req.query.project_id)
    }, null, {
        sort: {
            _id: -1,
        }
    }, function(err, rating) {
        if (err) return next(err);
        res.json(rating);
    });
});


/* GET /rating/project listing. */
router.get('/project/:id', function(req, res, next) {
    // console.log(req);
    ;
    Rating.find({
        project_id: new ObjectId(req.params.id)
    }, null, {
        sort: {
            _id: -1,
        }
    }, function(err, rating) {
        if (err) return next(err);

        var count = 0;
        var totalVal = 0;
        for (var i = 0; i < rating.length; i++) {
            totalVal += rating[i].value;
            count += 1;
        };

        if (count == 0) {
            res.json({
                count: count,
                value: 0
            });
        } else {
            res.json({
                count: count,
                value: totalVal / count
            });
        }

    });
});

/* GET /rating/rated/:project_id/rated_by/:user_id check if the project has been rate by  user. */
router.get('/rated/:project_id/rated_by/:user_id', function(req, res, next) {
    // console.log(req);
    ;
    Rating.find({
        project_id: new ObjectId(req.params.project_id),
        rated_by: new ObjectId(req.params.user_id)
    }, null, {
        sort: {
            _id: -1,
        }
    }, function(err, rating) {
        if (err) return next(err);

        if (rating.length == 0) {
            res.json({
                rated: false
            });
        } else {
            res.json({
                rated: true,
                value: rating[0].value
            });
        }

    });
});

/* POST /rating */
router.post('/', function(req, res, next) {
    Rating.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /rating/id */
router.get('/:id', function(req, res, next) {
    Rating.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;