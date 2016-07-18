lcServices.factory('OrderService', ['$http', 'ErrorService',
  function($http, ErrorService) {
    var order = {};

    order.addEstimateConfiguration = function (estimate, onSuccess) {
      $http.post('/order/', trailer)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    order.getOrders = function (onSuccess) {
      $http.get('/history/dealer')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    order.getAllOrders = function(onSuccess){
      $http.get('/history/all')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    order.getOrderConfiguration = function(orderId,onSuccess){
      $http.get('/history/configuration/'+orderId)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };
    
    return order;
}]);
