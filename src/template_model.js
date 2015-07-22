module.exports = {
  get: function (id,cb){
    GLOBAL.sqlConnection.query('SELECT * FROM Templates where id=?',[id], function(err, templates) {
      cb(err || !templates.length, templates[0]);
    });
  },
  all: function (cb){
    GLOBAL.sqlConnection.query('SELECT * FROM Templates', function(err, templates) {
      cb(err || !templates.length, templates);
    });
  }
};