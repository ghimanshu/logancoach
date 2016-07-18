lcControllers.controller('orderstatusCtrl', ['$scope', 'EstimateService',
  function($scope, EstimateService) {
    adminScopeInit($scope);
    $scope.active = 'orderstatus';
    $scope.estimates = [];
    EstimateService.getEstimateStatuses(function(result){
      $scope.estimates = result;
    });
    $scope.update = function(id, status) {
      EstimateService.updateEstimateStatus(id, status, function(result){
        console.log(result);
      });
    };
}]);
