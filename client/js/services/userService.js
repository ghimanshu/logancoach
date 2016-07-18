lcServices.factory('UserService', ['$http', 'ErrorService',
  function($http, ErrorService) {
    var users = {};

    users.refreshDealers = function(onSuccess) {
      $http.put('/dealers/all')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.getAllDealers = function(onSuccess) {
      $http.get('/dealers/')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.getUsersByDealer = function(dealerId, onSuccess) {
      $http.get('dealer/users/' + dealerId)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.getDealershipName = function(onSuccess) {
      $http.get('/dealershipname')
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.save = function(user, onSuccess) {
      $http.post('/user', user)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.delete = function(userid, onSuccess) {
      $http.delete('/user/'+userid)
      .success(function(data, status, headers, config) {onSuccess(data)})
      .error(ErrorService.handle);
    };

    users.update = function(user, changes, onSuccess) {
      for(change in changes) {
        $http.put('/admin/user/' + change, user)
        .success(function(data, status, headers, config) {onSuccess(data)})
        .error(ErrorService.handle);
        }
    };
    
    return users;
  }
]);
