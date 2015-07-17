'use strict';

var express = require('express');
var router = express.Router();
var Poke = require('./pokeSchema');
var ObjectId = require('mongoose').Types.ObjectId;
var geoip = require('geoip-lite');
var crypto = require('crypto');

/* Get pokes. */
router.get('/', function(req, res, next) {
    
    var query = Poke.find({
        "for_user.user_id" : req.query.user_id
    }, null, {
        sort: {
            _id: -1,
        }
    });
    
    query
        .exec(function(err, users) {
            if (err) return next(err);
            
            res.json(users);
        });
});

/* Save Poke */
router.post('/', function(req, res, next) {
    
    Poke.findOne({
        "by_user.user_id" : req.body.by_user.user_id,
        "for_user.user_id" : req.body.for_user.user_id
    }, function (err, post) {

        if (err) next(err);
        if ( post == null ) {
            // no pokes existing yet
            Poke.create(req.body, function(err, post) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                res.json(post);
            });
        } else {
            
            if ( post.poke_ctr >= 5 ) {
                res.json({error: "Too much pokes!"});
            } else {
                post.poke_ctr++;
                
                post.save();
                res.json(post);
            }
        }
    });
});

/* Delete Poke */
router.delete('/:id', function(req, res, next) {

    Poke.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;