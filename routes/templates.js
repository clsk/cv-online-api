var express = require('express');
var router = express.Router();
var models = require('../models');

router.post('/create', function(req, res, next) {
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
        models.Users.findById(session.user_fb_id).then(function(user) {
            if (user == null) {
                res.status(401).json({message: "Could not find admin user"});
                return;
            }

            if (user.is_admin == false) {
                res.status(401).json({message: "Need admin rights to do this"});
                return;
            }

            // Check for required fields
            if (req.body.name == null) {
                res.status(400).json({message: 'Required field name not present'});
                return;
            }

            models.Templates.create({name: req.body.name,
                                    description: req.body.description,
                                    html: req.body.html,
                                    css: req.body.css,
                                    created_by: session.user_fb_id,
                                    device: req.body.device || 'web'
                                    }).then(function(template) {
                res.json({id: template.id});
            });
        });
    });
});

router.post('/:template_id/edit', function(req, res, next) {
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
        models.Users.findById(session.user_fb_id).then(function(user) {
            if (user == null) {
                res.status(401).json({message: "Could not find admin user"});
                return;
            }

            if (user.is_admin == false) {
                res.status(401).json({message: "Need admin rights to do this"});
                return;
            }

            models.Templates.findById(req.params.template_id).then(function(template) {
                var validParameters  = ['name', 'description', 'html', 'css', 'device'];
                for (var param in req.body) {
                    if (req.body.hasOwnProperty(param) && validParameters.indexOf(param) != -1) {
                        template[param] = req.body[param];
                    } else {
                        res.status(400).json({message: "Invalid parameter " + param });
                        return;
                    }
                }

                template.save();
                res.sendStatus(200);
            });
        });
    });
});

router.get('/list', function(req, res, next) {
    models.Templates.findAll().then(function(all_templates) {
        var templates = all_templates.map(function(template) { return template.toJSON(); });
        res.status(200).json({ templates: templates });
    });
});

//router.get('/edit_template/:template_id?', auth.isLoggedInAsAdmin, function(req, res, next) {
    //var cv = {};
    //db.getCVByName('Test CV', function (err, cv) {
        //if (err) {
            //req.flash('info', err);
            //res.redirect('/home');
        //}

        //if (typeof req.params.template_id != 'undefined') {
            //GLOBAL.sqlConnection.query("SELECT name,html,css from Templates WHERE id = ?", [req.params.template_id], function(err, rows) {
                //if (err) {
                    //req.flash('info', err);
                    //res.redirect('/home');
                //} else if (rows < 1) {
                    //req.flash('info', 'Error: No se pudo encontrar ese Tema');
                    //res.redirect('/home');
                //}

                //res.render('edit_template', { title: 'Edit Template', user: req.user, cv: cv, template_id: req.params.template_id, template: rows[0], messages: req.flash('info')});
            //});
        //} else {
            //res.render('edit_template', { title: 'Edit Template', user: req.user, cv: cv, template_id: req.params.template_id, messages: req.flash('info')});
        //}
    //});
//});


module.exports = router;
