angular.module('playfully.login', [])

.controller('LoginController',
  function LoginController( $scope, AuthService, AUTH_EVENTS) {

  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.authError = null;

  $scope.login = function(credentials) {

    $scope.authError = null;

    AuthService.login(credentials).then(function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
    });
  };
})

.controller('LoginModalController',
    function LoginModalController( $scope, $log, $rootScope, $state, $modalInstance, AuthService, AUTH_EVENTS ) {

  $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.authError = null;

  $scope.login = function(credentials) {

    $scope.authError = null;

    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      $modalInstance.close();
      $scope.authError = null;
      $state.transitionTo('home');
    }, function (error) {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
    });
  };

  $scope.cancelLogin = function() {
    $modalInstance.close();
  };

});
