function showConfirmModal($modal, message, close, dismiss) {
  var modalInstance = $modal.open({
    templateUrl: 'partials/modal/confirmModal.html',
    controller: 'confirmModalCtrl',
    size: ""
  });
  modalInstance.message = message;
  modalInstance.result.then(close, dismiss);
}


//might break if i try to minify the code
lcControllers.controller('confirmModalCtrl', function($scope, $modalInstance) {
  $scope.message = $modalInstance.message;
  $scope.dismiss = function() {
    $modalInstance.dismiss();
  };
  $scope.close = function() {
    $modalInstance.close();
  };
});
