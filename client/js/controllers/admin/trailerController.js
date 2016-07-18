lcControllers.controller('trailerCtrl', ['$scope','$rootScope', '$modal', '$routeParams', '$window', 'TrailerService', 'TrailerConfigService',
  function($scope,$rootScope, $modal, $routeParams, $window, TrailerService, TrailerConfigService) {
    adminScopeInit($scope);
    $rootScope.showHeader = true;
    $scope.active = 'trailer';
      console.log("testing trailer")
    TrailerService.getAll(function (result) {
      $scope.trailers = result;
      if ($routeParams.id === undefined) {
        $scope.makeActive($scope.trailers[0]);
      }

      $scope.makeActive($scope.trailers.filter(function(val) {
        if (val.trailerId == $routeParams.id) {
          return true;
        }
        return false;
      })[0]);
    });

    $scope.makeActive = function(trailer) {
      if (!trailer) return;
      $scope.update = "Update";
      if (trailer.isPublic === "true") {
        $scope.public = "Put On Hold";
      } else {
        $scope.public = "Make Public";
      }
      $scope.activeTrailer = trailer;
    };

    $scope.deleteTrailer = function() {
      showConfirmModal($modal, "Are you Sure you want to delete " + $scope.activeTrailer.trailerName,
        function onClose() {
          TrailerService.delete($scope.activeTrailer.trailerId, function (result) {
            $scope.trailers = $scope.trailers.filter(function shouldRemove(cur) {
              return cur.trailerId !== $scope.activeTrailer.trailerId;
            });
            $scope.makeActive($scope.trailers[0]);
          });
        },
        function onDismiss() {
          // console.log("dismissed"); /*noOpp*/
        });
    };

    $scope.updateTrailer = function() {
      // console.log($scope.activeTrailer);
      TrailerService.update($scope.activeTrailer.trailerId, $scope.activeTrailer,
        function (result) {
          // console.log("success");
        });
    };

    $scope.configueTrailer = function() {
      // console.log($scope.activeTrailer.trailerId);
      $window.location.href = '#/admin/trailers/configure/' + $scope.activeTrailer.trailerId;
    };

    $scope.copyFromTrailer = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/copyTrailerModal.html',
        controller: 'copyTrailerCtrl',
        size: ""
      });

      modalInstance.trailers = $scope.trailers;

      modalInstance.result.then(
        function onModalClose(newTrailer) {
            if(newTrailer.copyFrom) {
              TrailerConfigService.getOptions(newTrailer.copyFrom.trailerId, function(res) {
                TrailerConfigService.save($scope.activeTrailer.trailerId, res.data, function (resu) {

                });
              });
            }
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    }

    $scope.togglePublic = function() {
      if ($scope.activeTrailer.isPublic === "false") {
        $scope.makePublic();
      } else {
        $scope.makePrivate();
      }
    };

    $scope.makePublic = function() {
      showConfirmModal($modal, "Are you sure you want to make " + $scope.activeTrailer.trailerName + " available to order?",
        function onClose() {
          TrailerService.setPublic($scope.activeTrailer.trailerId, function (result) {
            $scope.public = "Put On Hold";
            $scope.activeTrailer.isPublic = "true";
          });
        },
        function onDismiss() {}
      );
    };

    $scope.deleteConfiguration = function() {
      showConfirmModal($modal, "Are you sure you want to delete all configured options for " + $scope.activeTrailer.trailerName + "?",
        function onClose() {
          TrailerService.deleteConfiguration($scope.activeTrailer.trailerId, function (result) {

          });
        },
        function onDismiss() {}
      );
    };

    $scope.makePrivate = function() {
      showConfirmModal($modal, "Are you sure you want to put " + $scope.activeTrailer.trailerName + " on hold?",
        function onClose() {
          TrailerService.setPrivate($scope.activeTrailer.trailerId, function (result) {
            $scope.public = "Make Public";
            $scope.activeTrailer.isPublic = "false";
          });
        },
        function onDismiss() {}
      );
    };

    $scope.showNewTrailerModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/addTrailerModal.html',
        controller: 'addTrailerCtrl',
        size: ""
      });

      modalInstance.trailers = $scope.trailers;

      modalInstance.result.then(
        function onModalClose(newTrailer) {
          TrailerService.save(newTrailer, function (result) {
            newTrailer.trailerId = result;
            newTrailer.isPublic = "false";
            $scope.trailers.push(newTrailer);
            $scope.makeActive(newTrailer);
            if(newTrailer.copyFrom) {
              TrailerConfigService.getOptions(newTrailer.copyFrom.trailerId, function(res) {
                // console.log(result);
                TrailerConfigService.save(newTrailer.trailerId, res.data, function (resu) {

                });
              });
            }
          });
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.trailerConfigView = function() {
      $window.location.href = '#/admin/trailers/view/-' + $scope.activeTrailer.trailerId;
    };

    $scope.sortableTrailerOptions = {
      handle: '.handle',
      stop: function updateTheOrderOfTheTrailers(e, ui) {
        // console.log("stopped");
        var x = $scope.trailers.map(function(val, index) {
          if (index !== val.rank) {
            val.rank = index;
            return {
              update: true,
              value: val
            };
          } else {
            return {
              update: false
            };
          }
        }).filter(function(val) {
          return val.update;
        });
        $scope.count = 0;
        x.forEach(function(item) {
          $scope.count++;
          TrailerService.update(item.value.trailerId, item.value, function (value) {
            $scope.count--;
          });
        });
      }
    };

  }
]);

lcControllers.controller('addTrailerCtrl', function($scope, $modalInstance) {
  $scope.trailers = $modalInstance.trailers;
  $scope.save = function() {
    $modalInstance.close($scope.newTrailer);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

lcControllers.controller('copyTrailerCtrl', function($scope, $modalInstance) {
  $scope.trailers = $modalInstance.trailers;
  $scope.save = function() {
    $modalInstance.close($scope.newTrailer);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
