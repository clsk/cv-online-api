var express    = require('express');
var multiparty = require('multiparty');
var router     = express.Router();
var models     = require('../models');
var util       = require('util');
var fs         = require('fs');

router.post('/create', function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var session_id = fields['x-session-id'] ? fields['x-session-id'][0] : null;
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
                if (fields.name == null) {
                    res.status(400).json({message: 'Required field name not present'});
                    return;
                }

                var validParameters  = ['name', 'description', 'html', 'css', 'mobile_html', 'mobile_css'];
                var template_data = {created_by: session.user_fb_id};
                for (var param in fields) {
                    if (fields.hasOwnProperty(param) && validParameters.indexOf(param) != -1) {
                        template_data[param] = fields[param][0];
                    } else {
                        res.status(400).json({message: "Invalid parameter " + param });
                        return;
                    }
                }

                models.Templates.create(template_data).then(function(template) {
                    var preview_image = files.preview_image != null ? files.preview_image[0] : null;
                    if (preview_image != null) {
                        var preview_image_full_path = __dirname + "/../public/template_previews/" + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                        fs.rename(preview_image['path'], preview_image_full_path, function() {
                            template['preview_image_url'] = '/template_previews/' + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                            template.save();
                        });
                    }

                    var mobile_preview_image = files.mobile_preview_image != null ? files.mobile_preview_image[0] : null;
                    if (mobile_preview_image != null) {
                        var mobile_preview_image_full_path = __dirname + "/../public/template_previews/mobile_" + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                        fs.rename(mobile_preview_image['path'], mobile_preview_image_full_path, function() {
                            template['mobile_preview_image_url'] = '/template_previews/mobile_' + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                            template.save();
                        });
                    }

                    res.json({id: template.id});
                });
            });
        });
    });
});

router.post('/:template_id/edit' ,function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
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

                var template_id = req.params.template_id;
                if (template_id == null) {
                    res.status(400).json({message: "No template ID provided"});
                    return;
                }

                models.Templates.findById(template_id).then(function(template) {
                    var validParameters  = ['name', 'description', 'html', 'css', 'mobile_html', 'mobile_css'];
                    for (var param in fields) {
                        if (fields.hasOwnProperty(param) && validParameters.indexOf(param) != -1) {
                            template[param] = fields[param][0];
                        } else {
                            res.status(400).json({message: "Invalid parameter " + param });
                            return;
                        }
                    }

                    var preview_image = files.preview_image != null ? files.preview_image[0] : null;
                    if (preview_image != null) {
                        var preview_image_full_path = __dirname + "/../public/template_previews/" + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                        fs.rename(preview_image['path'], preview_image_full_path, function() {
                            template['preview_image_url'] = '/template_previews/' + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                            template.save();
                        });
                    }

                    var mobile_preview_image = files.mobile_preview_image != null ? files.mobile_preview_image[0] : null;
                    if (mobile_preview_image != null) {
                        var mobile_preview_image_full_path = __dirname + "/../public/template_previews/mobile_" + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                        fs.rename(mobile_preview_image['path'], mobile_preview_image_full_path, function() {
                            template['mobile_preview_image_url'] = '/template_previews/mobile_' + template.id + '.' + preview_image['originalFilename'].split('.').pop();
                            template.save();
                        });
                    }

                    template.save();
                    res.sendStatus(200);
                });
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
