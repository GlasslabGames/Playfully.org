angular.module('auth', ['session', 'ipCookie'])
.factory('AuthService', function ($http, $log, ipCookie, Session, UserService, API_BASE, API_OPTIONS) {

  var api = {

    login: function (credentials) {
      return $http.post(API_BASE + '/auth/login/glasslab', credentials, API_OPTIONS);
    },

    logout: function () {
      return $http.post(API_BASE + '/auth/logout', API_OPTIONS)
        .then(function(response) {
          ipCookie.remove('connect.sid');
          UserService.removeCurrentUser();
          Session.destroy();
          return true;
        });
    },

    isLoggedIn: function () {
      var timestamp = new Date().getTime();
      return $http(angular.extend({
        method: 'GET',
        url: API_BASE + '/auth/login/status',
        params: { ts: timestamp }
      }, API_OPTIONS));
    },

    isAuthenticated: function () {
      return !!Session.userId;
    },

    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      /**
       * Special case for things like login where we *only* want
       * to show it to the user if they are *not* logged in.
       * */
      if (authorizedRoles.indexOf('guest') === 0) {
        return !this.isAuthenticated();
      }
      return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
    },

    sendPasswordResetLink: function(emailAddress) {
      return $http(angular.extend({
        method: 'POST',
        url: API_BASE + '/auth/password-reset/send/',
        // params: {cb: new Date().getTime()},
        data: {email: emailAddress}
      }, API_OPTIONS));
    },

    verifyPasswordResetCode: function(hashCode) {
      return $http.get(API_BASE + '/auth/password-reset/' + hashCode + '/verify', API_OPTIONS);
    }, 

    updatePassword: function(newPassword, hashCode) {
      var data = {
        password: newPassword,
        code: hashCode
      };
      return $http.post(API_BASE + '/auth/password-reset/update', data, API_OPTIONS);
    }
  };

  return api;

});
