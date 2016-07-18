'use strict';

lcServices.factory('ErrorService', ['$window', '$modal',
  function($window, $modal) {
    var errorService = {}

    errorService.handle = function(data,status,headers,config) {
      if (status === 403) {
        $window.location.href = '/';
      } else {
          var modalInstance = $modal.open({
            templateUrl: 'partials/modal/errorModal.html',
            controller: 'errorModalCtrl',
            size: ""
          });
          modalInstance.error = data;
          console.log(data);
          // modalInstance.result.then(function onModalClose(newCategory){
          //   }, function onModalDismiss(){
          // });
      }
    }

    return errorService;
  }
]);

lcControllers.controller('errorModalCtrl', function($scope, $modalInstance) {
  $scope.error = $modalInstance.error;

  $scope.dismiss = function() {
    $modalInstance.dismiss();
  };
});
