var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var bodyParser   = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var sequelize = require('sequelize');
var FB = require('./fb');
var models = require('./models');

// Create tables if necessary
models.sql.sync()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*", function(req, res, next) {
  console.log("added headers");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTION, DELETE");
  return next();
});


var users = require('./routes/users');
var templates = require('./routes/templates');
//var cvs = require('./routes/cvs');

app.use('/user', users);
app.use('/template', templates);
//app.use('/cv',cvs);

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
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});



module.exports = app;
