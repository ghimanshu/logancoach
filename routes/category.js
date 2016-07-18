var fs = require('fs'),
        config = require('../config'),
        db,
        auth = require('./authenticate').authenticateAdmin;

var queries = {
    addCategory: "INSERT INTO category (categoryName, categorydescription,superCategoryId,isMultiSelect) VALUES (?,?,?,?);",
    deleteCategory: "delete from estimates where itemId = ?;delete from itemcost where itemId = ?;delete from item where itemId =?;DELETE FROM category WHERE categoryId = ? ;",
    updateCategory: "UPDATE category SET superCategoryId = ?,categoryName = ?,categorydescription = ?,isMultiSelect=?,rank=? WHERE categoryId = ? ;",
    getCategories: 'SELECT * FROM category cat join supercategory sc on cat.superCategoryId = sc.superId ORDER BY rank;',
    getCategoryById: 'SELECT * FROM category cat, supercategory sc where cat.superCategoryId = sc.superId AND cat.categoryId = ?;',
    getCategoryCategory: 'SELECT * FROM category cat, supercategory sc where cat.superCategoryId = sc.superId AND sc.superId = ?;',
    getSuperCategory: 'SELECT * FROM supercategory;',
    getEverything3: "SELECT sc.superId,sc.superName,cat.categoryId,cat.categoryName, cat.isMultiSelect, it.itemId, it.itemName, it.itemDescription,it.defaultPrice, it.lengthAdded, ic.standard, ic.itemCost,if(ic.maxQuantity is NULL,1,ic.maxQuantity) as maxQuantity,if(ic.standardQuantity is null,0,ic.standardQuantity) as standardQuantity, cat.rank categoryRank, it.rank itemRank " +
            "FROM supercategory sc " +
            "LEFT JOIN category cat ON sc.superId = cat.superCategoryId " +
            "LEFT JOIN item it ON it.categoryId = cat.categoryId " +
            "LEFT JOIN (SELECT * FROM itemcost WHERE itemcost.trailerId = ?)  ic ON it.itemId = ic.itemId " +
            "ORDER BY sc.superId, cat.categoryName, it.itemName; ",
    getEverythingByTrailer: "SELECT dat.superId, dat.superName,dat.categoryId,dat.categoryName,dat.itemName,dat.itemId,dat.itemDescription,dat.itemCost,dat.standard,dat.trailerId,dat.isMultiSelect,dat.maxQuantity,dat.standardQuantity, dat.itemRank,dat.categoryRank " +
            "   FROM (  " +
            " SELECT scat.superId, scat.superName,cat.categoryId,cat.categoryName,cat.isMultiSelect,item.itemName,item.itemId,item.itemDescription,CASE WHEN icost.itemCost is null THEN item.defaultPrice else icost.itemCost end as itemCost,icost.standard,icost.trailerId,icost.maxQuantity,icost.standardQuantity,cat.rank categoryRank,item.rank itemRank " +
            " FROM supercategory scat, category cat, item, itemcost icost  " +
            " WHERE scat.superId = cat.superCategoryId   " +
            "	AND item.categoryId = cat.categoryId  " +
            "	AND icost.itemId = item.itemId  " +
            "	AND icost.trailerId = ?) dat  " +
            " ORDER BY superId,categoryId,dat.itemId ",
    deleteEverything: "delete from itemcost where trailerId = ? ; ",
    saveEverything: "INSERT into itemcost (trailerId,itemID,itemCost,standard) values ? ;",
    invalidateEstimates: "UPDATE dealerestimate set valid = 'false' where trailerId = ?;",
    deleteOldConfiguration: "DELETE FROM itemcost where trailerId = ?; ",
    deleteOldOverrides: "DELETE FROM excludeitem where trailerId = ?; ",
    insertNewItems: "INSERT into itemcost (trailerId,itemID,itemCost,standard,maxQuantity,standardQuantity) values ?; ",
    insertNewExclusions: "INSERT INTO excludeitem (trailerid,itemid,excluded) VALUES ? ; ",
    addEmpty: "INSERT INTO item(categoryId,itemDescription,itemName)	VALUES (?,'None','None');",
    getItems: "SELECT item.itemId, item.categoryId,item.itemName FROM item,itemcost WHERE item.itemId = itemcost.itemId AND item.categoryId = ? ;",
    deleteItemsAndCategory: "DELETE FROM item WHERE categoryId = ?; DELETE FROM category WHERE categoryId =?;",
    getExclusions: " SELECT DISTINCT a.itemId mainId ,a.excluded itemId, it.itemName itemName,cat.categoryName categoryName" +
            " FROM excludeitem a  " +
            " LEFT JOIN item it on it.itemid = a.excluded " +
            " LEFT JOIN category cat on cat.categoryid = it.categoryid " +
            " WHERE a.trailerid = 0 OR a.trailerid = ? " +
            " ORDER BY a.itemid; ",
    getExclusionsByCategoryIdAndTrailer: "SELECT a.itemId mainId, a.excluded itemId, it.itemName itemName, cat.categoryName categoryName " +
             "FROM excludeitem a " +
             "JOIN item it on it.itemid = a.excluded " +
             "JOIN item mainit on mainit.itemid = a.itemId " +
             "JOIN category cat on cat.categoryid = it.categoryid " +
             "JOIN category maincat on maincat.categoryid = mainit.categoryid " +
             "WHERE maincat.categoryId = ? and a.trailerId = ? " +
             "ORDER BY a.itemid;",
    getExclusionsByItemIdAndTrailer: "SELECT a.itemId mainId, a.excluded itemId, it.itemName itemName, cat.categoryName categoryName " +
            "FROM `excludeitem` a " +
            "JOIN item it on it.itemid = a.excluded " +
            "JOIN category cat on cat.categoryid = it.categoryId " +
            "WHERE a.itemId = ? AND a.trailerId = ?;"
};

