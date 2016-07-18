lcControllers.controller('signinCtrl', ['$scope', '$rootScope', '$window', 'SigninService',
 function ($scope, $rootScope, $window, SigninService) {
     console.log("signin controller execute");
     $rootScope.showHeader = false;
     $scope.login = function (user) {

         var result = SigninService.post({
             "username": user.username,
             "password": user.password
         })
           .$promise.then(function (result) {
               console.log(result)
               if (result.result == 'success') {

                   if (result.type == 'admin') {
                       $window.location.href = '#/admin/trailers';
                   } else {
                       $rootScope.dealerName = result.dealerName;
                       $window.location.href = '#/dealer/estimates';
                   }
               } else {
                   $scope.error = true;
               }
           });
     };
     $scope.showNavBar = false;
 }
]);
