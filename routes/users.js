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

router.post('/create', function(req, res) {
    // Extend FB Token
    var token = req.body.fb_token
    var is_admin = req.body.is_admin | false
    if (token == null) {
        res.status(401).json({message: "no fb_token received"});
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
        res.status(401).json({message: "no fb_token received"});
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

router.put('/update', function(req, res){
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

        var user = session.getUser().then(function(user) {
            if (user == null) {
                res.status(500).json({message: 'Could not find user. (But found session)'});
                return;
            }

            var attributes = ["name", "lastname", "webpage", "telephone", "email"];
            var attributesLength = attributes.length;
            console.log(req.body);
            for (i = 0; i < attributesLength; i++) {
                if (req.body[attributes[i]] != null) {
                    user[attributes[i]] = req.body[attributes[i]];
                    console.log('setting attribute ' + attributes[i] + 'to: ' + req.body[attributes[i]]);
                }
            }

            user.save();
            res.sendStatus(200);

        });
    });

});

module.exports = router;
