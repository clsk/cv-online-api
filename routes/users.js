var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var passwordGenerator = require('password-generator');
var mailConfig = require('../config/mail');

var auth = require('../src/auth');

/* GET users listing. */
//router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
//});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),
    function(req, res) {
        // if (req.body.remember) {
        //   req.session.cookie.maxAge = 1000 * 60 * 3;
        // } else {
        //   req.session.cookie.expires = false;
        // }
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.post('/changePassword', auth.isLoggedIn, function(req, res) {
    var query = "SELECT * FROM Users where email = ?";
    GLOBAL.connection.query(query, [req.user.email], function(err, rows) {
        if (err) {
            req.flash('info', 'Error ejecutando query de MySQL');
            res.redirect('/home');
        } else if (!rows) {
            req.fash('info', 'Usuario o clave invalido!');
            res.redirect('/home');
        } else {
            if (!bcrypt.compareSync(req.body.password, rows[0].password)) {
                req.flash('info', 'Usuario o clave invalido!');
                res.redirect('/home');
            } else {
               var q = "UPDATE Users set password = ? where id = ?";
               GLOBAL.connection.query(q, [bcrypt.hashSync(req.body.newpassword, null, null), req.user.id], function(err, rows) {
                   res.redirect('/home');
               });
            }
        }
    });
});

router.post('/forgotPassword', function(req, res) {
    var email = req.body.email;
    var query = "SELECT * FROM Users where email = ?";
    GLOBAL.connection.query(query, [email], function(err, rows) {
        if (err) {
            req.flash('info', 'Error ejecutando query de MySQL');
            res.redirect('/');
        } else if (!rows) {
            req.fash('info', 'Usuario o clave invalido!');
            res.redirect('/');
        } else {
            var newPassword = passwordGenerator(12, false);
            var q = "UPDATE Users set password = ? where email = ?";
            GLOBAL.connection.query(q, [bcrypt.hashSync(newPassword, null, null), email], function(err, rows) {
               var transporter = nodemailer.createTransport(mailConfig);
               var mailOptions = {
                   from: mailConfig.fromAddress, // sender address
                   to: email, // list of receivers
                   subject: 'CV Online Service Nueva Clave', // Subject line
                   text: 'Se ha generado la siguiente clave para usted ' + newPassword, // plaintext body
                   html: '<b>Se ha generado la siguiente clave para usted: ' + newPassword + '</b>' // html body
               };

               // send mail with defined transport object
               transporter.sendMail(mailOptions, function(error, info){
                   if(error){
                       return console.log(error);
                   }

                   res.redirect('/');
               });
           });
        }
    });
});

router.post('/deleteAccount', auth.isLoggedIn,  function(req, res) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    GLOBAL.connection.query("SELECT * FROM Users WHERE email = ?", [req.user.email], function(err, rows) {
        if (err)
            return done(err);
        if (!rows.length) {
            return res.redirect('home', req.flash('info', 'That user do not exists.'));
        } else {
            console.log("Deleting user: "+req.user.email);
            var updateQuery = "UPDATE Users set active = 0 WHERE email = ?";
            console.log(updateQuery);
            GLOBAL.connection.query(updateQuery,[req.user.email], function(err,rows){
                res.redirect('/');
            });
        }
    });
});

router.get('/Edit', auth.isLoggedIn, function(req, res, next) {
  var query = "SELECT * FROM Users where id = ?";
    GLOBAL.sqlConnection.query(query, [req.user.id], function(err, rows) {
        if (err) {
            req.flash('info', 'Error ejecutando query de MySQL');
            res.redirect('/');
        } else if (!rows) {
            req.fash('info', 'Usuario o clave invalido!');
            res.redirect('/');
        } else {
            console.log(rows);
            res.render('edit_profile', { title: 'Editar Perfil', user: req.user, userEntity: rows , messages: req.flash('info') });
        }
    });
});

router.post('/Update', auth.isLoggedIn, function(req, res){
  var name = (typeof req.body.name === 'undefined') ? "" : req.body.name;
  var lastname = (typeof req.body.lastname === 'undefined') ? "" :req.body.lastname;
  var email = (typeof req.body.email === 'undefined') ? "" :req.body.email;
  var telephone = (typeof req.body.telefonos === 'undefined') ? "" :req.body.telefonos;
  var paginas = (typeof req.body.paginas === 'undefined') ? "" :req.body.paginas;

  var q = "UPDATE Users set name  = ?, lastname = ?, email = ?, telephone = ?, webpage = ? where id = ?";
  GLOBAL.sqlConnection.query(q, [name, lastname, email, telephone, paginas, req.user.id], function(err, rows) {
      req.method = 'get'; 
      res.redirect('/home'); 
  });

});

module.exports = router;
