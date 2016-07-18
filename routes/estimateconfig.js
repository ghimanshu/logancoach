module.exports = function (app, db) {
var auth = require('./authenticate').authenticate

app.get('/estimate/asConfigured/:id', function (request, response, next) {
    var estimateId = request.params.id;
    var getEstimateAsConfiguredQuery = "SELECT item.itemName, item.itemDescription, CASE WHEN ic.itemCost IS NULL THEN item.defaultPrice ELSE ic.itemCost END AS itemCost, est.quantity, cat.categoryName, cat.superCategoryId, supercat.superName" +
            " FROM estimates est " +
            " JOIN item ON item.itemId = est.itemId" +
            " JOIN itemcost ic ON ic.itemId = est.itemId and est.trailerId = ic.trailerId" +
            " JOIN category cat ON cat.categoryId = item.categoryId" +
            " JOIN supercategory supercat ON supercat.superId = cat.superCategoryId" +
            " WHERE estimateId = ?" +
            " ORDER BY cat.rank ASC;";
    db.query(getEstimateAsConfiguredQuery, [estimateId], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "Error Retriving current configuration", "error": err});
            return;
        }
        var getSpecialRequestsQuery = "SELECT id,description,cost,estimateId,quantity from specialrequests where estimateid = ?";
          db.query(getSpecialRequestsQuery, [estimateId], function (error, resul) {
            var estimateBySuperCategory = new Map();
            result.forEach(function(category){
              if(estimateBySuperCategory[category.superCategoryId]) {
                estimateBySuperCategory[category.superCategoryId].push(category);
              } else {
                estimateBySuperCategory[category.superCategoryId] = [category];
              }
            });
            response.json({"data": estimateBySuperCategory, "specialRequests":resul});
          });

    });


});


function transformEverything(data) {

    var toReturn = [];
    var currentItem = 0;
    for (var superId = 1; superId <= 20; ++superId) {

        if (data[currentItem] === undefined)
        {
            continue;
        }

        var currentSuper = {};
        currentSuper.id = data[currentItem].superId;
        currentSuper.name = data[currentItem].superName;
        currentSuper.categories = [];
        while (currentItem < data.length && data[currentItem].superId == superId) {

            var category = {
                id: data[currentItem].categoryId,
                name: data[currentItem].categoryName,
                rank:data[currentItem].categoryRank,
                foundSelected: false,
                standardId: -1,
                optional: true,
                items: []
            };
            var foundId = 0;
            var currentCategory = data[currentItem].categoryId;
            while (currentItem < data.length && data[currentItem].categoryId === currentCategory)
            {
                var estimateId = data[currentItem].estimateId;
                var standard = data[currentItem].standard;
                var standardQuantity = data[currentItem].standardQuantity;
                var cur = data[currentItem];
                if (standard === "true") {
                    category.optional = false;
                }
                else if (standardQuantity === -1) {
                    category.optional = true;
                }
                if (estimateId) {
                    category.foundSelected = true;
                    cur.selected = "true";
                    foundId = category.items.length;
                }
                else if (standard === "true" && !category.foundSelected) {
                    cur.selected = "true";
                    category.standardId = category.items.length;
                }
                else {
                    cur.selected = "false";
                }
                category.items.push(cur);
                currentItem++;
            }
            if (category.standardId !== -1 && category.foundSelected) {
                category.items[category.standardId].selected = "false";
                category.standardId = foundId;
            }
            else if (category.standardId === -1) {
                category.standardId = foundId;
            }
            currentSuper.categories.push(category);
        }
        if (currentSuper.categories.length > 0) {
            toReturn.push(currentSuper);
        }
    }
    return toReturn;
}

