angular.module('auth', ['session', 'ipCookie'])
.factory('AuthService', function ($http, $log, $q, ipCookie, Session, UserService, API_BASE) {

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

      isLoggedIn: function () {
          var deferred = $q.defer();
          var timestamp = new Date().getTime();
          $http({
              method: 'GET',
              url: API_BASE + '/auth/login/status',
              params: { ts: timestamp }
          }).then(function(response) {
              if (response.data.status === 'ok') {
                  deferred.resolve(response);
              } else {
                  deferred.reject(response);
              }
          }, function(err) {
              deferred.reject(err);
          });
          return deferred.promise;
      },
    isAuthenticated: function () {
      return !!Session.userId;
    },

    isLoginType: function (loginType) {
      return (Session.loginType === loginType);
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

    // check that they are isAuthenticated but not the role
    isAuthenticatedButNot: function (role) {
      if (!angular.isArray(role)) {
        role = [role];
      }
      return (this.isAuthenticated() &&
              role.indexOf(Session.userRole) === -1);
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

    verifyEmailCode: function(hashCode) {
      return $http.get(API_BASE + '/auth/register-verify/' + hashCode + '/verify');
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
