'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./server/index/indexRouter');
var projects = require('./server/project/projectRouter');
var questions = require('./server/questions/questionsRouter');
var users = require('./server/users/usersRouter');
var email = require('./server/email/emailRouter');
var rating = require('./server/rating/ratingRouter');

var mongoose = require('mongoose');
var databaseURI = 'mongodb://localhost/school';

var jwt = require('express-jwt');


var jwtCheck = jwt({
    secret: new Buffer('65S3UJfGQYZcG4Z_ZdY7NHG-osl9AHgjLKvLTJdBJXWP1eCbnpDV4ZLg-hFTTitb', 'base64'),
    audience: 'FOrVLNPaeqV6M1xjG5cHnpstTzBxQBVq'
});

mongoose.connect(databaseURI, function(err) {
    if (err) {
        console.error(databaseURI + ' connection error. ', err);
        throw (err);
    } else /*if(process.env.NODE_ENV === 'development')*/ {
        console.log(databaseURI + ' connected.');
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/shared'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/projects', projects);
app.use('/api/questions', questions);
app.use('/api/users', users);
app.use('/api/email', email);
app.use('/api/rating', rating);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;