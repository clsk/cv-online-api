var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../src/auth');
var CV = require('../src/cv_model');
var Template = require('../src/template_model');

router.get('/edit', auth.isLoggedIn,function(req, res) {
  var user = req.user;
  var cv = new CV(null, user);
  cv.get(function(err, response) {
    var data = {
      title: 'Editar información profesional', 
      user: user, 
      messages: req.flash('info') ,
      cv: response || null
    };
    res.render('cv-form/edit-cv.ejs', data);
  });
});

router.post('/', auth.isLoggedIn, function(req, res) {
  var cv = new CV(req.body, req.user);
  cv.save(function(err, response) {
    if (!err) {
      req.flash('info', 'Guardado correctamente.');
      res.redirect('back');
    }
  });
});

router.get('/show/:id?',auth.isLoggedIn,function(req, res) { 
  var user = req.user;
  var cv = new CV(null, user);
  cv.get(function(err, response) {
    if(!response) {
      req.flash('info', 'Error, no tiene ningun cv asociado a su cuenta.');
      res.redirect('/cvs/edit');
    } else {
      console.log('response',response);
      var templateId = typeof req.params.id != 'undefined' ? req.params.id : response.template_id;
      Template.get(templateId,function(err,template){
        res.render('cv_show', {
          title: 'Ver CV',
          user: user,
          messages: req.flash('info') ,
          cv: response,
          template: template
        });
      });
    }
  });
});

router.get('/setTemplate/:id',auth.isLoggedIn,function(req, res) {
  var cv = new CV(null, req.user);
  cv.setTemplate(req.params.id, function(err, response) {
    console.log(err, response);
    if(!err){
      req.flash('info', 'Este es su nuevo cv predeterminado.');
    }
    else{
      req.flash('info','Hubo un error mientras se cambiaba de cv.');
    }
    res.redirect('/cvs/show');
  });
});
module.exports = router;
