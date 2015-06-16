'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'School Service App'
    });
});


/* GET project page. */
router.get('/project', function(req, res) {
    res.render('project', {});
});

/* GET profile page. */
router.get('/my_profile', function(req, res) {

    res.render('profile', {});
});

router.get('/user', function(req, res) {
    res.render('user', {});
});

router.get('/search', function(req, res) {
    res.render('search', {});
});

router.get('/loaduser', function(req, res) {
    res.render('loaduser', {});
});


module.exports = router;