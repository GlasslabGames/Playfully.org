/**
* This is the service for interacting with user methods.
*
* @module user
* @submodule user.login
* @main user
*/
angular.module('user', [
  'user.login'    
])


/**
* This is the service for interacting with user methods.
*
* @class UserService
* @constructor
*/

.factory('UserService', function( $rootScope, $q, $modal, $http, $location ) {
  var _modalInstance;

  function _redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  var service = {

    showLogin: function() {
      _modalInstance = $modal.open({
        templateUrl: 'user/login/form/login-form.html',
        controller: 'LoginFormCtrl',
        size: 'lg'
      });
    },

    cancelLogin: function() {
      _modalInstance.close();
    },

    login: function ( credentials ) {
      console.log("Logging in...");

      request = $http.post('http://localhost:8001/api/user/login', credentials);
      return request.then(function(response) {
        console.log(response);
        if (response.status < 400) {
          console.log("Good login response");
          service.currentUser = response.data;
          if ( service.currentUser ) {
            _modalInstance.close();
          }
        }
        return service.isAuthenticated();
      }, function(response) {
        console.log("Not a good response");
        console.log(response);
        return response.data.key;
      });
    },

    logout: function (redirectPath) {
      $http.post('/api/user/logout', {}).then(function(response) {
        console.log(response);
        service.currentUser = null;
        _redirect(redirectPath);
      });
    },
    

    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        console.log("isAuthenticated");
        console.log(service.currentUser);
        return $q.when(service.currentUser);
      } else {
        return $http.get('/api/user/profile', { cb: new Date().getTime() }).then( function(response) {
          console.log(response);
          service.currentUser = response.data;
          return service.currentUser;
        }, function(x) {
          console.log(x);  
          return null;
        });
      }
    },

    currentUser: null,

    isAuthenticated: function() {
      return !!service.currentUser;
    }

  };

  return service;

});
