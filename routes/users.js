var	config = require('../config'),
	db ,//= require('./database'),
	auth = require('./authenticate').authenticateAdmin,
	authDealer = require('./authenticate').authenticate,
	bcrypt = require('bcrypt-nodejs'),
	requestjs = require('request'),
	quickbooksSubmit = require("./quickbooksSubmit");


var queries = {
	addDealer:"INSERT INTO dealerinfo (name,address1,address2,address3,address4,phone,otherInfo) VALUES (?,?,?,?,?,?,?);",
	addUser:"INSERT INTO users (dealerId,username,password,admin,email) VALUES (?,?,?,?,?);",
	getAllUsers:"SELECT u.dealerId, u.id,u.username,u.admin, d.name,d.address1,d.address2,d.address3,d.address4,d.phone,d.otherInfo FROM users u, dealerInfo d WHERE u.dealerId = d.id",
	getUserById:'SELECT * FROM users user WHERE id = ?;',
	changePassword:"UPDATE users SET password = ? WHERE id = ?",
	changeUsername:"UPDATE users SET username = ? WHERE id = ?",
	changeAdmin:"UPDATE users SET admin = ? WHERE id = ?",
	changeEmail:"UPDATE users SET email = ? WHERE id = ?",
	getAllDealers: "SELECT * FROM dealerinfo",
	getUsersById:'SELECT * FROM users user WHERE user.dealerId = ?;',
	deleteUser:"DELETE FROM users WHERE id = ?;",
	deleteDealer:"DELETE FROM dealerinfo WHERE id = ?;",
	updateDealer:"UPDATE dealerinfo SET name = ?, address1 = ?, address2 = ?, address3 = ?, address4 = ?, phone = ?, otherInfo = ? WHERE id = ?;"
};


module.exports = function(app,d){
	db =d;
	app.post('/user',auth,addUser);
	app.put('/admin/user/password',auth,changePassword);
	app.put('/admin/user/username',auth,changeUsername);
	app.put('/admin/user/admin',auth,changeAdmin);
	app.put('/admin/user/email',auth,changeEmail);
	app.put('/user/password',authDealer,changeCurrentPassword);
	app.post('/dealer',auth,addDealer,quickbooksSubmit);
	app.post('/user/dealer',auth,addDealerUser);
	app.get('/user',authDealer,getCurrentUser);
	app.get('/users',auth,getAllUsers);
	app.get('/dealers',auth,getAllDealers);
	app.get('/dealer/users/:id',auth,getUsersByDealerId);
	app.delete('/user/:id',auth,deleteUser);
	app.put('/dealers',auth,updateDealer,quickbooksSubmit);
	app.delete('/dealers',auth,deleteDealer);
	app.put('/dealers/all',auth,updateAll,quickbooksSubmit);
};

function updateAll(request,response,next){
	request.body.id = -1;
	request.body.type = 'CustomerQuery';
	next();
}

function deleteDealer(request,response,next){
	db.query(queries.deleteDealer, [request.body.id], function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":"failure","message":"unable delete dealer","error":err});
			return;
		}
		response.json({'result':'success','message':'successfully deleted dealer'});
		return;
	});
}

function updateDealer(request,response,next){
	var b = request.body;
	var params = [b.name,b.address1,b.address2,b.address3,b.address4,b.phone,b.otherInfo,b.id];
		request.body.id = b.id;
		request.body.type = "CustomerQuery";
		next();

	// db.query(queries.updateDealer, params, function(err,result){
	// 	if(err){
	response.statusCode = 500;
	// 		response.json({"result":"failure","message":"unable update dealer","error":err});
	// 		return;
	// 	}

	// 	// response.json({'result':'success','message':'successfully updated dealer'});
	// 	return;
	// });
}

function changeUsername(request,response,next){
	db.query(queries.changeUsername,[request.body.username,request.body.id],function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':err});
			return;
		}
		else{
			response.json({'result':'success'});
			return;
		}
	});
}

function changeEmail(request,response,next){
	db.query(queries.changeEmail,[request.body.email,request.body.id],function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':err});
			return;
		}
		else{
			response.json({'result':'success'});
			return;
		}
	});
}

function changeAdmin(request,response,next){
	db.query(queries.changeAdmin,[request.body.admin,request.body.id],function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message':err});
			return;
		}
		else{
			response.json({'result':'success'});
			return;
		}
	});
}

