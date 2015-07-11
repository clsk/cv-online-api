module.exports = {
    isAuthenticated: function(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return true;

        return false;
    },


    // route middleware to make sure
    isLoggedIn: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        req.flash('info', 'debe estar autenticado para poder hacer eso');
        res.redirect('/');
    },

    isLoggedInAsAdmin: function(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.is_admin)
            return next();

        // if they aren't redirect them to the home page
        req.flash('info', 'debe estar autenticado como Administrador para poder hacer eso ' + req.user);
        res.redirect('/');
    }
};
