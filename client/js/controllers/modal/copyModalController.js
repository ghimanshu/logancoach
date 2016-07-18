lcControllers.controller('copyModalCtrl', ["$scope", "$modalInstance", "TrailerService", "CategoryService",
  function($scope, $modalInstance, TrailerService, CategoryService) {
    $scope.item = $modalInstance.item;
    $scope.category = $modalInstance.category;
    $scope.trailer = $modalInstance.trailer;

    TrailerService.getAll(function onSuccess(result) {
      $scope.trailers = result;
    });

    $scope.save = function() {
      var changedOverrides = [];


      if($scope.item) {
        $scope.overrides.forEach(function(override){
          if($scope.item.exclusions) {
            if($scope.item.exclusions.filter(function(exclusion){return exclusion.itemId == override.itemId}).length == 0) {
              $scope.item.exclusions.push(override);
              changedOverrides.push(override);
            } else {
              console.log("duplicate override found and ignored");
            }
          } else {
            changedOverrides.push(override);
            $scope.item.exclusions = [override];
          }
        });

      } else {
        $scope.overrides.forEach(function(override){
          $scope.category.items.forEach(function(item){
            if(item.itemId == override.mainId) {
              if(item.exclusions) {
                if(item.exclusions.filter(function(exclusion){return exclusion.itemId == override.itemId}).length == 0) {
                  item.exclusions.push(override);
                  changedOverrides.push(override);
                } else {
                  console.log("duplicate override found and ignored");
                }
              } else {
                changedOverrides.push(override);
                item.exclusions = [override];
              }
            }
            // if(item)
          });
        });
      }


      $modalInstance.close(changedOverrides);
    };

    $scope.cancel = function() {
      // $scope.item.exclusions = $scope.exclusionBackup;
      $modalInstance.dismiss('cancel');
    };

    $scope.updateOverrideList = function() {
      if($scope.item) {
        CategoryService.getExclusionsByItemId($scope.item.itemId, $scope.selectedTrailer.trailerId, function success(result) {
          $scope.overrides = result;
          // $scope.elements.push(category.data[0]);
        }, function failure(val) {
          console.log(val);
        });
      } else {
        CategoryService.getExclusionsByCategoryId($scope.category.id, $scope.selectedTrailer.trailerId, function success(result) {
          $scope.overrides = result;
          // $scope.elements.push(category.data[0]);
        }, function failure(val) {
          console.log(val);
        });
      }
    };
  }

]);
