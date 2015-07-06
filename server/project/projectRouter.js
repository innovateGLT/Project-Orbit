'use strict';

var express = require('express');
var router = express.Router();
var Project = require('./projectSchema');
var User = require('../users/usersSchema');

/* GET /projects listing. */
router.get('/', function(req, res, next) {


    if ((req.query.category != "") && (req.query.category != undefined)) {
        var query = Project.find({
            category: req.query.category
        });
    } else {
        var query = Project.find();
    }

    if ((req.query.country != "") && (req.query.country != undefined)) {
        query.or([{
            country: req.query.country
        }, {
            visibility: "global"
        }]);
    } else {

    }




    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
    // Project.find(function (err, projects) {
    //   if (err) return next(err);
    //   res.json(projects);
    // });
});


/* GET /projects/featured */
router.get('/featured', function(req, res, next) {

    // console.log("USEr ID",req.params.user_id );
    var query = Project.find({
        'featured': true
    }).limit(4);

    query.or([{
        country: req.query.country
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

    // console.log("USEr ID",req.params.user_id );
    var query = Project.find({
        'user.user_id': req.params.user_id,
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

    // console.log("USEr ID",req.params.user_id );
    var query = Project.find({
        'user.user_id': req.params.user_id
    });

    query.or([{
        status: "Open"
    }, {
        status: "In Progress"
    }]);

    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.get('/invited', function(req, res, next) {

    console.log("USEr ID", req.query.id);
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


router.post('/apply', function(req, res, next) {

    var dat = req.body;

    var user = {
        user_id: dat.user_id,
        name: dat.name
    };

    // console.log(dat);
    Project.findByIdAndUpdate(dat.project_id, {
        $addToSet: {
            appliedUsers: user
        }
    }, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
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