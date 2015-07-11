var express = require('express');
var router = express.Router();
var auth = require('../src/auth');

/* GET home page. */
router.get('/edit_template', auth.isLoggedInAsAdmin, function(req, res, next) {
    console.log(req.baseUrl);
  res.render('edit_template', { title: 'Express', user: req.user, messages: req.flash('info')});
});

module.exports = router;
