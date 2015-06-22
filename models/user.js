var db = require('../db');
var hashPassword = require('./password-hasher');

module.exports = {
  authenticate: function(username, password, cb) {
    var password = hashPassword(password);
    var sql = 'SELECT * FROM users WHERE username = "' + username + '" AND password = "' + password + '" LIMIT 1';
    db.query(sql, cb);
  },
  findById: function(id, cb) {
    var sql = 'SELECT * FROM users WHERE id = "' + id + '" LIMIT 1';
    db.query(sql, cb);
  },
  create: function(data, cb) {
    var password = hashPassword(data.password);
    var sql = 'INSERT INTO users(username, email, password) VALUES("' + data.username +'", "' + data.email +'", "' + password +'")';
    db.query(sql, function(err, response) {
      cb(err, response.insertId);
    });
  }
};