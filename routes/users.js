var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var passwordGenerator = require('password-generator');
var FB = require('../fb');
var models = require('../models');

var FB_CLIENT_ID = '547949358692521';
var FB_CLIENT_SECRET = '7164c6b8a3135fb2a8e563172719de79';

/* GET users listing. */
//router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
//});

router.post('/signup', function(req, res) {
    // Extend FB Token
    var token = req.body.fb_token
    var is_admin = req.body.is_admin | false
    if (token == null) {
        req.status(401).json({message: "no fb_token received"});
    }
    FB.api('oauth/access_token', {
        client_id: FB_CLIENT_ID,
        client_secret: FB_CLIENT_SECRET,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: token
    }, function (response) {
        if(!response || response.error) {
            res.status(401).json({message: 'Facebook Error: ' + response.error.message});
            return;
        }

        var accessToken = response.access_token;
        FB.setAccessToken(accessToken);
        FB.api('me', {fields: ['id', 'first_name', 'last_name', 'website', 'email']}, function(response) {
            if(!response || response.error) {
                console.log(!response ? 'error occurred' : response.error);
                res.status(401).json({message: 'Facebook Error: ' + response.error.message});
                return;
            }

            models.Users.create({fb_id: response.id, name: response.first_name,
                                webpage: response.website, email: response.email, is_admin: is_admin})
                                .then(function(user) {
                                    models.Sessions.create({user_fb_id: user.fb_id, fb_token: accessToken}).then(function(session) {
                                        res.json({session_id: session.id, fb_token: session.fb_token, user_data: user.toJSON()});
                                    });
            }).catch(function(error) {
                if (error.name == 'SequelizeUniqueConstraintError') {
                    res.status(400).json({message: 'User has already signed up'});
                }

            });
        });
    });
});


router.post('/login', function(req, res) {
    // Extend FB Token
    var token = req.body.fb_token
    if (token == null) {
        req.status(401).json({message: "no fb_token received"});
    }
    FB.api('oauth/access_token', {
        client_id: FB_CLIENT_ID,
        client_secret: FB_CLIENT_SECRET,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: token
    }, function (response) {
        if(!response || response.error) {
            res.status(401).json({message: 'Facebook Error: ' + response.error.message});
            return;
        }

        var accessToken = response.access_token;
        FB.setAccessToken(accessToken);
        FB.api('me', {fields: ['id']}, function(response) {
            if(!response || response.error) {
                console.log(!response ? 'error occurred' : response.error);
                res.status(401).json({message: 'Facebook Error: ' + response.error.message});
                return;
            }

            models.Users.findById(response.id).then(function(user) {
                if (user == null) {
                    res.status(401).json({message: 'No user registered with that Facebook ID'});
                } else {
                    models.Sessions.create({user_fb_id: user.fb_id, fb_token: accessToken}).then(function(session) {
                        res.json({session_id: session.id, fb_token: session.fb_token, user_data: user.toJSON()});
                    });
                }
            });
        });
    });
});


router.delete('/delete', function(req, res) {
    var session_id = req.headers['x-session-id'];
    if (session_id == null || session_id == 0) {
        res.status(401).json({message: 'No session id header received'});
        return;
    }

    models.Sessions.findById(session_id).then(function(session) {
        if (session == null) {
            res.status(401).json({message: "Invalid Session ID"});
            return;
        }
        models.Users.destroy({ where: { fb_id: session.user_fb_id}}).then(function(rows) {
            if (rows == 0) {
                res.status(500).json({message: 'Could not find user. (But found session)'});
            } else {
                res.sendStatus(200);
            }
        });
    });
});

//router.get('/Edit', auth.isLoggedIn, function(req, res, next) {
  //var query = "SELECT * FROM Users where id = ?";
    //GLOBAL.sqlConnection.query(query, [req.user.id], function(err, rows) {
        //if (err) {
            //req.flash('info', 'Error ejecutando query de MySQL');
            //res.redirect('/');
        //} else if (!rows) {
            //req.fash('info', 'Usuario o clave invalido!');
            //res.redirect('/');
        //} else {
            //console.log(rows);
            //res.render('edit_profile', { title: 'Editar Perfil', user: req.user, userEntity: rows , messages: req.flash('info') });
        //}
    //});
//});

//router.post('/Update', auth.isLoggedIn, function(req, res){
  //var name = (typeof req.body.name === 'undefined') ? "" : req.body.name;
  //var lastname = (typeof req.body.lastname === 'undefined') ? "" :req.body.lastname;
  //var email = (typeof req.body.email === 'undefined') ? "" :req.body.email;
  //var telephone = (typeof req.body.telefonos === 'undefined') ? "" :req.body.telefonos;
  //var paginas = (typeof req.body.paginas === 'undefined') ? "" :req.body.paginas;

  //var q = "UPDATE Users set name  = ?, lastname = ?, email = ?, telephone = ?, webpage = ? where id = ?";
  //GLOBAL.sqlConnection.query(q, [name, lastname, email, telephone, paginas, req.user.id], function(err, rows) {
      //req.method = 'get'; 
      //res.redirect('/home'); 
  //});

//});

//router.get('/view-profile', function(req, res, next) {
  //res.render('users/user_profile', { title: 'Cv Online', messages: req.flash('info'), user: req.user });
//});

//router.get('/change-cv', function(req, res, next) {

  //Template.all(function(err,templates){
    //res.render('users/cv_list', { title: 'Cv online', templates:templates,
    //messages: req.flash('info'), user: req.user });
  //});
  
  
//});
module.exports = router;
