lcServices.factory('TrailerConfigService',['$http', 'ErrorService',
  function($http, ErrorService) {
    var trailers = {};

    trailers.getOptions = function(id,onSuccess){
      $http.get('/everything/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    trailers.save = function(id,config,onSuccess){
      $http.put('/everything/'+id,config)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };
    
    // trailers.delete = function(id,onSuccess){
    //   $http.delete('/trailer/'+id).success(function(data,status,headers,config){
    //     onSuccess({"data":data,"status":status,"headers":headers,"config":config});
    //   }).error(function(data,status,headers,config){
    //     handleServiceError($window,$modal,{"data":data,"status":status,"headers":headers,"config":config});
    //   });
    // };
    // trailers.update = function(id,params,onSuccess){
    //   $http.put('/trailer/'+id,params).success(function(data,status,headers,config){
    //     onSuccess({"data":data,"status":status,"headers":headers,"config":config});
    //   }).error(function(data,status,headers,config){
    //     handleServiceError($window,$modal,{"data":data,"status":status,"headers":headers,"config":config});
    //   });
    // };

    return trailers;
  }]);
