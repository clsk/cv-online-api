var express = require('express');
var router = express.Router();
var auth = require('../src/auth');

/* GET home page. */
router.get('/edit_template', auth.isLoggedInAsAdmin, function(req, res, next) {
    var cv = {};
    GLOBAL.sqlConnection.query("SELECT id FROM CVs WHERE name=\'Test CV\'", function (err, rows) {
        if (err) {
            req.flash('info', err);
            res.render('edit_template', { title: 'Express', user: req.user, cv: cv, messages: req.flash('info')});
        } else if (rows.length < 1) {
            req.flash('info', 'Error: No se pudo encontrar el CV de Prueba. Por favor contacte un administrator');
            res.render('edit_template', { title: 'Express', user: req.user, cv: cv, messages: req.flash('info')});
        } else {
            GLOBAL.sqlConnection.query("SELECT start_date,end_date,school,degree FROM CV_Education where cv_id=1", function (err, rows) {
                cv.education = rows;
                GLOBAL.sqlConnection.query("SELECT id,name,value FROM CV_Fields where cv_id=1", function (err, rows) {
                    cv.fields = rows;
                    res.render('edit_template', { title: 'Express', user: req.user, cv: cv, messages: req.flash('info')});
                });
            });
        }
    });
});

module.exports = router;
