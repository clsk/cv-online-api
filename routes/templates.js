var express    = require('express');
var multiparty = require('multiparty');
var router     = express.Router();
var models     = require('../models');

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
                                    mobile_html: req.body.mobile_html,
                                    mobile_css: req.body.mobile_css
                                    created_by: session.user_fb_id,
                                    }).then(function(template) {
                res.json({id: template.id});
            });
        });
    });
});

router.post('/:template_id/edit' ,function(req, res, next) {
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
                var validParameters  = ['name', 'description', 'html', 'css', 'mobile_html', 'mobile_css'];
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

router.get('/:template_id', function(req, res, next) {
    models.Templates.findById(req.params.template_id).then(function(template) {
        if (template == null) {
            res.status(404).json({message: "Template not found"});
        } else {
            res.status(200).json(template.toJSON());
        }
    });
});


module.exports = router;
