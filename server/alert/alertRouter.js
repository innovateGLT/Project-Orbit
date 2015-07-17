'use strict';

var express = require('express');
var router = express.Router();
var Alert = require('./alertSchema');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../users/usersSchema');
var geoip = require('geoip-lite');
var crypto = require('crypto');
var Q = require('q');

/* Get alerts. */
router.get('/', function(req, res, next) {
    
    var query = Alert.find({
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

function getUser( userId ) {
    
    var deferred = Q.defer();
    
    User.findOne({
        user_id: userId
    }, function(err, userRecord) {
        
        deferred.resolve( userRecord );
        
    });
    
    return deferred.promise;
}

/* Save Alert */
router.post('/', function(req, res, next) {
    
    Alert.findOne({
        "by_user.user_id" : req.body.by_user.user_id,
        "for_user.user_id" : req.body.for_user.user_id,
        "alert_type" : req.body.alert_type
    }, function (err, post) {

        if (err) next(err);
        if ( !post ) {
            // no pokes existing yet
            
            var record = req.body;
            var deferred = Q.defer();
            
            // if project owner owner has no picture in the project record, get user picture
                
            console.log("has no picture : " + !record.for_user.picture);
            if ( !record.for_user.picture ) {
                
                getUser( req.body.for_user.user_id ).then( function ( userRecord ) {
                    console.log(" ---- piture : " + userRecord.picture);
                    record.for_user.picture = userRecord.picture;
                    
                    deferred.resolve();
                } );
                    
            } else {
                deferred.resolve();
            }
            
            deferred.promise.then(function () {
                Alert.create(record, function(err, post) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    res.json(post);
                });
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

/* Delete Alert */
router.delete('/:id', function(req, res, next) {

    Alert.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;