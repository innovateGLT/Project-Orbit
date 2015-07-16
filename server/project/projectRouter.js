'use strict';

var express = require('express');
var Q = require('q');
var router = express.Router();
var Project = require('./projectSchema');
var User = require('../users/usersSchema');

/* GET /projects listing. */
router.get('/', function(req, res, next) {

    var pageNo = req.query.pageNo || 1;
    var recordsPerPage = req.query.recordsPerPage;
    var keyword = req.query.keyword;

    var query = null; 
    
    // if category is in the params
    if ( req.query.category ) {
        query = Project.find({
            category: req.query.category
        });
    } else {
        query = Project.find();
    }

    // if country is in the params
    if ( req.query.country ) {
        query.or([{
            country: new RegExp(req.query.country, 'i')
        }, {
            visibility: "Global"
        }, {
            location: new RegExp(req.query.country, 'i')
        }]);
    }
    
    if ( keyword ) {
    
        query.and({
            $or : [{
                'user.name': new RegExp(keyword, 'i')
            }, {
        
                title: new RegExp(keyword, 'i')
            }, {
                description: new RegExp(keyword, 'i')
            }, {
                category: new RegExp(keyword, 'i')
            }, {
                skillset: {
                     $in: [new RegExp(keyword, 'i')]
                }
            }]
        });
    }
    

    // skip previous records and limit record retrieval to recordsPerPage
    query
        .skip((pageNo - 1) * recordsPerPage)
        .limit(recordsPerPage);

    query
        .exec(function(err, post) {
            if (err) return next(err);
            
            res.json(post);
        });
});


/* GET /projects/featured */
router.get('/featured', function(req, res, next) {

    // console.log("USEr ID",req.params.user_id );
    var query = Project.find({
        'featured': true
    }).limit(4);

    query.or([{
        country: new RegExp(req.query.country, 'i')
    }, {
        visibility: "global"
    }]);

    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /projects/completed/by_user_id/:user_id */
router.get('/completed/by_user_id/:user_id', function(req, res, next) {
    // summary
    //      retrieve all projects owned by this user and all projects he is involved with, which has Completed status
    // params
    //      user_id - the id of the user
    // returns
    //      the list of completed projects

    var query = Project.find({
        $or : [
            { 'user.user_id': req.params.user_id },
            { 'selectedUsers.user_id' : req.params.user_id } 
        ],
        'status': 'Completed'
    });

    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /projects/matched/by_user_id/:user_id */
router.get('/matched/by_user_id/:user_id', function(req, res, next) {
    // summary
    //      get project suggestions based on the users skills and interests
    //      retrieve the user skills and interests first, and use it at as parameters in retrieving matched projects
    //      retrieve only projects that user is not involved, invited and applied
    // params
    //      user_id - the user id of the current user
    // return
    //      the list of suggested projects the user might be interested in

    var skillsAndInterests = [];
    
    // retrieve the user first
    User.findOne({
        user_id: req.params.user_id
    }, function(err, post) {
        if (err) return next(err);
        
        // append the skills
        post.skills.forEach(function ( skill ) {
            skillsAndInterests.push(new RegExp(skill, "i"));
        });
        
        // append the interests
        post.interests.forEach(function ( interest ) {
            skillsAndInterests.push(new RegExp(interest, "i"));
        });

        // rertieve all matching projects, limit only to 4
        var query = Project.find({
            "skillset" : { 
                $in : skillsAndInterests 
            },
            "selectedUsers.user_id" : {
                $ne : req.params.user_id
            },
            "invitedUsers.user_id" : {
                $ne : req.params.user_id
            },
            "appliedUsers.user_id" : {
                $ne : req.params.user_id
            }
        }).limit(4);
        
        query.exec(function (err, records) {
            if (err) {
                next(err);
            }
            
            res.json(records);
        });
    });

    
    
});

/* GET /projects/by_user_id/:user_id */
router.get('/by_user_id/:user_id', function(req, res, next) {
    // summary
    //      retrieves all project authored by this user and projects currently he's involved with
    // params
    //      user_id - the id of the user
    // return 
    //      the list of projects


    Project
        .find({
            $or : [
                {'user.user_id' : req.params.user_id},
                { 'selectedUsers' : {
                    $elemMatch : { 'user_id' : req.params.user_id }
                }}
            ]
        })
        
        .where('status').in(['Open', 'In Progress'])

        .exec(function(err, post) {
            if (err) return next(err);
            res.json(post);
        });
});

router.get('/invited', function(req, res, next) {

    console.log("USER ID", req.query.id);
    var query = Project.find({
        'invitedUsers': {
            $elemMatch: {
                user_id: req.query.id
            }
        }
    });


    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /projects/by_id/:user_id */
router.get('/search', function(req, res, next) {

    console.log("USEr ID", req.query.q);
    var query = Project.find({
        country: req.query.country
    });

    query.or([{
        'user.name': new RegExp(req.query.q, 'i')
    }, {

        title: new RegExp(req.query.q, 'i')
    }, {
        description: new RegExp(req.query.q, 'i')
    }, {
        category: new RegExp(req.query.q, 'i')
    }, {
        skillset: {
             $in: [new RegExp(req.query.q, 'i')]
        }
    }]);

    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* POST /projects */
router.post('/', function(req, res, next) {
    Project.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
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

router.post('/apply', function(req, res, next) {

    var dat = req.body;

    getUser(dat.user_id).then(
        
        // success callback
        function ( user ) {
            Project.findByIdAndUpdate(dat.project_id, {
                $addToSet: {
                    appliedUsers: {
                        user_id : user.user_id,
                        picture : user.picture,
                        name: user.name
                    }
                }
            }, function(err, post) {
                if (err) return next(err);
                res.json(post);
            });
        },
        
        // error callback
        function ( error ) {
            console.log( error );
        }
    );
});

/* GET /projects/id */
router.get('/:id', function(req, res, next) {
    Project.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        
        res.json(post);
    });
});

/* PUT /projects/:id */
router.put('/:id', function(req, res, next) {
    Project.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /projects/:id */
router.delete('/:id', function(req, res, next) {
    Project.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;