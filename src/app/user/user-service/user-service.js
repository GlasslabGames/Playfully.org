angular.module('user.service', [])

.factory('UserService', function( $q, $http ) {

  var service = {

    get: function(userid) {
      return $http.get('/api/v2/auth/user/' + userid);
    },

    update: function(data) {
      data.cb = new Date().getTime();
      $http.post('/api/v2/auth/user/' + data.id, data);
    },

    login: function (credentials) {
      return $http.post('/api/v2/auth/login/glasslab', credentials);
    },

    logout: function () {
      return $http.post('/api/v2/auth/logout', {});
    },

    register: function (data) {
      return $http.post('/api/v2/user/register', data, {
        params: {cb: new Date().getTime()}
      });
    },

    getLoginStatus: function () {
      return $http.get('/api/v2/auth/login/status');
    }
  };

  return service;
});

