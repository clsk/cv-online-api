var express = require('express');
var router = express.Router();
var auth = require('../src/auth');

/* GET home page. */
router.get('/list_templates', auth.isLoggedIn, function(req, res, next) {
    GLOBAL.sqlConnection.query("SELECT id,name,html,css FROM Templates", function(err, rows) {
        if (err) {
            req.flash('info', err);
            res.redirect('/home');
        } else {

            res.render('list_templates', {title: 'List Templates', user: req.user, templates: rows, messages: req.flash('info') });
        }
    });
});


router.get('/edit_template/:template_id?', auth.isLoggedInAsAdmin, function(req, res, next) {
    var cv = {};
    GLOBAL.sqlConnection.query("SELECT id FROM CVs WHERE name=\'Test CV\'", function (err, rows) {
        if (err) {
            req.flash('info', err);
            res.redirect('/home');
        } else if (rows.length < 1) {
            req.flash('info', 'Error: No se pudo encontrar el CV de Prueba. Por favor contacte un administrator');
            res.redirect('/home');
        } else {
            GLOBAL.sqlConnection.query("SELECT start_date,end_date,school,degree FROM CV_Education where cv_id=1", function (err, rows) {
                cv.education = rows;
                GLOBAL.sqlConnection.query("SELECT id,name,value FROM CV_Fields where cv_id=1", function (err, rows) {
                    cv.fields = rows;
                    if (typeof req.params.template_id != 'undefined') {
                        GLOBAL.sqlConnection.query("SELECT name,html,css from Templates WHERE id = ?", [req.params.template_id], function(err, rows) {
                            if (err) {
                                req.flash('info', err);
                                res.redirect('/home');
                            } else if (rows < 1) {
                                req.flash('info', 'Error: No se pudo encontrar ese Tema');
                                res.redirect('/home');
                            }

                            res.render('edit_template', { title: 'Edit Template', user: req.user, cv: cv, template_id: req.params.template_id, template: rows[0], messages: req.flash('info')});
                        });
                    } else {
                        res.render('edit_template', { title: 'Edit Template', user: req.user, cv: cv, template_id: req.params.template_id, messages: req.flash('info')});
                    }
                });
            });
        }
    });
});

router.post('/saveTemplate', auth.isLoggedInAsAdmin, function(req, res, next) {
    if (typeof req.body.inputTemplateId == 'undefined') {
        GLOBAL.sqlConnection.query("INSERT INTO Templates (created_by, name, html, css) VALUES (" + req.user.id + ", ?, ?, ?)", [req.body.inputTemplateName, req.body.htmlText, req.body.cssText], function(err, result) {
            var id = result.insertId;
            console.log(JSON.stringify(result));
            res.redirect('/admin/edit_template/'+id);
        });
    } else {
        GLOBAL.sqlConnection.query("UPDATE Templates SET html=?,css=? WHERE id=? ", [req.body.htmlText, req.body.cssText, req.body.inputTemplateId], function(err, result) {
            if (err) {
                req.flash('info', err);
            } else if (result.affectedRows < 1) {
                req.flash('info', 'No se pudieron guardar los cambios');
            }
            res.redirect('/admin/edit_template/'+req.body.inputTemplateId);
        });

    }
});

module.exports = router;
