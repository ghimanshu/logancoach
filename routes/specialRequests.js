module.exports = function(app,db) {

var authA = require('./authenticate').authenticateAdmin;
var auth = require('./authenticate').authenticate;

app.get("/specialrequests",auth,function (request,response){
	db.query("SELECT * FROM specialrequests WHERE estimateId = ?;",[ request.query.estimateId],function(err,result){
		if(err){
			console.log(err);
			response.json({"result":"failure","data":err});
			return;
		}
		request.session.oldValues = result;
		response.json(result);
	});
});

app.post("/specialrequests",auth,function (request,response){
	var estimateId = request.body.estimateId;
	var requests = JSON.parse(request.body.requests);
	var srParams = [];

	for (var i = 0; i < requests.length; i++) {
		r = requests[i];
		var cost = 0;
		if(request.session.aliased !== false){
			cost = r.cost;
		}
		srParams[i]=[estimateId,r.description,cost];
	}

	db.query("INSERT INTO specialrequests (estimateId,description,cost) values ?;",[srparams],function(err,result){
		if(err){
			console.log(err);
			response.json({"result":"failure","data":err});
		} else {
			response.json(result);
		}
	});
});

};