function deleteUser(request,response,next){
	db.query(queries.deleteUser, [request.params.id], function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":"failure","message":"unable delete user","error":err});
			return;
		}
		response.json({'result':'success','message':'successfully deleted user'});
		return;
	});
}

function getUsersByDealerId(request,response,next){
	db.query(queries.getUsersById, [request.params.id], function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":"failure","message":"unable retrieve users","error":err});
			return;
		}
		response.json(result);
		return;
	});
}

function getAllDealers(request,response,next){
	db.query(queries.getAllDealers, function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":"failure","message":"unable get Dealers","error":err});
			return;
		}
		response.json(result);
		return;
	});
}

function addUser(request, response,next){
	var b = request.body;
	bcrypt.hash(b.password,config.bcryptSalt,null,function(err,hash){
		if(err)	{
			response.statusCode = 500;
			response.json({'result':'failure','message':'unable to hash password','err':err});
			return;
		}
		var params = [b.dealerId,b.username,hash,b.admin,b.email];
		db.query(queries.addUser,params,function(err,res){
			if(err){
				response.statusCode = 500;
				response.json({'result':'failure','message': err});
				return;
			}
			response.json(res.inserId);
			return;
		});
	});
}

function addDealer(request,response,next){
	var b = request.body;
	var params = [b.name,b.address1,b.address2,b.address3,b.address4,b.phone,b.otherInfo];
	db.query(queries.addDealer,params,function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({'result':'failure','message': err});
			return;
		}
		request.body.id = result.insertId;
		request.body.type = "CustomerAdd";
		next();
		// response.json({'result':'success',"message":"successfully saved Dealer",'data':result.insertId});
		return;
	});
}

function addDealerUser(request,response,next){
	var b = request.body;
	var params = [b.name,b.address1,b.address2,b.address3,b.address4,b.phone,b.otherInfo];
	db.query(queries.addDealer,params,function(err,result){
		if(err)
		{
			response.statusCode = 500;
			response.json({'result':'failure','message': err});
			return;
		}
		//now add the user with that id
		bcrypt.hash(b.password,config.bcryptSalt,null,function(err,hash){
			if(err){
				response.statusCode = 500;
				response.json({'result':'failure','message':'unable to hash password','err':err});
				return;
			}
			params = [result.insertId,b.username,hash,b.admin];
			db.query(queries.addUser,params,function(err,res){
				if(err)
				{
					response.statusCode = 500;
					response.json({'result':'failure','message': err});
					return;
				}

				response.json({'result':'success',"message":"successfully saved user"});
				return;
			});
		});
	});
}

function getCurrentUser(request,response,next){
	db.query(queries.getUserById,[request.session.user.id],function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":'failure',"message":err});
			return;
		}
		else{
			var msg = {
				id       :result[0].id,
				username : result[0].username,
				email    : result[0].email
			};
			response.json(msg);
			return;
		}
	});
}

function getAllUsers(request,response,next){
	db.query(queries.getAllUsers,function(err,result){
		if(err){
			response.statusCode = 500;
			response.json({"result":'failure',"message":err});
			return;
		}
		else{
				response.json(result);
			return;
		}
	});
}

function changePassword(request,response,next){
	bcrypt.hash(request.body.password,config.bcryptSalt,null,function(err,hash){
		if(err)
		{
			response.statusCode = 500;
			response.json({'result':'failure','message':err});
			return;
		}

		db.query(queries.changePassword,[hash,request.body.id],function(err,result){
			if(err)
			{
				response.statusCode = 500;
				response.json({'result':'failure','message':err});
				return;
			}
			else{
				response.json({'result':'success'});
				return;
			}
		});
	});
}

function changeCurrentPassword(request,response,next){
	bcrypt.hash(request.body.password,config.bcryptSalt,null,function(err,hash){
		if(err)
		{
			response.statusCode = 500;
			response.json({'result':'failure','message':err});
			return;
		}

		db.query(queries.changePassword,[hash,request.session.user.id],function(err,result){
			if(err)
			{
				response.statusCode = 500;
				response.json({'result':'failure','message':err});
				return;
			}
			else{
				response.json({'result':'success'});
				return;
			}
		});
	});
}
