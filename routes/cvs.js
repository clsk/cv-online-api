var express = require('express');
var router  = express.Router();
var models  = require('../models');
var util    = require('util');


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

        models.CVs.create({
                            name: req.body.name,
                            template_id: req.body.template_id,
                            created_by: session.user_fb_id
        }).then(function(cv) {
            if (req.body['educations'] != null) {
                educations = req.body.educations;
                var educations_length = educations.length;
                for (var i = 0; i < educations_length; i++) {
                    var education_data = educations[i];
                    education_data['cv_id'] = cv.id;
                    models.CVEducations.create(education_data);
                }
            }

            if (req.body['work_experiences'] != null) {
                work_experiences = req.body['work_experiences'];
                var work_experiences_length = work_experiences.length;
                for (var i = 0; i < work_experiences_length; i++) {
                    work_experience_data = work_experiences[i];
                    work_experience_data['cv_id'] = cv.id;
                    bullet_points = work_experience_data['bullet_points'];
                    delete work_experience_data['bullet_points'];
                    models.CVWorkExperiences.create(work_experience_data).then(function(work_experience) {
                        var bullet_points_length = bullet_points.length;
                        for (var j = 0; j < bullet_points_length; j++) {
                            var bullet_point = bullet_points[j];
                            bullet_point['cv_work_experience_id'] = work_experience.id
                            models.CVWorkExperienceBulletPoints.create(bullet_point);
                        }
                    });
                }
            }

            if (req.body['fields'] != null) {
                var fields = req.body.fields;
                var fields_length = fields.length
                for (var i = 0; i < fields_length; i++) {
                    var field_data = fields[i];
                    field_data['cv_id'] = cv.id;
                    models.CVFields.create(field_data);
                }
            }


            res.json({cv_id: cv.id});
        });
    });
});


router.post('/:cv_id/edit', function(req, res, next) {
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

        var cv_id = req.params.cv_id;
        models.CVs.findById(cv_id).then(function(cv) {
            if (cv == null) {
                res.status(401).json({message: "Could not find CV with that ID"});
                return;
            }

            models.CVEducations.destroy({where: {cv_id: cv.id}});
            if (req.body['educations'] != null) {
                educations = req.body.educations;
                var educations_length = educations.length;
                for (var i = 0; i < educations_length; i++) {
                    var education_data = educations[i];
                    education_data['cv_id'] = cv.id;
                    models.CVEducations.create(education_data);
                }
            }

            models.CVWorkExperiences.destroy({where: {cv_id: cv.id}});
            if (req.body['work_experiences'] != null) {
                work_experiences = req.body['work_experiences'];
                var work_experiences_length = work_experiences.length;
                for (var i = 0; i < work_experiences_length; i++) {
                    work_experience_data = work_experiences[i];
                    work_experience_data['cv_id'] = cv.id;
                    bullet_points = work_experience_data['bullet_points'];
                    delete work_experience_data['bullet_points'];
                    models.CVWorkExperiences.create(work_experience_data).then(function(work_experience) {
                        var bullet_points_length = bullet_points.length;
                        for (var j = 0; j < bullet_points_length; j++) {
                            var bullet_point = bullet_points[j];
                            bullet_point['cv_work_experience_id'] = work_experience.id
                            models.CVWorkExperienceBulletPoints.create(bullet_point);
                        }
                    });
                }
            }

            models.CVFields.destroy({where: {cv_id: cv.id}});
            if (req.body['fields'] != null) {
                var fields = req.body.fields;
                var fields_length = fields.length
                for (var i = 0; i < fields_length; i++) {
                    var field_data = fields[i];
                    field_data['cv_id'] = cv.id;
                    models.CVFields.create(field_data);
                }
            }

            console.log('sending 200');
            res.sendStatus(200);
        });
    });
});

module.exports = router;
