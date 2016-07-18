var config = require('../config'),
        db, //= require('./database'),
        auth = require('./authenticate').authenticate,
        authA = require('./authenticate').authenticateAdmin,
        mysql = require('mysql'),
        quickbooksSubmit = require('./quickbooksSubmit.js'),
        // quickbooksSubmit = function(req,res){res.send("quickbooks test")},
        mailer = require('./mailer'),
        bcrypt = require('bcrypt-nodejs');


var queries = {
    addTrailer: "INSERT INTO orders (dealerId,trailerId,submitted) values (?,?,FALSE);",
    addConfiguration: "INSERT into orderitems ( orderId, itemId, itemName, itemCost, itemDescription) values" +
            "( ?,?, (select itemName from item where  itemId = ?)," +
            "(select itemCost from itemcost where trailerId = (select trailerId from orders where orderId = ?) AND itemId = ?), " +
            "(select itemDescription from item where itemId = ?));",
    addConfigurationBulk: "INSERT INTO orderitems (orderId,itemId) VALUES ? ON DUPLICATE KEY update itemId = itemId;",
    deleteOrder: "DELETE FROM orderitems WHERE orderId = ?; DELETE FROM orders WHERE orderId = ?;",
    deleteConfiguration: "DELETE FROM orderitems WHERE orderId = ? AND itemId = ?;",
    submitOrderInformation: "insert into orders (dealerId, trailerId, trailerName, trailerDescription, trailerCost, SalesmanFirst, SalesmanLast ) VALUES " +
            "(?,?, (SELECT trailerName FROM trailer where trailerId = ?), " +
            "(SELECT trailerDescription from trailer where trailerId = ?), " +
            "(select trailerCost from trailer where trailerId = ?),?,?); ",
    submitOrderItems: "INSERT INTO orderitems  " +
            "SELECT ? as orderId, it.itemId, it.itemName, CASE WHEN ic.itemCost IS NULL THEN it.defaultPrice ELSE ic.itemCost END as itemCost, it.itemDescription ,cat.categoryName,est.quantity, cat.rank " +
            "FROM item it, itemcost ic, estimates est, category cat  " +
            "WHERE ic.itemId = it.itemId  " +
            "AND ic.trailerId = ?  " +
            "AND est.itemId = it.itemId  " +
            "AND it.categoryId = cat.categoryId  " +
            "AND est.estimateId = ?; " +
            "INSERT INTO orderrequests (orderId,description,cost) " +
            "	SELECT ? as orderId, description, cost " +
            "	FROM specialrequests " +
            "	WHERE estimateId = ?;",
    submitOrderRequests: "INSERT INTO orderrequests " +
            "	SELECT  res.id AS requestId, ? AS orderId,  res.description,res.cost " +
            "	FROM specialrequests res " +
            "	where res.estimateId = ?	;",
    getEstimate: "SELECT * FROM dealerestimate WHERE estimateId = ?",

    getEmail: "SELECT * FROM users WHERE admin = 'true';" +
            "SELECT * FROM users WHERE dealerId = ?; " +
            "SELECT * FROM dealerinfo where id = ?;",
    addExclusions: "DELETE FROM excludeitem WHERE trailerId = ? ; INSERT INTO excludeitem(trailerId,itemid,excluded) VALUES ? ;",
    getStatuses: "SELECT dealerestimate.estimateId, dealerinfo.name as dealer, dealerestimate.name as estimate, dealerestimate.description, status FROM `dealerinfo` INNER JOIN dealerestimate on dealerestimate.dealerId = dealerinfo.id"
};

module.exports = function (app, d) {
    db = d;
    app.post('/order', auth, addNewOrder);
    app.post('/order/configuration', auth, addConfiguration);
    app.get('/order/status', auth, getOrderStatus);
    // app.post('/order/configuration/bulk',auth,addConfigurationBulk);
    app.put('/order/status/:id', auth, updateOrderStatus);
    app.post('/submit/order', auth, validatePassword, submitOrder, quickbooksSubmit);
    // app.post('/estimate/exclusions/', addExclusions);
    // app.delete('/order',authA, deleteOrder );
    // app.delete('/order/configuration/bulk',auth,deleteConfigurationBulk );
    // app.delete('/order/configuration',auth,deleteConfiguration);
};

