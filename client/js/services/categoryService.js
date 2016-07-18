lcServices.factory('CategoryService', ['$http', 'ErrorService',
  function($http, ErrorService) {
    var cat = {};

    cat.getAllCategories = function(onSuccess) {
      $http.get('/category')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.getCategory = function(id, onSuccess) {
      $http.get('/category/' + id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.getExclusionsByCategoryId = function(categoryId, trailerId, onSuccess) {
      $http.get('/category/'+categoryId+'/exclusions/'+trailerId)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.getExclusionsByItemId = function(itemId, trailerId, onSuccess) {
      $http.get('/category/'+itemId+'/item-exclusions/'+trailerId)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.getSuperCategories = function(onSuccess) {
      $http.get('/supercategory')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.deleteCategoryById = function(id, onSuccess) {
      $http.delete('/category/' + id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.updateCategory = function(id, params, onSuccess) {
      $http.put('/category/' + id, params)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    cat.addCategory = function(params, onSuccess) {
      $http.post('/category/', params)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    return cat;
  }
]);
