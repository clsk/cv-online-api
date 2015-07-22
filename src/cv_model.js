var db = require('./db');
module.exports = function(data, user) {
  this.userId = user.id;
  this.cvId = null;

  var self = this;

  var _getFirstTemplate = function(cb) {
    GLOBAL.sqlConnection.query('SELECT * FROM Templates LIMIT 1', function(err, templates) {
      cb(err || !templates.length, templates[0]);
    });
  };

  var _addCV = function(templateId, cb){
    GLOBAL.sqlConnection.query('INSERT INTO CVs SET ?', {
      user_id: self.userId,
      name: "",
      template_id: templateId,
      created_on: new Date().getTime(),
      last_updated: new Date().getTime()
    }, cb);
  };

  var _addWorkExperiences = function(workData, cb) {
    var rows = [];
    var sql = 'INSERT INTO CV_WorkExperiences (cv_id, start_date, end_date, company, address) VALUES';
    for(i in workData) {
      var row = [self.cvId, workData[i].start_date, workData[i].end_date, workData[i].company, workData[i].title];
      rows.push('("' + row.join('","') + '")');
    }
    sql += rows.join(',');
    GLOBAL.sqlConnection.query(sql, data, cb);
  };

  var _addEducation = function(educationData, cb) {
    var rows = [];
    var sql = 'INSERT INTO CV_Education (cv_id, start_date, end_date, school, degree) VALUES';
    for(i in educationData) {
      var row = [self.cvId, educationData[i].start_date, educationData[i].end_date, educationData[i].school, educationData[i].degree];
      rows.push('("' + row.join('","') + '")');
    }
    sql += rows.join(',');
    GLOBAL.sqlConnection.query(sql, data, cb);
  };

  var _addFields = function(fields, cb) {
    var rows = [];
    var sql = 'INSERT INTO CV_Fields (cv_id, name, value) VALUES';
    for(name in fields) {
      var row = [self.cvId, name, fields[name]];
      rows.push('("' + row.join('","') + '")');
    }
    sql += rows.join(',');
    GLOBAL.sqlConnection.query(sql, data, cb);
  }

  this.save = function(cb) {
    // Get default template
    _getFirstTemplate(function(err, template){
      if (err) {
        cb(true);
        return false;
      }
      // Save cv with default template
      _addCV(template.id, function(err, templateResponse) {
        if (err) {
          cb(true);
          return false;
        }
        self.cvId = templateResponse.insertId;
        // Save cv work
        _addWorkExperiences(data.work, function(err, workResponse){
          if (err) {
            cb(true);
            return false;
          }
          // Save cv education
          _addEducation(data.education, function(err, educationResponse){
            if (err) {
              cb(true);
              return false;
            }
            // Save other fields
            _addFields(data.fields, function(err, fieldsResponse) {
              if (err) {
                cb(true);
                return false;
              }
              _addFields(user, function(err, fieldsResponse2) {
                cb(false, { id: self.cvId });
              });
            });
          });          
        });
      });      
    });
  };

  this.get = function(cb) {
    GLOBAL.sqlConnection.query('SELECT * FROM CVs WHERE user_id = ? LIMIT 1', [self.userId], function(err, response) {
      if (err || !response.length) {
        cb(true);
        return false;
      }
      db.getCVByName(response[0].name, cb);
    })
  }
};