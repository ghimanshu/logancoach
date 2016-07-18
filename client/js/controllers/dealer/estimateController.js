'use strict';

lcControllers.controller('estimateCtrl', ['$scope', '$modal', '$window', '$routeParams', '$sce', 'EstimateService', 'TrailerService', 'UserService', '$timeout',
  function($scope, $modal, $window, $routeParams, $sce, EstimateService, TrailerService, UserService, $timeout) {
    // console.log("here");
    dealerScopeInit($scope);
    if (!$scope.dealerName) {
      UserService.getDealershipName(function(result){
        $scope.dealerName = result;
      });
    }

    $scope.detailsOpen = false;

    TrailerService.getPublic(function (result) {
      $scope.trailers = result;
    });

    $scope.popup = {
      top: "20px",
      left: "10px"
    }

    $scope.printEstimate = function(estimate) {
      $scope.makeActive(estimate)
      EstimateService.getAsConfigured(estimate.estimateId, function (result) {
        $scope.update = "Update";
        $scope.curConfig = result.data;
        $scope.specialRequests = result.specialRequests;
        $timeout(window.print);
      });
    };

    $scope.hasNonEmptyCategories = function(superCategory) {
      return superCategory.some(function(item){
        return item.itemName != "None"
      })
    }

    $scope.makeActive = function(estimate) {
      $scope.activeEstimate = estimate;
    };

    $scope.refreshEstimates = function() {
      EstimateService.getEstimates(function (result) {
        // console.log(result);
        // console.log(result);
        // console.log($scope);

        $scope.estimates = result;
        if ($routeParams.id !== null && $routeParams.id !== undefined) {
          $scope.estimates.forEach(function(estimate) {
            if (estimate.estimateId == $routeParams.id) {
              $scope.makeActive(estimate);
            }
          });
        } else {
          // console.log(result[0]);
          // $scope.makeActive(result[0]);
        }
      });
    };

    $scope.showAddEstimateModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/addEstimateModal.html',
        controller: 'addEstimateCtrl',
        size: "sm"
      });
      modalInstance.trailers = $scope.trailers;
      modalInstance.result.then(
        function onModalClose(newEstimate) {
          // console.log(newEstimate);
          EstimateService.saveEstimate(newEstimate, function (result) {
            $scope.refreshEstimates();
            $window.location.href = '#/dealer/estimates/configure/' + result;
          });
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.deleteEstimate = function() {
      showConfirmModal($modal, "Are you Sure you want to delete " + $scope.activeEstimate.name,
        function onClose() {
          EstimateService.deleteEstimate($scope.activeEstimate.estimateId, function (result) {
            $scope.refreshEstimates();
          });
        },
        function onDismiss() {
          // console.log("dismissed"); /*noOpp*/
        });
    };

    $scope.updateEstimate = function() {
      $scope.update = "Pending";
      EstimateService.updateEstimate($scope.activeEstimate.estimateId, $scope.activeEstimate,
        function (data) {
          $scope.activeEstimate = null;
          // $scope.estimateForm.$setPristine();
        });
    };

    $scope.configureEstimate = function(estimate) {
      $window.location.href = '#/dealer/estimates/configure/' + estimate.estimateId;
    };

    $scope.placeOrder = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/OrderConfirmModal.html',
        controller: 'submitOrderCtrl',
        size: "sm"
      });
      modalInstance.estimate = $scope.activeEstimate;
      modalInstance.result.then(
        function onModalClose(user) {
          console.log(user);
          var order = {
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            estimateId: $scope.activeEstimate.estimateId
          };
          EstimateService.submitOrder(order, function (data) {
            console.log(data);
          });
        },
        function onModalDismiss(val) {
          //                    console.log(val);
        });
    };

    $scope.refreshEstimates();
  }
]);

lcControllers.controller('addEstimateCtrl', function($scope, $modalInstance) {
  $scope.trailers = $modalInstance.trailers;
  $scope.save = function() {
    $scope.newEstimate.trailerId = $scope.trailer.trailerId;
    $modalInstance.close($scope.newEstimate);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});


lcControllers.controller('submitOrderCtrl', function($scope, $modalInstance) {
  $scope.estimate = $modalInstance.estimate;
  $scope.user = {};
  $scope.save = function() {
    $modalInstance.close($scope.user);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
