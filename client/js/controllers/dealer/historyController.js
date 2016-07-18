lcControllers.controller('historyCtrl', ['$scope', '$http', 'OrderService',
  function($scope, $http, OrderService) {
    dealerScopeInit($scope);
    OrderService.getOrders(function(data, status, headers, config){
      $scope.orders = data
      console.log($scope.orders);
      $scope.makeActive($scope.orders[0])
    });

    $scope.makeActive = function(order) {
      $scope.activeOrder = order
      if (!$scope.activeOrder.configuration) {
        OrderService.getOrderConfiguration(order.orderId, function(data){
          $scope.activeOrder.configuration = data;
        })
      }
    }

  }
]);
