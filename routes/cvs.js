var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../src/auth');

router.get('/edit', auth.isLoggedIn, function(req, res) {
  res.render('cv-form/edit-cv.ejs', { title: 'Editar información profesional', user: req.user, messages: req.flash('info') });
});

module.exports = router;