function getOrderStatus(request, response, next) {
  db.query(queries.getStatuses, function(err, result) {
    if (err) {
      response.statusCode = 500;
      response.json({'result': 'failure', 'message': "Error getting estimate status", "error": err});
    } else {
      response.json(result);
    }
  });
}

function updateOrderStatus(request, response, next) {
  var estimateId = request.params.id;
  var status = request.body.status;
  db.query(queries.updateStatus, [status, estimateId], function(err, result) {
    if (err) {
      response.statusCode = 500;
      response.json({'result': 'failure', 'message': "Error updating estimate status", "error": err});
    } else {
      response.json({estimateId: estimateId, status: status});
    }
  });
}


function addExclusions(request, response, next) {
    var trailerId = request.body.trailerId;
    var rawExclusions = request.body.exclusions;

    db.query(queries.addExclusions, [trailerId, rawExclusions], function (err, result) {
        if (err) {
            response.statucCode = 500;
            response.json({'result': 'failure', 'message': "Error Saving Exclusions", "error": err});
            return;
        }
        else {
            response.json(result);
        }
    });
}





function addNewOrder(request, response, next) {
    var b = request.body;

    var params = [request.session.user.dealerId, b.trailerId];

    db.query(queries.addTrailer, params, function (err, result) {
        if (err) {
            response.statusCode = 500;

            response.json({'result': 'failure', 'message': "Error adding trailer", "error": err});
            return;
        }
        else
        {
            response.json(result.insertId);
        }
    });
}

function addConfiguration(request, response, next) {
    var b = request.body;
    var o = b.orderId;
    var i = b.itemId;
    var params = [o, i, i, o, i, i];
    db.query(queries.addConfiguration, params, function (err, result) {
        if (err)
        {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "unable to save item to invoice", "error": err});
            return;
        }
        else
        {
            response.json({'result': 'success', "message": " successfully saved item"});
        }
    });
}

// function addConfigurationBulk(request,response,next){
// 	var items = JSON.parse(request.body.items);
// 	var orderId = request.body.orderId;
// 	var params = [];

// 	for (var i = 0; i < items.length; i++) {
// 		params [i] = [orderId,items[i]];
// 	}
// 	console.log(params);
// 	console.log(mysql.format(queries.addConfigurationBulk,[params]));

// 	db.query(queries.addConfigurationBulk,[params],function(err,result){
// 		if(err){
// 			response.json({'result':'failure','message':"","error":err });
// 			return;
// 		}
// 		else	{
// 			response.json({'result':'success',"message":"successfully saved configuration"});
// 		}
// 	});
// }

function isValid(val) {
    if ((typeof val === 'undefined') || val === null) {
        return false;
    }
    return true;
}

function getItemsArray(items) {
    var toReturn = [];
    for (var i = 0; i < items.length; i++) {
        var cur = items[i];
        if (isValid(cur.categories)) {
            for (var j = 0; j < cur.categories.length; j++) {
                var curCategory = cur.categories[j];
                // if (curCategory.name=="Aluminum Exterior Wall Slats (Bottom Half of Wall) Coverage Area") {
                //   console.log(curCategory);
                // }
                if (isValid(curCategory.selectedItem)) {
                    curCategory.selectedItem.selected = true;
                    toReturn.push(curCategory.selectedItem);
                }
                else if (curCategory.optional === true && curCategory.items[0].isMultiSelect === 'false') {
                    break;
                }
                else {
                    if (isValid(curCategory.items)) {
                        for (var k = 0; k < curCategory.items.length; k++) {
                            toReturn.push(curCategory.items[k]);
                        }
                    }
                }
            }
        }
    }
    return toReturn;
}

