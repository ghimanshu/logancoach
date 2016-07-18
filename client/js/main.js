var lcApp = angular.module('lcApp', [
  'ngRoute',
  'ngAnimate',
  'lcControllers',
  'lcServices',
  'ui.bootstrap',
  'ui.sortable',
  'ui.bootstrap.popover'
]);

var lcServices = angular.module('lcServices', ['ngResource']);

var lcControllers = angular.module('lcControllers', []);

function adminScopeInit($scope) {
    $scope.navTemplate = { name: 'navbar.html', url: '/partials/navbar.html' };
    $scope.admin = true;
}

function dealerScopeInit($scope) {
    $scope.navTemplate = { name: 'navbar.html', url: '/partials/navbar.html' };
    $scope.admin = false;
}


lcControllers.filter('range', function () {
    return function (input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i = min; i <= max; i++)
            input.push(i);
        return input;
    };
});

lcControllers.filter('LQCategoryfilter', function () {
    return function (input, isLQ) {
        var trailertypestring = !isLQ ? " - Living Quarter" : " - Standard Using Trailers";
        output = [];
        input.forEach(function (category) {
            if (category.name.indexOf(trailertypestring) > 0) {
                //do nothing (don't add to output)
            } else {
                output.push(category);
            }
        });
        return output;
    };
});

lcApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
        .when('/login', {
            templateUrl: '/partials/signin.html',
            controller: 'signinCtrl'
        })
        .when('/', {
            templateUrl: '/partials/signin.html',
            controller: 'signinCtrl'
        })
        .when('/admin/users', {
            templateUrl: '/partials/admin/users.html',
            controller: 'userCtrl'
        })
        .when('/admin/trailers/:id', {
            templateUrl: '/partials/admin/trailers.html',
            controller: 'trailerCtrl'
        })
        .when('/admin/trailers', {
            templateUrl: '/partials/admin/trailers.html',
            controller: 'trailerCtrl'
        })
        .when('/admin/items', {
            templateUrl: '/partials/admin/items.html',
            controller: 'itemCtrl'
        })
        .when('/admin/orderstatus', {
            templateUrl: '/partials/admin/orderstatus.html',
            controller: 'orderstatusCtrl'
        })
        .when('/dealer/estimates', {
            templateUrl: '/partials/dealer/estimates.html',
            controller: 'estimateCtrl'
        })
        .when('/dealer/estimates/:id', {
            templateUrl: '/partials/dealer/estimates.html',
            controller: 'estimateCtrl'
        })
        .when('/dealer/history', {
            templateUrl: '/partials/dealer/history.html',
            controller: 'historyCtrl'
        })
        .when('/dealer/estimates/configure/:id', {
            templateUrl: '/partials/dealer/estimateConfig.html',
            controller: 'estimateConfigCtrl'
        })
        .when('/admin/trailers/configure/:id', {
            templateUrl: '/partials/admin/trailerConfig.html',
            controller: 'trailerConfigCtrl'
        })
        .when('/admin/trailers/view/:id', {
            templateUrl: '/partials/dealer/estimateConfig.html',
            controller: 'estimateConfigCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
  }
]);
