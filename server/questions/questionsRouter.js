'use strict';

var express = require('express');
var router = express.Router();
var Question = require('./questionsSchema');
var ObjectId = require('mongoose').Types.ObjectId;

/* GET /questions listing. */
router.get('/', function(req, res, next) {
    // console.log(req);
    ;
    Question.find({
        project_id: new ObjectId(req.query.project_id)
    }, null, {
        sort: {
            _id: -1,
        }
    }, function(err, questions) {
        if (err) return next(err);
        res.json(questions);
    });
});

/* POST /questions */
router.post('/', function(req, res, next) {
    Question.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /questions/id */
router.get('/:id', function(req, res, next) {
    Question.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /questions/:id */
router.put('/:id', function(req, res, next) {
    Question.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /questions/:id */
router.delete('/:id', function(req, res, next) {
    Question.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;