module.exports = function (app, d) {
    db = d;
    app.post('/category', auth, addCategory);	//add a category returns the id as insertId
    app.delete('/category/:id', auth, deleteCategory);		//delete a category by id int
    app.put('/category/:id', auth, updateCategory);		//update a category by id int,string,string
    app.get('/category', auth, getCategories);			//get all categories
    app.get('/category/:id', auth, getCategoryById);			//get category by id
    app.get('/category/:categoryId/exclusions/:trailerId', auth, getExclusionsByCategoryId);			//get exclusions by category id
    app.get('/category/:itemId/item-exclusions/:trailerId', auth, getExclusionsByItemId);			//get exclusions by category id
    app.get('/category/category', auth, getcategoriesByCategory);
    app.get('/supercategory', auth, getSuperCategory);
    app.get('/everything/:id', auth, getEverything);
    app.put('/everything/:id', auth, saveEverything);
};

function sendError(request, response, error, message, connection) {
  console.log("sendError called. Things are real bad.")
    if (error) {
        connection.rollback(function () {
            connection.release();
            console.log(error);
            response.statusCode = 500;
            response.json({"result": "failure", "message": message, "error": error});
            return;
        });
    }
}

function saveEverything(request, response, next) {
    var data = reverseTransform(request.body);
    var trailerId = request.params.id;
    var exclusions = getExclusions(request.body, trailerId);
    var params = [];

    for (var i in data) {
        if (data[i].itemId && data[i].available === 'true') {
            params.push([trailerId, data[i].itemId, data[i].itemCost, data[i].standard, data[i].maxQuantity,data[i].standardQuantity]);
        }
    }

    db.getConnection(function (err, connection) {
        connection.beginTransaction(function (transactionBeginError) {
            if (transactionBeginError) {
                connection.release();
                response.statusCode = 500;
                response.json({'result': "failure", "error": transactionBeginError});
            }
            connection.query("SET FOREIGN_KEY_CHECKS=0", function(fkofferror, result){
              if (fkofferror) {
                sendError(request, response, invalidateEstimatesError, "Failed to set FOREIGN_KEY_CHECKS", connection);
              }
              else {
                connection.query(queries.invalidateEstimates, [trailerId], function (invalidateEstimatesError, resu) {
                  // console.log(queries.invalidateEstimates, [trailerId]);
                    if (invalidateEstimatesError) {
                        sendError(request, response, invalidateEstimatesError, "invalidate Estimates Error", connection);
                    }
                    else {
                        connection.query(queries.deleteOldConfiguration, [trailerId], function (deleteOldConfigurationError, resul) {
                          // console.log(queries.deleteOldConfiguration, [trailerId]);
                            if (deleteOldConfigurationError) {
                                sendError(request, response, deleteOldConfigurationError, "delete Old Configuration Error", connection);
                            } else {
                                var x = connection.query(queries.insertNewItems, [params], function (insertNewItemsError, res) {
                                  // console.log(queries.insertNewItems, params[0], "...");
                                    if (insertNewItemsError) {
                                        sendError(request, response, insertNewItemsError, "insert New Items Error: Does your trailer have items on it?", connection);
                                    } else {
                                        connection.query(queries.deleteOldOverrides,[trailerId],function(deleteOverrideError,res){
                                          // console.log(queries.deleteOldOverrides,[trailerId]);
                                          if(deleteOverrideError){
                                              sendError(request, response, deleteOverrideError, "delete Override Error", connection);
                                          } else if (exclusions.length>0) {
                                            connection.query(queries.insertNewExclusions,[exclusions],function(insertOverrideError,res){
                                              // console.log(queries.insertNewExclusions,exclusions[0], "...");
                                              if(insertOverrideError){
                                                  sendError(request, response, insertOverrideError, "insert Override Error", connection);
                                              } else {
                                                connection.query("SET FOREIGN_KEY_CHECKS=1", function(fkofferror, result){
                                                  if (fkofferror) {
                                                    sendError(request, response, invalidateEstimatesError, "Failed to reset FOREIGN_KEY_CHECKS", connection);
                                                  }
                                                  else {
                                                  connection.commit(function(connectionCommitError){
                                                    if(connectionCommitError){
                                                      throw connectionCommitError;
                                                    }
                                                    connection.release();
                                                    response.json({'result': 'success', 'message': 'successfully saved everything'});
                                                    return;
                                                  });
                                                }
                                              });
                                              }
                                            });
                                          } else {
                                            connection.query("SET FOREIGN_KEY_CHECKS=1", function(fkofferror, result){
                                              if (fkofferror) {
                                                sendError(request, response, invalidateEstimatesError, "Failed to reset FOREIGN_KEY_CHECKS", connection);
                                              }
                                              else {
                                                connection.commit(function(connectionCommitError){
                                                  if(connectionCommitError){
                                                    throw connectionCommitError;
                                                  }
                                                  connection.release();
                                                  response.json({'result': 'success', 'message': 'successfully saved everything'});
                                                  return;
                                                });
                                              }
                                            });
                                          }
                                      });
                                    }
                                });
                            }
                        });
                    }
                });
              }
            });
        });
    });
}



