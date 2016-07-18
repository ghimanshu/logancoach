lcServices.factory('EstimateService',['$http', 'ErrorService',
  function($http, ErrorService){
    var estimate = {};

    estimate.saveOrder = function(order,onSuccess){
      $http.post('/order/',order)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.saveConfiguration = function(order,onSuccess){
      $http.post('/order/configuration/',order)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.getEstimates = function(onSuccess){
      $http.get('/estimate/')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.getEstimateStatuses = function(onSuccess){
      $http.get('/order/status')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.saveEstimate = function(estimate,onSuccess){
      $http.post('/estimate',estimate)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.updateEstimate = function(id,estimate,onSuccess){
      $http.put('/estimate/'+id,estimate)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.updateEstimateStatus = function(id,status,onSuccess){
      $http.put('/order/status/'+id,{status:status})
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.deleteEstimate = function(id,onSuccess){
      $http.delete('/estimate/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.addConfiguration = function(config,onSuccess){
      $http.post('/estimate/configuration',config)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.getConfiguration = function(id,onSuccess){
      $http.get('/estimate/configuration/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.submitOrder = function(order,onSuccess){
      $http.post('/submit/order/',order)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.getAsConfigured = function (id, onSuccess){
      $http.get('/estimate/asConfigured/'+id)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    estimate.getExclusions = function(id,onSuccess){
      $http.get('/exclusions/'+id)
      .success(function(data,status,headers,config){onSuccess(data)})
      .error(ErrorService.handle);
    };
    // estimate.update = function(id,params,onSuccess){
    //   $http.put('/trailer/'+id,params)
    // .success(function(data,status,headers,config){ onSuccess({"data":data,"status":status,"headers":headers,"config":config});
    //   })
    // .error(function(data,status,headers,config){
    //     handleServiceError($window,$modal,{"data":data,"status":status,"headers":headers,"config":config});
    //   });
    // };
    return estimate;
  }]);
