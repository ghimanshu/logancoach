var config = require('../config'),
        db, //= require('./database'),
        auth = require('./authenticate').authenticateAdmin;

var queries = {
    addItem: "INSERT INTO item (categoryId,itemDescription,itemName,defaultPrice,rank,lengthAdded) VALUES(?,?,?,?,?,?);",
    deleteItem: "DELETE FROM item WHERE itemId = ?;",
    updateItem: "UPDATE item SET categoryId = ?, itemDescription = ?, itemName = ?,defaultPrice=?, rank=?, lengthAdded=? WHERE itemId = ?;",
    getItemsByCategory: "SELECT it.itemId,it.categoryId,it.itemName,it.itemDescription,it.defaultPrice,cat.categoryName,cat.superCategoryId,cat.categorydescription,cat.isMultiSelect, it.rank, it.lengthAdded " +
            " FROM item it " +
            " join category cat on cat.categoryId = it.categoryId " +
            " where cat.categoryId = it.categoryId AND cat.categoryId = ? " +
            " order by rank ",
    getItemId: "SELECT *  FROM item it, category cat where cat.categoryId = it.categoryId AND  it.itemId = ?",
    getAllItems: "SELECT cat.categoryid,cat.categoryName,it.itemId,it.itemName, it.rank itemRank, cat.rank FROM category cat Left join item it on cat.categoryId = it.categoryId order by cat.categoryId",
};


module.exports = function (app, d) {
    db = d;
    app.post('/item', auth, addItem);
    app.delete('/item/:id', auth, deleteItem);
    app.put('/item/:id', auth, editItem);
    app.get('/item', auth, getAllItems);
    app.get('/item/:id', auth, getItemById);
    app.get('/item/category/:catId', auth, getItemsByCategory);
};

/****************ITEMS*******************/


function addItem(request, response, next) {
    var params = [request.body.categoryId, request.body.itemDescription, request.body.itemName, request.body.defaultPrice, request.body.rank, request.body.lengthAdded];
    db.query(queries.addItem, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({"result": "failure", "message": "unable to save part to database ", "error": err});
            return;
        }
        response.json(result.insertId);
        return;
    });
}

function deleteItem(request, response, next) {
    var params = [request.params.id, request.params.id];
    db.query(queries.deleteItem, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({"result": "failure", "message": "unable to delete item Most likely it is part of a trailer configuration. \n remove it then try again", "error": err});
            return;
        }
        response.json({'result': 'success', 'message': 'successfully deleted item'});
        return;
    });
}

function editItem(request, response, next) {
    var itemId = request.params.id;
    var b = request.body;
    if (itemId != b.itemId) {
        response.statusCode = 404;
        response.json({"result": "failure", "message": "unable to update Item the id's do not match"});
        return;
    }
    var params = [b.categoryId, b.itemDescription, b.itemName, b.defaultPrice, b.rank, b.lengthAdded, itemId];
    db.query(queries.updateItem, params, function (err, result) {
        if (err) {
            response.json({"result": "failure", "message": "unable to update Item ", "error": err});
            return;
        }
        response.json({'result': 'success', 'message': 'successfully updated item'});
        return;
    });
}


function getAllItems(request, response, next) {
    db.query(queries.getAllItems, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({"result": "failure", "message": "unable to retrieve items ", "error": err});
            return;
        }

//        var objects = {};
//        for (var i = 0; i < result.length; i++) {
//            var curObject = result[i];
//            if(objects[curObject.categoryid] === undefined){
//                objects[curObject.categoryid] = [];
//            }
//            objects[curObject.categoryid].push(curObject);
//        }
        var objects = [];
        var curCategoryId = result[0].categoryid;
        curCategory = {categoryName: result[0].categoryName,
            categoryId: result[0].categoryid,
            items: []
        };
        for (var i = 0; i < result.length; i++) {
            var curItem = result[i];
            if (curItem.categoryid === curCategoryId) {
                curCategory.items.push(curItem);
            }
            else {
                curCategoryId = curItem.categoryid;
                objects.push(curCategory);
                curCategory = {categoryName: curItem.categoryName,
                    categoryId: curItem.categoryid, rank: curItem.rank,
                    items: [curItem]
                };
            }

        }
        objects.push(curCategory);

        response.json(objects);
        return;
    });
}

function getItemById(request, response, next) {
    var params = [request.params.id];
    db.query(queries.getItemId, params, function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({"result": "failure", "message": "unable to retrieve item ", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}

function getItemsByCategory(request, response, next) {
    db.query(queries.getItemsByCategory, [request.params.catId], function (err, result) {
        if (err) {
            response.statusCode = 404;
            response.json({"result": "failure", "message": "unable to retrieve items ", "error": err});
            return;
        }
        response.json(result);
        return;
    });
}
