var config = require('./config');
var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./routes/database');
var app = express();

// app.use(function(req, res, next) {
//     var reqType = req.headers["x-forwarded-proto"];
//     reqType == 'https' ? next() : res.redirect("https://" + req.headers.host + req.url);
// });
console.log('Setting port');
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('loganCoach'));
app.use(express.session());
app.use(app.router);

console.log('Setting Client path');

app.use(express.static(path.join(__dirname, '/client')));

console.log('Setting require modules');
require('./routes/login')(app, db);
require('./routes/items.js')(app,db);
require('./routes/category.js')(app,db);
require('./routes/trailer.js')(app,db);
require('./routes/costs.js')(app,db);
require('./routes/orders.js')(app,db);
require('./routes/estimates.js')(app,db);
require('./routes/estimateconfig.js')(app,db);
require('./routes/users.js')(app,db);
require('./routes/orderhistory.js')(app,db);
require('./routes/specialRequests.js')(app,db);

app.post('/quickbookstest', function (request, response, next) {
  console.log("====quickbookstest=====");
  console.log(request.body);
  console.log("=======================");
  response.send('success');
});

console.log('Setting NODE Server');
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
