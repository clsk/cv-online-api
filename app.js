var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');


// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ 
    // genid: function(req) {
    //   return genuuid() // use UUIDs for session IDs
    // },
    secret: 'cvonlinehasher', // session secret
    resave: false,
    saveUninitialized: false,
})); 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function (req, res, next) { // attach req to all views
    res.locals.req = req;
    res.locals.baseURL = '//' + req.hostname;
    if (app.settings.port != 80 && app.settings.port != 443) {
        res.locals.baseURL += ':' + app.settings.port;
    }
    res.locals.baseURL += '/';
    next();
});

require('./src/init-passport')(passport);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var admin = require('./routes/admin');
var cvs= require('./routes/cvs');

app.use('/', routes);
app.use('/home', home);
app.use('/users', users);
app.use('/admin', admin);
app.use('/cvs',cvs);

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
