var expect    = require("chai").expect;
var request   = require("request");
var client =  require('request-json').createClient('http://localhost:3000/');

describe("Category API", function() {
  before(function(done){
    client.post('/login', {username:'admin', password:"asdfasdf"}, function(error, response, body){
      expect(body.result).to.not.equal("failure");
      expect(body.type).to.equal("admin");
      client.headers['Cookie'] = response.headers['set-cookie'].pop().split(';')[0];;
      done();
    });
  })

  it("lists categories", function(done) {
    client.get('/category', function(error, response, body){
      expect(body.length).to.be.above(1);
      done();
    })
  });

  it("gets a single category", function(done) {
    client.get('/category/1', function(error, response, body){
      expect(body.length).to.equal(1);
      done();
    })
  });

  it("can add categories", function(done) {
    var newCategory = {name:"TESTITEM", description:"An Item For Testing", superId:1, isMultiSelect:false}
    client.post('/category/', newCategory, function(error, response, body){
      expect(body.insertId).to.equal(3);
      client.get('/category/'+body.insertId, function(error, response, body){
        client.get('/category/', function(error, response, body){
          expect(body.length).to.equal(3);
          done();
        })
      });
    })
  });

  it("can change a category", function(done){
    var newCategory = {superId: 1, categoryName: "CHANGEDITEM", categoryDescription: "An Item For Testing" , isMultiSelect: 'false', rank: null}
    client.put('/category/'+3, newCategory, function(error, response, body){
      client.get('/category/'+3, function(error, response, body){
        expect(body[0].categoryName).to.equal('CHANGEDITEM');
        done();
      });
    });
  });

  it("can delete a category", function(done){
      client.delete('/category/'+3, function(error, response, body){
        expect(response.statusCode).to.equal(200);
        client.get('/category/', function(error, response, body){
          expect(body.length).to.equal(2);
          done();
        })
      });
  });
});