function validatePassword(request, response, next) {
    bcrypt.compare(request.body.password, request.session.user.password, function (err, resp) {
        if (err || resp === false) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': err});
        }
        else {
            next();
        }
    });
}

function submitOrder(request, response, next) {
    var dealerId = request.session.user.dealerId;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var estimateId = request.body.estimateId;
    db.getConnection(function (err, connection) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': "failure", "error": err});
        }
        request.dbConnection = connection;
        connection.beginTransaction(function (err) {
            if (err) {
                connection.release();
                response.statusCode = 500;
                response.json({'result': "failure", "error": err});
            }


            connection.query(queries.getEstimate, [estimateId], function (err, result) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        response.statusCode = 500;
                        response.json({"result": "failure", "error": err});
                    });
                }
                var estimate = result[0];
                if (estimate === undefined) {
                    response.json({"result": "failure", "error": "invalid Estimate Id"});
                    connection.rollback(function () {
                        connection.release();
                        response.statusCode = 500;
                        response.json({"result": "failure", "error": "invalid Estimate ID"});
                    });
                }

                var trailerId = estimate.trailerId;
                if (dealerId !== estimate.dealerId || estimate.valid === "false") {
                    connection.rollback(function () {
                        connection.release();
                        response.statusCode = 500;
                        response.json({"result": "failure", "error": "invalid dealerId or invalid estimate"});
                    });
                }

                var params = [dealerId, trailerId, trailerId, trailerId, trailerId, firstName, lastName];
                connection.query(queries.submitOrderInformation, params, function (err, result1) {
                    if (err) {
                        connection.rollback(function () {
                            connection.release();
                            response.statusCode = 500;
                            response.json({"result": "failure", "error": err});
                        });
                    }
                    else {
                        params = [result1.insertId, trailerId, estimateId, result1.insertId, estimateId];
                        connection.query(queries.submitOrderItems, params, function (err, result2) {
                            if (err) {
                                connection.rollback(function () {
                                    connection.release();
                                    response.statusCode = 500;
                                    response.json({"result": "failure", "error": err});
                                });
                            }
                            else {
                                connection.query(queries.getEmail, [request.session.user.dealerId, request.session.user.dealerId], function (error3, result3) {
                                    if (error3)
                                    {

                                        connection.rollback(function () {
                                            connection.release();
                                            response.statusCode = 500;
                                            response.json({"result": "failure", "error": error3});
                                        });
                                    }
                                    var emails = "";
                                    for (var i = result3[0].length - 1; i >= 0; i--) {
                                        emails += result3[0][i].email + ",";
                                    }
                                    var subject = firstName + " " + lastName + " has submitted an order for " + request.session.dealerInfo.name;
                                    var message = firstName + " " + lastName + " has submitted an order for " + request.session.dealerInfo.name + " it will appear in quickbooks as an estimate under their account in the next " +
                                            "few minutes \n\n\n Do not respond to this message as it is comming from an unmonitored email address.";
                                    mailer.send(emails, subject, message, function (e, r) {
                                    });
                                    subject = "Order Confirmation";
                                    message = "This is an automated email in response to the submission of an order for a trailer " +
                                            "to logan Coach. Details of the order can be found on the dealer website of Logan Coach.";
                                    message += "\n\n This order was submitted by " + firstName + " " + lastName + ".";
                                    message += "\n\n If you have questions or if this order was made in error please contact Logan Coach directly.";
                                    message += "\n\n Do not respond to this message the email address is unmonitored.";
                                    emails = "";
                                    for (i = result3[1].length - 1; i >= 0; i--) {
                                        emails += result3[1][i].email + ",";
                                    }
                                    if (emails !== "") {

                                        mailer.send(emails, subject, message, function (e, r) {
                                        });
                                    }
                                    request.body.type = "InvoiceAdd";
                                    request.body.id = result1.insertId;
                                    next();
                                });
                            }
                        });
                    }
                });
            });
        });
    });
}
