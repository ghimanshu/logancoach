var mysql = require('mysql');
var config = require('../config');
var connection = mysql.createPool(config.db);

connection.config.connectionConfig.multipleStatements = true;
connection.config.connectionLimit = 8;

module.exports = connection;
