angular.module('userOld', [
  'ui.router',
  'user.service',
  'user.navbar',
  'user.edit'
])
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSucces: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginFormCtrl',
        templateUrl: 'user/login/form/login-form.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})


.factory('User', function($q, $http, $location, $log, UserService ) {

  var service = {

    currentUser: null,

    isAuthenticated: function() {
      return !!service.currentUser;
    },

    update: function(data) {
      return UserService.update(data)
        .then(function(result) {
          $log.info(result);
        }, function(result) {
          $log.error(result);
        });
    },

    login: function(credentials) {
      return UserService.login(credentials)
        .then(function(result) {
          service.currentUser = result.data;
          return result.data;
        }, function(result) {
          service.currentUser = null;
          return result.data;
        });
    },

    logout: function() {
      UserService.logout()
        .then(function(response) {
          service.currentUser = null;
          return true;
        }, function(response) {
          $log.info(response);
          return false;
        });
    },

    requestCurrentUser: function () {
      if (service.currentUser) {
        return $q.when(service.currentUser);
      } else {
        return UserService.getCurrentUser()
          .then(function(result) {
            service.currentUser = result.data;
            $log.info(service.currentUser);
          }, function(response) {
            service.currentUser = null;
          });
      }
    }
  };

  return service;

});
