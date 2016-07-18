var req = require('request'),
        auth = require('./authenticate').authenticate,
        authA = require('./authenticate').authenticateAdmin,
        db = require('./database'),
        config = require("../config.js");
var queries = {
    getUserByOrderId: "SELECT dealerId from orders where orderId = ?"
};


function quickbooksRequest(forms) {
    var that = {
        url: config.quickbooksRequestURL,
        method: 'POST',
        form: forms,
        strictSSL: true
    };
    return that;
}

function quickbooksForm(id, type) {
    var that = {};
    that.id = id;
    that.type = type;
    that.loganCoach = config.quickbooksPassword;

    return that;
}

var quickbooksSubmit = function (request, response) {
    var form = quickbooksForm(request.body.id, request.body.type);
    var r = quickbooksRequest(form);

    req(r, function (err, res, body) {

        if (err || body !=='success') {
          if(request.dbConnection) {
            request.dbConnection.rollback(function(){
                console.log(err);
                request.dbConnection.release();
                response.statusCode=500;
                response.json({'result': 'failure', 'error': res, message:"Error Submitting Order. try again. If this persists Contact logan Coach for assistance"});
            });
          } else {
            response.json({'result': 'failure', 'error': res, message:"Error Submitting Order. try again. If this persists Contact logan Coach for assistance"});
          }
        }

        if(request.dbConnection) {
        request.dbConnection.commit(function(err){
            if(err){
                throw err;
            }
            request.dbConnection.release();
            response.json({'result': 'success'});
        });
      } else {
        response.json({'result': 'success'});
      }

    });
};

module.exports = quickbooksSubmit;
