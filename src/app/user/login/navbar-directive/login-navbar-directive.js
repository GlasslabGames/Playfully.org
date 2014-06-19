/**
 * User login navbar
 *
 * @module user.login.navbar
 **/
angular.module('user.login.navbar', [])

/**
 * The login navbar directive is a reusable widget that can show login or
 * logout buttons and information about the current authenticated user.
 *
 * @class loginNavbar
 * @example <login-navbar></login-navbar>
 **/

.directive('loginNavbar', ['UserService', function( UserService ) {
  var directive = {
    templateUrl: 'user/login/navbar-directive/login-navbar-directive.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {

      /**
       * Property attaches the UserService method to the directive's scope
       *
       * @property isAuthenticated
       * @type Method
       **/
      $scope.isAuthenticated = UserService.isAuthenticated;

      /**
       * Property attaches the UserService method to the directive's scope
       *
       * @property showLogin
       * @type Method
       **/
      $scope.login = UserService.showLogin;

      /**
       * Property attaches the UserService method to the directive's scope
       *
       * @property logout
       * @type Method
       **/
      $scope.logout = UserService.logout;


      $scope.$watch(function() {
        return UserService.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}]);
