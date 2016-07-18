var expect    = require("chai").expect;
var request   = require("request");

var client =  require('request-json').createClient('http://localhost:3000/');

describe("Server Running", function() {
  var url = "http://localhost:3000/";

  it("returns status 200", function(done) {
    request(url, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

describe("Login API", function(){
  it("fails on bad login", function(done) {
    client.post('/login', {username:"invalidusername", password:"invalidpass"}, function(error, response, body){
      expect(body.result).to.equal("failure");
      done();
    });
  });

  it("succeeds on good login", function(done) {
    client.post('/login', {username:'dealer', password:"asdfasdf"}, function(error, response, body){
      expect(body.result).to.not.equal("failure");
      done();
    });
  });


  it("recognizes admin", function(done) {
    client.post('/login', {username:'admin', password:"asdfasdf"}, function(error, response, body){
      expect(body.result).to.not.equal("failure");
      expect(body.type).to.equal("admin");
      done();
    });
  });

  it("recognizes dealer", function(done) {
    client.post('/login', {username:'dealer', password:"asdfasdf"}, function(error, response, body){
      expect(body.type).to.equal("dealer");
      done();
    });
  });
});