app.get('/estimate/configuration/:id', auth, function (request, response, next) {
    var query = "SELECT dat.superId, dat.superName,dat.categoryId,dat.categoryName,dat.itemName,dat.itemId,dat.itemDescription,dat.itemCost, dat.lengthAdded, dat.standard,dat.trailerId,dat.isMultiSelect,dat.maxQuantity,dat.standardQuantity,est.estimateId, est.quantity,dat.itemRank,dat.categoryRank  " +
                " FROM (  " +
                "	SELECT scat.superId, scat.superName,cat.categoryId,cat.categoryName,cat.isMultiSelect,item.itemName,item.itemId,item.itemDescription,CASE WHEN icost.itemCost is null THEN item.defaultPrice else icost.itemCost end as itemCost,icost.standard,icost.trailerId,icost.standardQuantity,icost.maxQuantity,cat.rank categoryRank, item.rank itemRank, item.lengthAdded lengthAdded  " +
                "	FROM supercategory scat, category cat, item, itemcost icost  " +
                "	WHERE scat.superId = cat.superCategoryId   " +
                "		AND item.categoryId = cat.categoryId  " +
                "		AND icost.itemId = item.itemId  " +
                "		AND icost.trailerId = (SELECT trailerId FROM dealerestimate where estimateId = ?)) dat  " +
                " LEFT JOIN estimates est ON dat.itemId = est.itemId AND est.estimateId = ? " +
                " ORDER BY superId,categoryId,dat.itemId ";
    var params = [request.params.id, request.params.id];
    if (request.params.id < 0) {
        request.params.id *= -1;
        query =     "SELECT dat.superId, dat.superName,dat.categoryId,dat.categoryName,dat.itemName,dat.itemId,dat.itemDescription,dat.itemCost,dat.standard,dat.trailerId,dat.isMultiSelect,dat.maxQuantity,dat.standardQuantity,dat.categoryRank,dat.itemRank " +
                    "   FROM (  " +
                    " SELECT scat.superId, scat.superName,cat.categoryId,cat.categoryName,cat.isMultiSelect,item.itemName,item.itemId,item.itemDescription,CASE WHEN icost.itemCost is null THEN item.defaultPrice else icost.itemCost end as itemCost,icost.standard,icost.trailerId,icost.maxQuantity,item.rank itemRank,icost.standardQuantity,cat.rank categoryRank  " +
                    " FROM supercategory scat, category cat, item, itemcost icost  " +
                    " WHERE scat.superId = cat.superCategoryId   " +
                    "	AND item.categoryId = cat.categoryId  " +
                    "	AND icost.itemId = item.itemId  " +
                    "	AND icost.trailerId = ?) dat  " +
                    " ORDER BY superId,categoryId,dat.itemId ";
        params = [request.params.id];
    }

    db.query(query, params, function (err, result) {
        if (err) {
            response.statusCode = 500;
            console.log(err);
            response.json({'result': 'failure', 'message': "", "error": err});
            return;
        }
        else {
            var estimate = transformEverything(result);
            var getSpecialRequestsQuery = "SELECT id,description,cost,estimateId,quantity from specialrequests where estimateid = ?";
            db.query(getSpecialRequestsQuery, params[0], function (error, resul) {
                if(error) {
                  response.statusCode = 500;
                  console.log(error);
                  response.json({'result': 'failure', 'message': "", "error": error});
                }
                var specialRequests = resul;
                if(resul===null || resul===undefined){
                    specialRequests=[];
                }
                response.json({'specialRequests':specialRequests , "data": estimate});
            });
        }
    });
});


function isValid(val) {
    if ((typeof val === 'undefined') || val === null) {
        return false;
    }
    return true;
}

app.post('/estimate/configuration', auth, function (request, response, next) {
    // var items = getItemsArray(request.body.configuration);
    var items = request.body.selectedItems;
    var estimateId = request.body.estimateId;
    var dealerId = request.session.user.dealerId;
    var specialRequests = request.body.specialRequests;
    var configuredCost = request.body.configuredCost;
    var params = [];
    var trailerId = items[0].trailerId;
    //build orderItems array

    params = items.map(function(item){
      if (item.quantity == 0) {
        item.quantity = 1;
      }
      return [trailerId, item.itemId, estimateId, item.quantity]
    });

    // for (var i = 0; i < items.length; i++) {
    //     var item = items[i];
    //     if (isValid(item.quantity) && item.quantity > 0) {
    //         params.push([trailerId, item.itemId, estimateId, item.quantity]);
    //     }
    //     else if (item.selected === true) {
    //       params.push([trailerId, item.itemId, estimateId, 1]);
    //     } else {
    //       console.log(item.quantity || "Q!", item.selected || "S!", item.categoryName || "N!", "not added");
    //     }
    // }
    var requests = specialRequests;
    var srParams = [];
    if (isValid(requests)) {
        for (i = 0; i < requests.length; i++) {
            var r = requests[i];
            var cost = r.cost;
            srParams.push([estimateId, r.description, cost, 1]);
        }
    }

    if (srParams.length) {
      var updateSpecialRequestsQuery = "DELETE FROM specialrequests where estimateId = ?;" +
              "INSERT INTO specialrequests (estimateId,description,cost,quantity) values ?;";
      db.query(updateSpecialRequestsQuery, [estimateId, srParams], function (err, result) {
        if (err) {
          console.log(err);
          response.statusCode = 500;
          response.json({'result': 'failure', 'message': "Special Requests Failed to save", "error": err});
        }
      });
    }
    var addToEstimateQuery = "UPDATE dealerestimate set valid = 'true', status='Ready to Order', specialrequests = NULL, configuredCost = ? WHERE dealerId = ? AND estimateId = ?;" +
            "DELETE FROM estimates WHERE estimateId = ?; " +
            "INSERT INTO estimates(trailerId, itemId, estimateId, quantity) VALUES ?;";
    db.query(addToEstimateQuery, [configuredCost || NULL, dealerId, estimateId, estimateId, params], function (err, result) {
        if (err) {
          console.log(err);
            response.statusCode = 500;
            response.json({'result': 'failure', 'message': "", "error": err});
        }
        else {
          var updateStatusQuery = "UPDATE dealerestimate SET status = ? where estimateId = ?;";
          db.query(updateStatusQuery, ["Ready to Order", estimateId], function(err, result) {
            if (err) {
              response.statusCode = 500;
              response.json({'result': 'failure', 'message': "Error updating estimate status", "error": err});
            } else {
              response.json({'result': 'success', "message": "successfully saved configuration"});
            }
          });
        }
    });
});
};
