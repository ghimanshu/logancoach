var fs = require('fs'),
        config = require('../config'),
        db, // = require('./database'),
        auth = require('./authenticate').authenticateAdmin,
        authDealer = require('./authenticate').authenticate;

var queries = {
    addTrailer: "INSERT INTO trailer (trailerName,trailerDescription,trailerCost,trailerUrl)VALUES(?,?,?,?);",
    deleteTrailer: "delete from estimates where trailerId= ?;" +
            "delete from specialrequests where estimateId in (select estimateId from dealerestimate where trailerId = ?);" +
            "delete from dealerestimate where trailerId = ?;" +
            "DELETE FROM excludeitem where trailerId = ?" +
            "DELETE FROM itemcost where trailerId = ?; DELETE FROM trailer WHERE trailerId = ?;",
    deleteTrailerConfiguration: "DELETE FROM estimates where trailerId = ?; " +
            "DELETE FROM excludeitem where trailerId = ?;" +
            "DELETE FROM itemcost where trailerId = ?;" +
            "UPDATE dealerestimate set valid = 'false' where trailerId = ?;",
    updateTrailer: "UPDATE trailer set trailerName = ?, trailerDescription = ?, trailerCost = ?, trailerUrl = ?,rank = ? WHERE trailerId = ?",
    getAllTrailer: "SELECT * FROM trailer order by rank",
    getAllPublicTrailer: "SELECT * FROM trailer WHERE isPublic = 'true'",
    getTrailerById: "SELECT * FROM trailer where trailerId = ?",
    setPublish: "UPDATE trailer set isPublic = 'true' WHERE trailerId = ?",
    getExclusionsByTrailerId: "SELECT itemId, excluded FROM excludeitem where trailerId = ? ORDER BY itemId, excluded",
    setOnHold: "UPDATE trailer set isPublic = 'false' WHERE trailerId = ?"
};

module.exports = function (app, d) {
    db = d;
    app.post('/trailer', auth, addTrailer);
    app.delete('/trailer/:id', auth, deleteTrailer);
    app.delete('/trailer/configuration/:id', auth, deleteTrailerConfiguration);
    app.put('/trailer/:id', auth, updateTrailer);
    app.put('/trailer/public/:id', auth, setPublish);
    app.put('/trailer/onhold/:id', auth, setOnHold);
    app.get('/trailer', auth, getAllTrailer);
    app.get('/trailer/public', authDealer, getAllPublicTrailer);
    app.get('/trailer/:id', authDealer, getTrailerById);
    app.get('/exclusions/:trailerId', getExclusionsByTrailerId);
};

function getExclusionsByTrailerId(request, response, next) {
    var trailerId = request.params.trailerId;
    db.query(queries.getExclusionsByTrailerId, [trailerId], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "Error getting Exclusions", "error": err});
            return;
        }
        else {
            var toReturn = result.reduce(function (prev, cur, index, array) {
                if (prev[cur.itemId] === undefined) {
                    prev[cur.itemId] = [cur.excluded];
                }
                else {
                    prev[cur.itemId].push(cur.excluded);
                }
                return prev;
            }, {});
            response.json(toReturn);
            return;
        }
    });
}


function deleteTrailerConfiguration(request, response, next) {
    var trailerId = request.params.id;
    var params = [trailerId, trailerId, trailerId, trailerId];
    db.query(queries.deleteTrailerConfiguration, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': 'failed to delete configuration', "error": err});
            return;
        }
        else {
            response.json(result.insertId);
            return;
        }
    });
}

function addTrailer(request, response, next) {
    var b = request.body;
    if (!b.trailerDescription)
        b.trailerDescription = "";
    var params = [b.trailerName, b.trailerDescription, b.trailerCost, b.trailerUrl];
    db.query(queries.addTrailer, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': 'failed to save trailer', "error": err});
            return;
        }
        else {
            response.json(result.insertId);
            return;
        }
    });
}

function deleteTrailer(request, response, next) {
    var b = request.body;
    var id = request.params.id;
    var params = [id, id, id, id, id, id];
    db.query(queries.deleteTrailer, params, function (err, result) {
        if (err)
        {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': "Error deleting trailer", "error": err});
            return;
        }
        else
        {
            response.json({'result': 'success', "message": "successfully deleted trailer"});
        }
    });
}

function updateTrailer(request, response, next) {
    var b = request.body;
    var id = request.params.id;
    if (!b.trailerDescription) {
        b.trailerDescription = "";
    }
    var params = [b.trailerName, b.trailerDescription, b.trailerCost, b.trailerUrl, b.rank, id];
    db.query(queries.updateTrailer, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({'result': 'error', 'message': "unable to update trailer", "error": err});
            return;
        }
        else {
            response.json({'result': 'success', "message": "successfully updated trailer"});
            return;
        }
    });
}

function setPublish(request, response, next) {
    var id = request.params.id;
    db.query(queries.setPublish, [id], function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({'result': 'error', 'message': "unable to update trailer", "error": err});
            return;
        }
        else {
            response.json({'result': 'success', "message": "successfully updated trailer"});
            return;
        }
    });
}

function setOnHold(request, response, next) {
    var id = request.params.id;
    db.query(queries.setOnHold, [id], function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({'result': 'error', 'message': "unable to update trailer", "error": err});
            return;
        }
        else {
            response.json({'result': 'success', "message": "successfully updated trailer"});
            return;
        }
    });
}

function getAllTrailer(request, response, next) {
    db.query(queries.getAllTrailer, function (err, result) {
        if (err)
        {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': "Unable to retrieve trailers", "error": err});
            return;
        }
        else {
            response.json(result);
            return;
        }
    });
}

function getAllPublicTrailer(request, response, next) {
    db.query(queries.getAllPublicTrailer, function (err, result) {
        if (err)
        {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': "Unable to retrieve trailers", "error": err});
            return;
        }
        else {
            response.json(result);
            return;
        }
    });
}

function getTrailerById(request, response, next) {
    var id = request.params.id;
    var params = [id];
    db.query(queries.getTrailerById, params, function (err, result) {
        if (err)
        {
            response.statusCode = 404;
            response.json({'result': 'failure', 'message': "unable to retrieve trailer", "error": err});
            return;
        }
        else
        {
            response.json(result);
        }
    });
}
