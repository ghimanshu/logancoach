'use strict';

lcServices.factory('SigninService', ['$resource',
  function($resource) {
    var signin = $resource('login', {}, { post: { method: 'POST' } });
    return signin;
  }
]);
