module.exports = function(app, db) {

var fs = require('fs');
var config = require('../config');
var bcrypt = require('bcrypt-nodejs');
var authAdmin = require('./authenticate').authenticateAdmin;
var auth = require('./authenticate').authenticate;

app.post('/login', function (request, response, next) {
    var getUserData = "select * from users where username = ?; SELECT * FROM users,dealerinfo WHERE users.dealerId = dealerinfo.id AND users.username = ?;"
    console.log(getUserData);
    db.query(getUserData, [request.body.username, request.body.username], function (err, result) {
      if (err) {
        response.status = 500;
        response.json({ 'result': 'failure', 'message': err });
        return;
      }

      if (result[0][0] === undefined) {
        response.status = 500;
        response.json({ 'result': 'failure', 'message': 'invalid password or username' });
        return;
      }

      bcrypt.compare(request.body.password, result[0][0].password, function(err, password_hash_matches) {
        if (err) {
          response.status = 500;
          response.json({ 'result': 'failure', 'message': err });
          return;
        } else if (password_hash_matches) {
          var type;
          request.session.user = result[0][0];
          request.session.aliased = false;
          request.session.dealerInfo = result[1][0];
          type = (result[0][0].admin === "true") ? "admin" : "dealer"
          response.json({ 'result': 'success', 'type': type, 'message': request.body.username + ' logged in successfully', 'dealerName': request.session.dealerInfo.name });
        } else {
          response.status = 500;
          response.json({ 'result': 'failure', 'message': "invalid password or username" });
        }
      });
    });
  });

app.get('/logout', function (request, response, next) {
  //maybe do some additional cleanup here
  request.session.destroy();
  response.redirect('/');
});

app.post('/changedealership', authAdmin, function (request, response, next) {
  if (!request.body.id) {
    response.status = 500;
    response.json({ "result": "failure" });
    return;
  }

  db.query("SELECT * FROM dealerinfo where id = ?", [request.body.id], function(err, dealerInfo) {
    if (err) {
      response.statusCode = 500;
      response.json({ "result": "failure" });
      return;
    }
    request.session.dealerInfo = dealerInfo[0];
    request.session.aliased = true;
    request.session.user.dealerId = request.body.id;
    request.session.user.admin = "false";
    response.json({ "result": "success" });
  });
});

app.get("/isaliased", auth, function (request, response, next) {
  response.json(request.session.aliased);
});

app.get("/dealershipname", auth, function (request, response) {
  response.json(request.session.dealerInfo.name);
});

};
