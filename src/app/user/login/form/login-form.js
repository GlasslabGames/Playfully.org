angular.module('user.login.form', [])


/**
* This controller manages the login form.
*
* @class LoginFormCtrl
* @constructor
*/
.controller('LoginFormCtrl', function LoginFormController( $scope, UserService ) {

  /**
  * An object for the login form to store username and password values.
  * 
  * @property credentials
  * @type {Object}
  * @default {}
  */
  $scope.credentials = {};

  /**
  * A variable bound to the login form that displays when something has gone
  * wrong with authentication.
  * 
  * @property authError
  * @type string
  * @default null
  */
  $scope.authError = null;

  /**
  * Login method grabs the credentials from the $scope and calls the
  * UserService.
  *
  * @method login
  * @return {Boolean} Returns true on success
  */
  $scope.login = function() {

    $scope.authError = null;

    UserService.login($scope.credentials)
      .then(function(loggedIn) {
        console.log(loggedIn);
        if ( !loggedIn ) {
          $scope.authError = "Invalid credentials";
        }
      }, function(x) {
        // If we get here then there was a problem with the login request to
        // the server.
        $scope.authError = x;
      });
    };

  $scope.cancelLogin = function() {
    UserService.cancelLogin();
  };


});
