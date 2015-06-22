var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

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

router.post('/changePassword', function(req, res) {
    var query = "SELECT * FROM Users where email = ?";
    GLOBAL.connection.query(query, [req.user.email], function(err, rows) {
        if (err) {
            req.flash('info', 'Error ejecutando query de MySQL');
            res.redirect('/home');
        } else if (!rows) {
            req.fash('info', 'Usuario o clave invalido!');
        } else {
            if (!bcrypt.compareSync(req.body.password, rows[0].password)) {
                req.fash('info', 'Usuario o clave invalido!');
            } else {
               var q = "UPDATE Users set password = ? where id = ?";
               GLOBAL.connection.query(q, [bcrypt.hashSync(req.body.newpassword, null, null), req.user.id], function(err, rows) {
                   res.redirect('/home');
               });
            }
        }

    });
});


router.post('/deleteAccount', function(req, res) {
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


module.exports = router;
