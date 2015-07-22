var express = require('express');
var router = express.Router();
var Template = require('../src/template_model');

/* GET home page. */
router.get('/', function(req, res, next) {
 Template.all(function(err,templates){
  res.render('index', { title: 'CV Online', templates:templates, messages: req.flash('info') });
});

});

module.exports = router;
