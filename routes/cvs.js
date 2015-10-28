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

        session.getUser().then(function(user) {
            if (user == null) {
                res.status(500).json({message: 'Could not find user. (But found session)'});
                return;
            }

            var name = null;
            if (req.body['name'] != null) {
                name = req.body.name;
            }

            if (req.body['template_id'] != null) {
                var template_id = req.body['template_id'];
                if template_ids
                models.Templates.findAll({where: { id: {$in: req.body.template_ids}}}).then(function(templates) {
                    models.CVs.create({
                                        name: name,
                                        template_id: template_id
                    }).then(function(cv) {
                        if (req.body['educations'] != null) {
                            educations = req.body.educations;

                        }
                    });
                });
            }
        });
    });

});

module.exports = router;
