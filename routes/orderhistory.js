var config = require('../config'),
        db, //= require('./database'),
        auth = require('./authenticate').authenticate,
        authA = require('./authenticate').authenticateAdmin,
        mysql = require('mysql');


var queries = {
    getOrdersByDealer: "SELECT * FROM orders WHERE dealerId = ?",
    getAllOrders: "SELECT * FROM orders,dealerinfo WHERE dealerinfo.id = orders.dealerId",
    //getConfiguration:"SELECT * FROM orderitems WHERE orderId = ?"
    getConfiguration: "SELECT orderId, itemName, itemCost, categoryName FROM orderitems where orderId = ?;",
    getConfigurationSpecialRequests: "SELECT oreq.orderId, oreq.description itemName, oreq.cost itemCost, 'Special Request' as categoryName  FROM orderRequests oreq where orderId = ?;"

};

// SELECT orderId, itemName, itemCost, categoryName FROM orderitems where orderId = 1 UNION all SELECT oreq.orderId, oreq.description itemName, oreq.cost itemCost, 'Special Request' as categoryName  FROM orderRequests oreq where orderId = 1;

module.exports = function (app, d) {
    db = d;
    app.get("/history/all", authA, getAllOrders);
    app.get("/history/dealer", auth, getOrdersByDealer);
    app.get("/history/configuration/:id", auth, getHistoryConfiguration);
};

function getOrdersByDealer(request, response, next) {
    db.query(queries.getOrdersByDealer, [request.session.user.dealerId], function (err, result) {
        if (err) {
            response.json({"result": "failure", "message": "unable to get orders from database ", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getAllOrders(request, response, next) {
    db.query(queries.getAllOrders, function (err, result) {
        if (err) {
            response.json({"result": "failure", "message": "unable to get orders from database ", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getHistoryConfiguration(request, response, next) {
    var params = [request.params.id, request.params.id];
    db.query(queries.getConfiguration, request.params.id, function (err, items) {
      if (err) {
          response.json({"result": "failure", "message": "unable to get configuration from database ", "error": err});
          return;
      }
      db.query(queries.getConfigurationSpecialRequests, request.params.id, function (err, specialRequests) {
        if (err) {
            response.json({"result": "failure", "message": "unable to get configuration from database ", "error": err});
            return;
        }
        response.json({items: items, specialRequests: specialRequests});
        return;
      });
    });
}
