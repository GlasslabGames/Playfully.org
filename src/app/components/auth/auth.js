angular.module('auth', ['session'])
.factory('AuthService', function ($http, $log, Session, UserService, API_BASE) {

  var api = {

    login: function (credentials) {
      return $http
        .post(API_BASE + '/auth/login/glasslab', credentials);
    },

    logout: function () {
      return $http
        .post(API_BASE + '/auth/logout')
        .then(function(response) {
          UserService.removeCurrentUser();
          Session.destroy();
          return true;
        });
    },

    isAuthenticated: function () {
      return !!Session.userId;
    },

    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };

  return api;

});
