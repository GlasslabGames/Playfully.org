/**
 * User login navbar
 *
 * @module user.login.navbar
 **/
angular.module('user.login.navbar', ['ui.bootstrap'])

/**
 * The login navbar directive is a reusable widget that can show login or
 * logout buttons and information about the current authenticated user.
 *
 * @class loginNavbar
 * @example <login-navbar></login-navbar>
 **/

.directive('loginNavbar', ['User', function( User ) {
  var directive = {
    templateUrl: 'user/login/navbar-directive/login-navbar-directive.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $modal, $controller) {


      $scope.showLogin = function() {
        User.login({username: 'test2', password: 'test'});
      };

      /**
       * Property attaches the User method to the directive's scope
       *
       * @property isAuthenticated
       * @type Method
       **/
      $scope.isAuthenticated = User.isAuthenticated;

      /**
       * Property attaches the User method to the directive's scope
       *
       * @property showLogin
       * @type Method
       **/
      // $scope.login = User.showLogin;
      // $scope.login = User.login({username: 'tst2', password: 'test'});

      /**
       * Property attaches the User method to the directive's scope
       *
       * @property logout
       * @type Method
       **/
      $scope.logout = User.logout;


      $scope.$watch(function() {
        return User.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}]);
