lcControllers.controller('userCtrl', ['$scope','$rootScope', '$modal', 'UserService',
  function($scope,$rootScope, $modal, UserService) {
    adminScopeInit($scope);
    $scope.active = 'user';
    $rootScope.showHeader = true;
    UserService.getAllDealers(function(result) {
      $scope.dealers = result;
      $scope.makeActive($scope.dealers[0]);
    });

    $scope.refreshDealers = function() {
      UserService.refreshDealers(function(data){
        console.log(data);
      });
    };

    $scope.makeActive = function(dealer) {
      $scope.activeDealer = dealer;
      $scope.loadUsers();
    };

    $scope.loadUsers = function() {
      UserService.getUsersByDealer($scope.activeDealer.id, function(result) {
        $scope.users = result;
      });
    };

    $scope.deleteUser = function(user) {
      if (confirm("Really delete user?")) {
        UserService.delete(user.id, function(data) {
          $scope.users.splice($scope.users.indexOf(user), 1);
        });
      }
    }

    $scope.showEditUserModal = function(user) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/editUserModal.html',
        controller: 'editUserCtrl',
        size: ""
      });
      modalInstance.heading = "Edit User";
      modalInstance.user = user;
      modalInstance.result.then(
        function onModalClose(user) {
          UserService.update(user.user, user.changes, function(data) {

          });
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.showAddUserModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/editUserModal.html',
        controller: 'editUserCtrl',
        size: ""
      });
      modalInstance.dealer = $scope.activeDealer;
      modalInstance.heading = "Add New User";
      modalInstance.result.then(
        function onModalClose(user) {
          UserService.save(user.user, function (result) {
            user.userId = result;
            user.isPublic = "false";
            $scope.users.push(user.user);
          });
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };
  }
]);

lcControllers.controller('editUserCtrl', function($scope, $modalInstance) {
  $scope.user = {
    admin: false
  };

  $scope.changes = [];
  if ($modalInstance.user) {
    $scope.user = $modalInstance.user;
    if ($scope.user.admin == "true") {
      $scope.user.admin = true
    } else {
      $scope.user.admin = false
    }
  } else {
    $scope.user.dealerId = $modalInstance.dealer.id;
  }

  $scope.heading = $modalInstance.heading;

  $scope.save = function() {
    if ($scope.user.admin == true) {
      $scope.user.admin = "true"
    } else {
      $scope.user.admin = "false"
    }
    $modalInstance.close({
      user: $scope.user,
      changes: $scope.changes
    });
  };
  $scope.needUpdate = function(changedItem) {
    $scope.changes[changedItem] = true;
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
