lcControllers.controller('exclusionModalCtrl', ["$scope", "$modalInstance", "ItemService",
  function($scope, $modalInstance, ItemService) {
    $scope.item = $modalInstance.item;
    if ($scope.item.exclusions === undefined || $scope.item.exclusions === null) {
      $scope.item.exclusions = [];
    }
    $scope.selectedItem = null;
    $scope.selectedCategory = null;
    $scope.removedExclusions = [];
    $scope.addedExclusions = [];

    $scope.exclusionBackup = angular.copy($scope.item.exclusions);
    ItemService.getAllItems(function onSuccess(result) {
      $scope.allItems = result;
      // console.log($scope.allItems);
    });


    $scope.save = function() {
      $modalInstance.close({removed: $scope.removedExclusions, added: $scope.addedExclusions});
    };

    $scope.cancel = function() {
      $scope.item.exclusions = $scope.exclusionBackup;
      $modalInstance.dismiss('cancel');
    };

    $scope.addExclusion = function() {
      // add logic here to prevent duplicates from being added

      if($scope.item.exclusions.filter(function(exclusion){return exclusion.itemId == $scope.selectedItem.itemId}).length == 0) {
        $scope.item.exclusions.push($scope.selectedItem);
        $scope.addedExclusions.push($scope.selectedItem);
      }
      $scope.selectedItem = null;
      $scope.selectedCategory = null;
    };

    $scope.removeExclusion = function(item) {
      var index = $scope.item.exclusions.indexOf(item);
      if (index > -1) {
        $scope.item.exclusions.splice(index, 1);
        $scope.removedExclusions.push(item);
      }
    };
  }

]);
