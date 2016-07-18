var     fs = require('fs'),
		config = require('../config'),
		db,// = require('./database'),
		auth = require('./authenticate').authenticateAdmin;

var queries = {
	addCost:"INSERT INTO itemcost (trailerId,itemId,itemCost,standard) values (?,?,?,?);",
	deleteCost:"DELETE FROM itemcost where trailerId = ? AND itemId = ? ;",
	updateCost:"UPDATE itemcost it set it.itemCost = ?, it.standard = ? WHERE it.trailerId = ? AND it.itemId = ?;",
	getCostByTrailerBig: "SELECT * FROM itemcost ic, item it, category cat, supercategory sc, trailer t\n" +
											"WHERE ic.itemId = it.itemId AND\n" +
											"cat.categoryId= it.categoryId AND\n" +
											"cat.superCategoryId = sc.superId AND\n" +
											"ic.trailerId = t.trailerId AND\n" +
											"ic.trailerId = ?;",

	getCostById:  "SELECT * FROM itemcost ic, item it, category cat, supercategory sc, trailer t\n" +
											"WHERE ic.itemId = it.itemId AND\n" +
											"cat.categoryId= it.categoryId AND\n" +
											"cat.superCategoryId = sc.superId AND\n" +
											"ic.trailerId = t.trailerId AND\n" +
											"it.itemId = ?;",
	getAllCost:"SELECT * FROM itemcost ic, item it, category cat, supercategory sc, trailer t\n" +
											"WHERE ic.itemId = it.itemId AND\n" +
											"cat.categoryId= it.categoryId AND\n" +
											"cat.superCategoryId = sc.superId AND\n" +
											"ic.trailerId = t.trailerId ;"
};


module.exports = function (app,d) {
	db = d;
	app.post('/cost',auth,addCost);
	app.delete('/cost',auth,deleteCost);
	app.put('/cost',auth,updateCost);
	app.get('/cost/trailer',auth,getCostByTrailer);
	app.get('/cost/trailer/item',auth,getCostById);
	app.get('/cost',auth,getAllCost);
};


function addCost(request, response, next){
	var b = request.body;
	var params = [b.trailerId,b.itemId,b.cost,b.standard];
	db.query(queries.addCost, params, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':"unable to save cost","error":err});
			return;
		}
		else{
			response.json({'result':'success',"message":"successfully saved item"});
			return;
		}
	});
}

function deleteCost(request,response,next){
	var b = request.body;
	var params = [b.trailerId, b.itemId];
	db.query(queries.deleteCost, params, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':"unable to deleteCost","error":err});
			return;
		}
		else{
			response.json({'result':'success',"message":"successfully deleted cost"});
			return;
		}
	});
}

function updateCost(request,response,next){
	var b = request.body;
	var params = [b.cost,b.standard,b.trailerId,b.itemId];
	db.query(queries.updateCost, params, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':"unable to update cost","error":err});
			return;
		}
		else{
			response.json({'result':'success',"message":"successfully saved cost"});
		}
	});
}

function getCostByTrailer(request,response,next){
	var b = request.query;
	var params = [b.trailerId];
	db.query(queries.getCostByTrailerBig, params, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':"failed to retrieve costs","error":err});
			return;
		}
		else{
			response.json(result);
		}
	});
}

function getCostById(request,response,next){
	var b = request.query;
			var params = [b.itemId,b.trailerId];
	db.query(queries.getCostById, params, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':"failded to save ","error":err});
			return;
		}
		else{
			response.json(result);
		}
	});
}

function getAllCost(request,response,next){
	db.query(queries.getAllCost, function(err,result){
		if(err)
		{
			response.statusCode = 500;
			response.json({'result':'failure','message':"failed to retrieve costs","error":err});
			return;
		}
		else
		{
			response.json(result);
		}
	});
}
