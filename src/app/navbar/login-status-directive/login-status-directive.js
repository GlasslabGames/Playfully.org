/**
 * User login navbar
 *
 * @module user.login.navbar
 **/
angular.module('playfully.navbar.login-status', ['ui.bootstrap'])

/**
 * The login navbar directive is a reusable widget that can show login or
 * logout buttons and information about the current authenticated user.
 *
 * @class loginNavbar
 * @example <login-navbar></login-navbar>
 **/

.directive('loginStatus', function( $state, AuthService, Session, $modal ) {
  var directive = {
    templateUrl: 'navbar/login-status-directive/login-status-directive.html',
    restrict: 'E',
    replace: true,
    // scope: true,
    controller: function ($scope, $state, $modal, $location, $log, AUTH_EVENTS) {

    },
    link: function($scope, $element, $attrs, $controller) {

      $scope.logout = function() {
        $state.transitionTo('logout');
      };


    }
  };
  return directive;
});
