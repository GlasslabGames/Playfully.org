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

.directive('loginStatus', function( AuthService, Session, $modal ) {
  var directive = {
    templateUrl: 'navbar/login-status-directive/login-status-directive.html',
    restrict: 'E',
    replace: true,
    // scope: true,
    controller: function ($scope, $modal, $location, AUTH_EVENTS) {

      $scope.showLoginModal = function() {
        $scope.$emit('modal.show', {
          templateUrl: 'login/login.html',
          controller: 'LoginModalController',
          size: 'sm'
        });
      };

      $scope.showEditModal = function() {
        $scope.$emit('modal.show', {
          templateUrl: 'user/edit/edit.html',
          controller: 'EditFormModalCtrl',
          size: 'lg'
        });
      };

      $scope.broadcastLogoutEvent = function() {
        $scope.$emit(AUTH_EVENTS.logoutSuccess);
      };

      $scope.redirectToLogin = function() {
        $location.path('/login');
      };

    },
    link: function($scope, $element, $attrs, $controller) {


      $scope.showLogin = function() {
        if( $attrs.type === 'modal' ) {
          $scope.showLoginModal();
        } else {
          $scope.redirectToLogin();
        }
      };

      $scope.editProfile = function() {
        $scope.showEditModal();
      };

      $scope.logout = function() {
        AuthService.logout().then(function() {
          $scope.broadcastLogoutEvent();
        });
      };


    }
  };
  return directive;
});