function addCategory(request, response, next) {
    db.query(queries.addCategory, [request.body.name, request.body.description || "", request.body.superId, request.body.isMultiSelect], function (err, result) {
        if (err) {
            console.log(err);
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable to save category to database ", "error": err});
            return;
        }
        response.json({'insertId': result.insertId});
        return;
    });
}


function updateCategory(request, response, next) {
    var id = request.params.id;
    var b = request.body;
    var params = [b.superId, b.categoryName, b.categoryDescription, b.isMultiSelect,b.rank, id];
    db.query(queries.updateCategory, params, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable update category", "error": err});
            return;
        }
        response.json({'result': 'success', 'message': 'successfully updated category'});
        return;
    });
}

function deleteCategory(request, response, next) {
    var categoryId = request.params.id;
    db.query(queries.getItems, [categoryId], function (err, items) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable delete category", "error": err});
        }

        if ((items.length === 1 && items[0].itemName === 'None'))
        {

            var itemId = items[0].itemId;
            db.query(queries.deleteCategory, [itemId, itemId, itemId, categoryId], function (err, result) {
                if (err) {
                    response.statusCode = 500;
                    response.json({"result": "failure", "message": "unable delete category", "error": err});
                }
                response.json({'result': 'success', 'message': 'successfully deleted category'});
                return;
            });
        }
        else if (items.length === 0) {
            db.query(queries.deleteItemsAndCategory, [categoryId, categoryId], function (err, result) {
                if (err) {
                    response.statusCode = 500;
                    response.json({"result": "failure", "message": "unable delete category", "error": err});
                }
                response.json({'result': 'success', 'message': 'successfully deleted category'});
                return;
            });

        }
        else
        {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable delete category delete all items associated with this category then try again"});
            return;
        }
    });
}

