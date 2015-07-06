'use strict';

var express = require('express');
var router = express.Router();
var User = require('./usersSchema');
var Skills = require('./skillsSchema');
var ObjectId = require('mongoose').Types.ObjectId;
var geoip = require('geoip-lite');
var crypto = require('crypto');

/* GET /users listing. */
router.get('/', function(req, res, next) {
    // console.log(req);
    User.find({}, null, {
        sort: {
            _id: -1,
        }
    }, function(err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

/* POST /users */
router.post('/', function(req, res, next) {

    var dat = req.body;

    dat.user_id = crypto.createHash('md5').update(dat.email).digest('hex');

    User.findOneAndUpdate({
        user_id: dat.user_id
    }, dat, {
        upsert: true
    }, function(err, user) {
        if (err) return next(err);
        res.json(user);
    })
});


/* POST /users/login */
router.post('/login', function(req, res, next) {
    //
    //
    var body = req.body;

    if (body.username == "error") {
        res.json({
            status: false,
            user: {},
            error: "Invalid username and password"
        });
        return;
    }

    if (body.username == "admin") {
        var user = {
            "_id": "556aca43bd88723e43b353b9",
            "user_id": "auth0|556aca404461c98662c6b3a8",
            "role": "regular",
            "nickname": "innovate@HSBC Admin",
            "name": "innovate@hsbc.ca",
            "picture": "https://secure.gravatar.com/avatar/6130f2008ca20ce8b01ced7458811912?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fsc.png",
            "email_verified": true,
            "email": "innovate@hsbc.ca",
            "featured": false,
            "family_name": "",
            "given_name": ""

        };
        var dat = {
            status: true,
            user: user,
            error: ""
        };


        res.json(dat)
    }


    var user = {
        "_id": "5565e7babd88723e43b353b8",
        "user_id": "auth0|555e27ff76bcb9f83bad54be",
        "role": "regular",
        "nickname": "Darwin",
        "name": "Charlie Darwin",
        "picture": "https://secure.gravatar.com/avatar/921d6f38b3cb2de66e024e9e76c2a307?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fda.png",
        "email_verified": true,
        "email": "innovate@gmail.com",
        "family_name": "",
        "given_name": "",
        "location": "CA"
    };

    var dat = {
        status: true,
        user: user,
        error: ""
    };


    res.json(dat);

});


/* GET /users/fake_login */
router.get('/fake_login', function(req, res, next) {

    var dat = "var staffDetails_name='Charlie Darwin';var staffDetails_empid='333333';var staffDetails_extphone='+60473457111';var staffDetails_country='CANADA';var staffDetails_jobrole='Programmer';var staffDetails_dept='IT Support';var staffDetails_photourl='http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=identicon&s=200';var staffDetails_extemail='ivyleague022@gmail.com';";
    res.send(dat);
});


/* GET /users/featured */
router.get('/featured', function(req, res, next) {

    var query = User.find({
        featured: true
    }).limit(3);

    query.or([{
        country: req.query.country
    }]);
    // query.or([{status : "Open"},{status : "In Progress"}]);
    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });

});


/* GET /users/matches */
router.get('/matches', function(req, res, next) {

    console.log("QUERY IDs", req.query);

	var temp = req.query.skills.split(',');
	var expandedSkillList = [];

	req.query.skills.split(',').forEach(function(skill){
		if(skill.indexOf(" ") > -1 ) {
			temp = temp.concat(skill.split(" "));
		}
	});

	temp.forEach(function(skill){
		expandedSkillList.push(new RegExp(skill, "i"));
	});
	
    var query = User.find({$or: [
        {skills: {
            $in: expandedSkillList
        }},
        {interests: {
            $in: expandedSkillList
        }}
    ]}).limit(10);

    // query.or([{status : "Open"},{status : "In Progress"}]);

    query.exec(function(err, post) {
        if (err) return next(err);
        res.json(post);
    });



});


/* GET /users/id */
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});




/* 

/* GET /users/by_id/:user_id */
router.get('/by_id/:user_id', function(req, res, next) {

    console.log("USER ID", req.params.user_id);
    User.findOne({
        user_id: req.params.user_id
    }, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /users/by_email/:email */
router.get('/by_email/:email', function(req, res, next) {

    console.log("USER EMAIL", req.params.email);
    User.findOne({
        email: req.params.email
    }, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* PUT /users/upsert/:user_id */
router.put('/upsert/:user_id', function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    User.update({
        user_id: req.params.user_id
    }, req.body, {
        upsert: true
    }, function(err, post) {
        if (err) return next(err);
        User.findOne({
            user_id: req.params.user_id
        }, function(err, user) {
            if (err) return next(err);

            var newUser = JSON.parse(JSON.stringify(user));

            // ip = "207.97.227.239";
            ip = "142.4.215.149";
            newUser.ip = ip;
            newUser.geo = geoip.lookup(ip);

            if (newUser.geo !== null) {
                newUser.location = newUser.geo.country;
            } else {
                newUser.location = null;
            }

            res.json(newUser);
        })
    });
});

/* PUT /users/:id */
router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);


    });
});



/* DELETE /users/:id */
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.get('/skills/:empId', function(req, res, next) {
    var query = Skills.find(
        {
            peopleSoftId: req.params.empId
        }
    );
    query.exec(function(err, skillList) {
        if(skillList) {
            var skills = [];
            skillList.forEach(function(model) {
                var data = model.toObject();
                skills.push({
                    skill: data.skill,
                    technology: data.technology,
                    category: data.category,
                    status: data.status,
                    rating: data.rating.substring(0, 1),
                    ratingDescription: data.rating.substring(2)
                });
            });

            if(skills.length > 0) {
	            var response = {
	                person: {
	                    name: skillList[0].toObject().name,
	                    peopleSoftId: skillList[0].toObject().peopleSoftId,
	                    skills: skills
	                }
	            };
            }
        }
        res.json(response);
    });
});


module.exports = router;