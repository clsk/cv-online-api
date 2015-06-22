var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../src/auth');

/* GET home page. */
router.get('/', auth.isLoggedIn, function(req, res, next) {
    console.log(req.user);
  res.render('home', { title: 'Express', user: req.user, messages: req.flash('info')});
});

module.exports = router;
