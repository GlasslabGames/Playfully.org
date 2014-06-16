angular.module('user.login.navbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginNavbar', ['UserService', function( UserService ) {
  var directive = {
    templateUrl: 'user/login/navbar-directive/login-navbar-directive.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = UserService.isAuthenticated;
      $scope.login = UserService.showLogin;
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
