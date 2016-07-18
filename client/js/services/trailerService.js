lcServices.factory('TrailerService',['$http', 'ErrorService',
  function($http, ErrorService) {
    var trailers = {};

    trailers.save = function(trailer,onSuccess){
      $http.post('/trailer',trailer)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.delete = function(id,onSuccess){
      $http.delete('/trailer/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.update = function(id,params,onSuccess){
      $http.put('/trailer/'+id,params)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.setPublic = function(id,onSuccess){
      $http.put('/trailer/public/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.setPrivate = function(id,onSuccess){
      $http.put('/trailer/onhold/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.getAll = function(onSuccess){
      $http.get('/trailer')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.getById = function(id,onSuccess){
      $http.get('/trailer/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.getPublic = function(onSuccess){
      $http.get('/trailer/public')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.deleteConfiguration = function(id,onSuccess){
      $http.delete('/trailer/configuration/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    }
    
    return trailers;
  }]);
