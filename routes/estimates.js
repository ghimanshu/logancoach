module.exports = function (app, db) {
var auth = require('./authenticate').authenticate;

app.get('/estimate', auth, function (request, response, next) {
    var getAllEstimatesQuery = "SELECT de.*,t.*,SUM( case when ic.itemCost is null then item.defaultPrice else ic.itemCost end) as upgradeCost" +
            " FROM dealerestimate de " +
            " LEFT JOIN trailer t on t.trailerId = de.trailerId " +
            " LEFT JOIN estimates est on est.estimateId = de.estimateId " +
            " LEFT JOIN item on est.itemId = item.itemId " +
            " LEFT JOIN itemcost ic on ic.itemId = item.itemId and ic.trailerId = t.trailerId " +
            " WHERE t.isPublic = 'true'  " +
            " and de.dealerId = ?  " +
            " GROUP BY de.estimateId, de.name, de.dealerId, de.trailerId, de.description,de.valid,de.specialRequests,  " +
            " t.trailerId, t.trailerName,t.trailerDescription,t.trailerCost,t.trailerUrl,t.isPublic "
    db.query(getAllEstimatesQuery, [request.session.user.dealerId], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "", "error": err});
            return;
        }
        else {
            response.json(result);
        }
    });
});

app.post('/estimate', auth, function (request, response, next) {
    var b = request.body;
    var params = [b.estimateName, request.session.user.dealerId, b.trailerId, b.estimateDescription];
    var addEstimateQuery = "INSERT INTO dealerestimate (status, name, dealerId, trailerId, description) VALUES ('Needs Configuring',?,?,?,?);";
    db.query(addEstimateQuery, params, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "", "error": err});
            return;
        }
        else {
            response.json(result.insertId);
        }
    });
});

app.put('/estimate/:id', auth, function (request, response, next) {
    var b = request.body;
    var params = [b.name, b.description, b.retailPrice, request.params.id, request.session.user.dealerId];
    var updateEstimateQuery = "UPDATE dealerestimate SET name = ?, description = ?, retailPrice = ? WHERE estimateId = ? AND dealerId = ?;";
    db.query(updateEstimateQuery, params, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "unable to update estimate", "error": err});
            return;
        }
        else {
            response.json(result);
        }
    });
});

app.delete('/estimate/:id', auth, function (request, response, next) {
    var id = request.params.id;
    var params = [id, id, request.session.user.dealerId, id];

    var deleteEstimateQuery = "DELETE FROM estimates WHERE estimateId = ? ;DELETE FROM specialrequests Where estimateId = ?; DELETE FROM dealerestimate WHERE dealerId = ? AND estimateId = ?; ";
    db.query(deleteEstimateQuery, params, function (err, result) {
        if (err) {
            console.log(err);
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "unable to delete estimate", "error": err});
            return;
        }
        else {
            response.json(result);
            return;
        }
    });
});
};
