angular.module('user.service', ['playfully.config'])

.factory('UserService', function( $q, $http, API_BASE) {

  var service = {

    get: function(userid) {
      return $http.get(API_BASE + '/auth/user/' + userid);
    },

    update: function(data) {
      data.cb = new Date().getTime();
      $http.post(API_BASE + '/auth/user/' + data.id, data);
    },

    login: function (credentials) {
      return $http.post(API_BASE + '/auth/login/glasslab', credentials);
    },

    logout: function () {
      return $http.post(API_BASE + '/auth/logout', {});
    },

    register: function (data) {
      return $http.post(API_BASE + '/user/register', data, {
        params: {cb: new Date().getTime()}
      });
    },

    getLoginStatus: function () {
      return $http.get(API_BASE + '/auth/login/status');
    }
  };

  return service;
});

