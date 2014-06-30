angular.module('playfully.login', [])

// .controller('LoginController',
//   function LoginController( $scope, AuthService, AUTH_EVENTS) {
// 
//   $scope.credentials = { username: '', password: '' };
// 
//   $scope.authError = null;
// 
//   $scope.login = function(credentials) {
//     $scope.authError = null;
// 
//     AuthService.login(credentials).then(function () {
//       $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
//     }, function () {
//       $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
//     });
//   };
// })

.controller('LoginModalController',
    function ($scope, $log, $rootScope, $state, $modalInstance, AuthService, AUTH_EVENTS) {

  $scope.credentials = { username: '', password: '' };
  $scope.authError = null;

  $scope.login = function(credentials) {
    $scope.authError = null;

    AuthService.login(credentials)
      .success(function(data, status, headers, config) {
        console.log(data);
        $modalInstance.close();
        $scope.authError = null;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
      })
      .error(function(data, status, headers, config) {
        $scope.authError = data.error;
        $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
      });
  };

  $scope.cancelLogin = function() {
    $modalInstance.close();
  };

});
