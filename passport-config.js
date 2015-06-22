var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var User = require('./models/user');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.authenticate(username, password, function(err, user) {
        if (err) { return done(err); }
        if (!user.length) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user[0].id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}