function getCategories(request, response, next) {
    db.query(queries.getCategories, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "retrieve categories ", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getCategoryById(request, response, next) {
    db.query(queries.getCategoryById, [request.params.id], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable retrieve category", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getcategoriesByCategory(request, response, next) {
    db.query(queries.getCategoryCategory, [request.query.id], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable get category", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getExclusionsByCategoryId(request, response, next) {
    db.query(queries.getExclusionsByCategoryIdAndTrailer, [request.params.categoryId, request.params.trailerId], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable get category", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}
function getExclusionsByItemId(request, response, next) {
    db.query(queries.getExclusionsByItemIdAndTrailer, [request.params.itemId, request.params.trailerId], function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable get category", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getSuperCategory(request, response, next) {
    db.query(queries.getSuperCategory, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable get super Categories", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getEverything(request, response, next) {
    var query = queries.getEverything3;
    var params = [request.params.id];
    if (request.params.id < 0) {
        request.params.id *= -1;
        query = queries.getEverythingByTrailer;
        params = [request.params.id];
    }

    db.query(query, params, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.json({"result": "failure", "message": "unable to get everything", "error": err});
            return;
        }
        var items = transformEverything(result);
        db.query(queries.getExclusions, params, function (err, res) {
            if (err) {
                console.log(err);
            }
            var exclusions = {};
            for (var i = 0; i < res.length; ++i) {
                var curId = res[i].mainId;
                if (isNullOrUndefined(exclusions[curId])) {
                    exclusions[curId] = [];
                }
                exclusions[ curId].push(res[i]);
            }

            for (var outer = 0; outer < items.length; ++outer) {
                var dat = items[outer];
                for (var i = 0; i < dat.categories.length; ++i) {
                    var cur = dat.categories[i];
                    for (var j = 0; j < cur.items.length; j++) {
                        if (!isNullOrUndefined(exclusions[cur.items[j].itemId])) {
                            cur.items[j].exclusions = exclusions[cur.items[j].itemId];
                        }
                    }
                }
            }

            response.json(items);
            return;
        });
    });

}

function isNullOrUndefined(val) {
    return val === undefined || val === null;
}

function transformEverything(data) {
    var toReturn = [];
    var currentItem = 0;
    //data = convertTrueFalse(data);

    for (var superId = 1; superId <= 20; ++superId) {

        if (data[currentItem] === undefined)
        {
            continue;
        }

        var currentSuper = {};
        currentSuper.id = data[currentItem].superId;
        currentSuper.name = data[currentItem].superName;
        currentSuper.categories = [];

        while (currentItem < data.length && data[currentItem].superId === superId) {

            var category = {
                id: data[currentItem].categoryId,
                name: data[currentItem].categoryName,
                optional: true,
                rank:data[currentItem].categoryRank,
                items: []
            };

            var currentCategory = data[currentItem].categoryId;

            if (currentCategory === null) {
                currentItem++;
                continue;
            }

            while (currentItem < data.length && data[currentItem].categoryId === currentCategory)
            {
                var temp = data[currentItem].standard;

                if (temp) {
                    data[currentItem].available = "true";
                    if (temp === "false") {
                        data[currentItem].standard = "false";
                    }
                    else {
                        data[currentItem].standard = "true";
                        category.optional = false;
                        category.standardItemId = data[currentItem].itemId;
                    }
                }
                else {
                    data[currentItem].available = "false";
                    data[currentItem].standard = "false";
                }

                category.items.push(data[currentItem]);

                currentItem++;
            }
            currentSuper.categories.push(category);
        }
        toReturn.push(currentSuper);
    }
    return toReturn;
}

function convertTrueFalse(data) {
    data.forEach(function blah(obj) {
        for (var prop in obj) {
            // console.log(prop +":" + obj[prop]);
            if (obj[prop] === "true") {
                obj[prop] = true;
//                console.log('changing ' + prop);
            }
            else if (obj[prop] === "false") {
                obj[prop] = false;
//                console.log('changing ' + prop);
            }
        }
    });
    return data;
}

function reverseTransform(data) {
    var toReturn = [];
    for (var outer = 0; outer < data.length; ++outer) {
        var dat = data[outer];
        for (var i = 0; i < dat.categories.length; ++i) {
            var cur = dat.categories[i];
            for (var j = 0; j < cur.items.length; j++) {
                toReturn.push(cur.items[j]);
            }
        }
    }
    return toReturn;
}

function getExclusions(data, trailerId) {
    var toReturn = [];
    data.forEach(function(supercategory){
      supercategory.categories.forEach(function(category){
        category.items.forEach(function(item){
          if (item.exclusions) {
            item.exclusions.forEach(function(override){
              toReturn.push([trailerId, item.itemId, override.itemId]);
            });
          }
        });
      });
    });
    return toReturn;
}
