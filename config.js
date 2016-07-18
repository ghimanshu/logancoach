var parse = require('url').parse;
var config = {};

//database settings
// heroku settings are stored in environment variable
if(process.env.CLEARDB_DATABASE_URL){ //openshift
    console.log("process.env.CLEARDB_DATABASE_URL")
    var url = parse(process.env.CLEARDB_DATABASE_URL);
    // var url = parse('mysql://b63d28b763f2d8:e742f8a3@us-cdbr-iron-east-01.cleardb.net/heroku_baf1eb8d5a744b9?reconnect=true');

    var auth = url.auth.split(':');
    config.db = {
        host:url.hostname,
        database:url.pathname.substr(1),
        user:auth[0],
        password : auth[1],
        multipleStatements:true
    };
}
else if(process.env.MYSQL_USER){
    console.log("process.env.MYSQL_USER" + process.env.MYSQL_USER);
    console.log("process.env.MYSQL_PASSWORD" + process.env.MYSQL_PASSWORD);
    console.log("unit test server");
  config.db = {
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    host:"localhost",
    port:3306,
    schema:'logancoachtestdata',
    database:'logancoachtestdata',
    multipleStatements: true
  };
  config.isdev = true;
} else {
console.log("local development, real data server")
  config.isdev = true;
  config.db = {
    user:"root",
    password:"technoflair123#",
    host:"localhost",
    port:3306,
    schema: 'logancoachtestdata',
    database: 'logancoachtestdata',
    multipleStatements: true
  };
// console.log("local development, test data server")
//   config.db = {
//     user:"root",
//     password:"unicycle",
//     host:"localhost",
//     port:3306,
//     schema:'logancoachtestdata',
//     database:'logancoachtestdata',
//     multipleStatements: true
//   };
 }

config.quickbooksPassword = "thisIsATESTtoSEEIFitworks";
config.quickbooksRequestURL = process.env.QUICKBOOKS_URL || "http://localhost:3000/quickbookstest";

module.exports = config;
