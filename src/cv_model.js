var db = require('./db');
module.exports = function(data, user) {
  console.log(data);
  var self = this;
  this.userId = user.id;
  this.cvId = null;

  if (data) {
    this.cvId = typeof data.id != 'undefined' ? data.id : null;
  }


  var _getFirstTemplate = function(cb) {
    GLOBAL.sqlConnection.query('SELECT * FROM Templates LIMIT 1', function(err, templates) {
      cb(err || !templates.length, templates[0]);
    });
  };

  var _addCV = function(templateId, cb){
    var data = {
      user_id: self.userId,
      name: "",
      template_id: templateId,
      created_on: new Date().getTime(),
      last_updated: new Date().getTime()
    };
    if (!self.cvId) {
      var sql = 'INSERT INTO CVs SET ?';
      var params = data;
    } else {
      var sql = 'UPDATE CVs SET ? WHERE id = ' + self.cvId;
      var params = data;
    }
    GLOBAL.sqlConnection.query(sql, params, function(err, response) {
      if (!self.cvId) {
        self.cvId = response.insertId;
      }
      cb(err, response);
    });
  };

  var _addWorkExperiences = function(workData, cb) {
    GLOBAL.sqlConnection.query("DELETE FROM CV_WorkExperiences WHERE cv_id = ?", [self.cvId], function() {
      var rows = [];
      var sql = 'INSERT INTO CV_WorkExperiences (cv_id, start_date, end_date, company, title, other_info) VALUES';
      for(i in workData) {
        var row = [self.cvId, workData[i].start_date, workData[i].end_date, workData[i].company, workData[i].title, GLOBAL.sqlConnection.escape(workData[i].other_info)];
        rows.push('("' + row.join('","') + '")');
      }
      sql += rows.join(',');
      GLOBAL.sqlConnection.query(sql, data, cb);
    });
  };

  var _addEducation = function(educationData, cb) {
    GLOBAL.sqlConnection.query("DELETE FROM CV_Education WHERE cv_id = ?", [self.cvId], function() {
      var rows = [];
      var sql = 'INSERT INTO CV_Education (cv_id, start_date, end_date, school, degree, other_info) VALUES';
      for(i in educationData) {
        var row = [self.cvId, educationData[i].start_date, educationData[i].end_date, educationData[i].school, educationData[i].degree, GLOBAL.sqlConnection.escape(educationData[i].other_info)];
        rows.push('("' + row.join('","') + '")');
      }
      sql += rows.join(',');
      GLOBAL.sqlConnection.query(sql, data, cb);
    });
  };

  var _addFields = function(fields, cb) {
    GLOBAL.sqlConnection.query("DELETE FROM CV_Fields WHERE cv_id = ?", [self.cvId], function() {
      var rows = [];
      var sql = 'INSERT INTO CV_Fields (cv_id, name, value) VALUES';
      for(name in fields) {
        var row = [self.cvId, name, fields[name]];
        rows.push('("' + row.join('","') + '")');
      }
      sql += rows.join(',');
      GLOBAL.sqlConnection.query(sql, data, cb);
    });
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
            for(i in user) {
              data.fields[i] = user[i];
            }
            _addFields(data.fields, function(err, fieldsResponse) {
              if (err) {
                cb(true);
                return false;
              }
              cb(false, { id: self.cvId });
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