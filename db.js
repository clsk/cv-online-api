var mysql = require('mysql');
try {
  var dbConfig = require('./config/local-database');
} catch (e) {
  var dbConfig = require('./config/database');
}
 
var connection = mysql.createConnection(dbConfig);

connection.query('USE cvs');

module.exports = connection;