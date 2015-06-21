// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/home', isLoggedIn, function(req, res, next) {
	  res.render('home',  { title: 'Express', isAuthenticated: req.isAuthenticated() });
	});

	app.get('/index', function(req, res, next) {
	  res.redirect('/');
	});

	/* GET index page. */
	app.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express', isAuthenticated: req.isAuthenticated() });
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/index', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            // if (req.body.remember) {
            //   req.session.cookie.maxAge = 1000 * 60 * 3;
            // } else {
            //   req.session.cookie.expires = false;
            // }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/index', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		req.session.destroy();
		res.redirect('/');
	});

	// =====================================
	// DELETE ACCOUNT ======================
	// =====================================
	// process the signup form
	app.post('/deleteAccount', passport.authenticate('local-delete', {
		successRedirect : '/logout', // redirect to the secure profile section
		failureRedirect : '/logout', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
};

function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return true;

	// if they 
	return false;
}


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/index');
}
