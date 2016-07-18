lcServices.factory('ItemService',['$http', 'ErrorService',
  function($http, ErrorService) {
    var items = {};

    items.getItemById = function(id,onSuccess){
      $http.get('/item/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    items.getAllItems = function(onSuccess){
      $http.get('/item/')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    items.getItemsByCategoryId = function(id,onSuccess){
      $http.get('/item/category/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    items.updateItem = function(id,item,onSuccess){
      $http.put('/item/'+id,item)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    items.deleteItem = function(id,onSuccess){
      $http.delete('/item/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    items.saveNewItem = function(item,onSuccess){
      $http.post('/item/',item)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };
    
    return items;
  }]);
