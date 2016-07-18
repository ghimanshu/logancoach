lcControllers.controller('masterCtrl', ['$scope', '$rootScope', '$window', 'SigninService',
 function ($scope, $rootScope, $window, SigninService) {
     console.log("master controller execute");
     $rootScope.showHeader = true;
 }
]);
