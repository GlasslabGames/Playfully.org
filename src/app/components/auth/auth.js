angular.module('auth', ['session', 'ipCookie'])
.factory('AuthService', function ($http, $log, ipCookie, Session, UserService, API_BASE) {

  var api = {

    login: function (credentials) {
      return $http.post(API_BASE + '/auth/login/glasslab', credentials);
    },

    logout: function () {
      return $http.post(API_BASE + '/auth/logout')
        .then(function(response) {
          ipCookie.remove('connect.sid');
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
      return $http({
        method: 'POST',
        url: API_BASE + '/auth/password-reset/send/',
        // params: {cb: new Date().getTime()},
        data: {email: emailAddress}
      });
    },

    verifyPasswordResetCode: function(hashCode) {
      return $http.get(API_BASE + '/auth/password-reset/' + hashCode + '/verify');
    }, 

    updatePassword: function(newPassword, hashCode) {
      var data = {
        password: newPassword,
        code: hashCode
      };
      return $http.post(API_BASE + '/auth/password-reset/update', data);
    }
  };

  return api;

});
