var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var bodyParser   = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');

app.use(function (req, res, next) { // attach req to all views
    res.locals.req = req;
    res.locals.baseURL = '//' + req.hostname;
    if (app.settings.port != 80 && app.settings.port != 443) {
        res.locals.baseURL += ':' + app.settings.port;
    }
    res.locals.baseURL += '/';
    next();
});


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var users = require('./routes/users');
var templates = require('./routes/templates');
var cvs = require('./routes/cvs');

app.use('/users', users);
app.use('/templates', admin);
app.use('/cvs',cvs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
