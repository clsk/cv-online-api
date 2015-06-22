var express = require('express');
var router = express.Router();
var db = require('../db');
var passport = require('passport');
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM users', function(err, users) {
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  if (req.body.password != req.body['confirm-password']) {
    res.send('WRONG PASSWORD');
    return false;
  }
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }, function(err, user) {
    res.json(user);
  });
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = router;