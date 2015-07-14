var async = require("async");

module.exports = {

    getCVByName: function(name, callback) {
        var cv = {};
        console.log(1);
        GLOBAL.sqlConnection.query("SELECT id FROM CVs WHERE name=?", [name], function (err, rows) {
            console.log(2);
            if (err) {
                callback(err, null);
            } else if (rows.length < 1) {
                callback('Error: No se pudo encontrar el CV ' + name + '. Por favor contacte un administrator', null);
            } else {
                cv.id = rows[0].id;
                // Get Education data
                GLOBAL.sqlConnection.query("SELECT start_date,end_date,school,degree FROM CV_Education where cv_id=" + cv.id, function (err, rows) {
                    // Get Generic Fields
                    cv.education = rows;
                    GLOBAL.sqlConnection.query("SELECT id,name,value FROM CV_Fields where cv_id=" + cv.id, function (err, rows) {
                        cv.fields = {};
                        for (i in rows) {
                            cv.fields[rows[i].name] = rows[i].value;
                        }

                        // Get Work Experiences
                        GLOBAL.sqlConnection.query("SELECT id,start_date,end_date,address,company from CV_WorkExperiences WHERE cv_id="+cv.id, function(err, rows) {
                            cv.work_experiences = rows;

                            var rowsCount = rows.length
                            if (rowsCount) {

                                var q = async.queue(function (data, callback) {
                                    GLOBAL.sqlConnection.query("SELECT value FROM CV_WorkExperiences_BulletPoint where cv_workexperience_id="+data.work_experience_id, function (err, rows) {
                                        console.log('working on ' + data.i);
                                        cv.work_experiences[data.i].bullet_points = rows;
                                        callback();
                                    });
                                }, 1);

                                q.drain = function() {
                                    callback(null, cv);
                                };

                                for (i = 0; i < rowsCount; i++) {
                                    q.push({i: i, work_experience_id: cv.work_experiences[i].id});
                                }

                            } else {
                                callback(null, cv);
                            }
                        });
                    });
                });
            }
        });
    }
};

