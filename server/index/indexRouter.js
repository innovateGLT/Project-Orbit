'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'School Service App'
    });
});

/* The url patterns were appended with * so we could maintain a single page design
   We would want to still render index.ejs even after the user refreshers the browser.
 */

router.get('/projec*', function(req, res) {
    res.render('index', {});
});

router.get('/profil*', function(req, res) {

    res.render('index', {});
});

router.get('/use*', function(req, res) {
    res.render('index', {});
});

router.get('/searc*', function(req, res) {
    res.render('index', {});
});

router.get('/loaduse*', function(req, res) {
    res.render('index', {});
});

router.get('/hel*', function(req, res) {
    res.render('index', {});
});

module.exports = router;