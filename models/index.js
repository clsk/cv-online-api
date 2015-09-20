var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var dbconfig = require('../config/database');
var db        = {};

db.sql = new Sequelize(dbconfig.database, dbconfig.user, dbconfig.password, {
    host: dbconfig['host'],
    dialect: 'mysql',
    pool: {
        max: dbconfig.connectionLimit,
        min: 0,
        idle: 10000
    },
    define: {
        underscored: true
    }
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = db.sql.import(path.join(__dirname, file));
    db[model.name + 's'] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


module.exports = db;
