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

        models.CVs.create({
                            name: name,
                            template_id: template_id,
                            created_by: session.user_fb_id
        }).then(function(cv) {
            if (req.body['educations'] != null) {
                educations = req.body.educations;
                for (education_data in educations) {
                    education_data['cv_id'] = cv.id;
                    models.CVEducations.create(education_data);
                }
            }

            if (req.body['work_experiences'] != null) {
                work_experiences = req.body.work_experiences;
                for (work_experience_data in work_experiences) {
                    work_experience_data['cv_id'] = cv.id;
                    bullet_points = work_experience_data['bullet_points'];
                    delete work_experience['bullet_points'];
                    models.CVWorkExperiences.create(work_experience_data).then(function(work_experience) {
                        for (bullet_point in bullet_points) {
                            bullet_point['cv_work_experience_id'] = work_experience.id
                            models.CVWorkExperienceBulletPoints.create(bullet_point);
                        }
                    });
                }
            }

            if (req.body['fields'] != null) {
                fields = req.body.fields;
                for (field_data in fields) {
                    field_data['cv_id'] = cv.id;
                    models.CVFields.create(field_data);
                }
            }
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

        models.CVs.findById(cv_id).then(function(cv) {
            if (cv == null) {
                res.status(401).json({message: "Could not find CV with that ID"});
                return;
            }

            models.CVEducations.destroy({where: {cv_id: cv.id}});
            if (req.body['educations'] != null) {
                educations = req.body.educations;
                for (education_data in educations) {
                    education_data['cv_id'] = cv.id;
                    models.CVEducations.create(education_data);
                }
            }

            models.CVEducations.destroy({where: {cv_id: cv.id}});
            models.CVWorkExperiences.findAll({cv_id: cv.id}).then(function (work_experiences) {
                for (work_experience in work_experiences) {
                    models.CVWorkExperienceBulletPoints.destroy({where: {cv_work_experience_id: work_experience.id}});
                }
                work_experience.destroy();
            });
            if (req.body['work_experiences'] != null) {
                work_experiences = req.body.work_experiences;
                for (work_experience_data in work_experiences) {
                    work_experience_data['cv_id'] = cv.id;
                    bullet_points = work_experience_data['bullet_points'];
                    delete work_experience['bullet_points'];
                    models.CVWorkExperiences.create(work_experience_data).then(function(work_experience) {
                        for (bullet_point in bullet_points) {
                            bullet_point['cv_work_experience_id'] = work_experience.id
                            models.CVWorkExperienceBulletPoints.create(bullet_point);
                        }
                    });
                }
            }

            models.CVFields.destroy({where: {cv_id: cv.id}});
            if (req.body['fields'] != null) {
                fields = req.body.fields;
                for (field_data in fields) {
                    field_data['cv_id'] = cv.id;
                    models.CVFields.create(field_data);
                }
            }
        });
    });
});

module.exports = router;
