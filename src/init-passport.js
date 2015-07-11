// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../config/database');
GLOBAL.connection = mysql.createConnection(dbconfig.connection);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        GLOBAL.connection.query("SELECT id,email,name,lastname,is_admin FROM Users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            GLOBAL.connection.query("SELECT * FROM Users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('info', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var user = new Object();
                    user.email    = req.body.email;
                    user.password = bcrypt.hashSync(req.body.password, null, null);
                    user.name     = req.body.name;
                    user.lastname = req.body.lastname;

                    var insertQuery = "INSERT INTO Users (email, password, name, lastname) values (?,?,?,?)";


                    GLOBAL.connection.query(insertQuery,[user.email,user.password,user.name,user.lastname], function(err,rows){
                        user.id = rows.insertId;
                        delete user.password;
                        return done(null, user);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        GLOBAL.connection.query("SELECT * FROM Users WHERE email = ?",[email], function(err, rows) {
            if (err)
                return done(err);

            if (!rows.length) {
                return done(null, false, req.flash('info', 'Usuario o Clave equivocada!')); // req.flash is the way to set flashdata using connect-flash
            } else if (rows[0].active == 0) {
                return done(null, false, req.flash('info', 'Esa cuenta esta desactivada'));
            }


            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('info', 'Usuario o Clave equivocada!')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            delete rows[0].password; // Borrar la clave de la memoria
            return done(null, rows[0]);
        });
    }));

};
