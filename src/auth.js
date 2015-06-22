module.exports = {
    isAuthenticated: function(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return true;

        // if they 
        return false;
    },


    // route middleware to make sure
    isLoggedIn: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};
