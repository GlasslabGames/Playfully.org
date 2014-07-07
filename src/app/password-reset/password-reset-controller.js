angular.module('playfully.password-reset', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('passwordReset', {
      url: 'forgot-password',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      }
    });
})

.controller('PasswordResetModalCtrl', function ($scope, $log, $rootScope, $state, AuthService) {

  $scope.formInfo = {
    isResetEmailSent: false,
    errors: []
  };

  $scope.resetPassword = function ( formInfo ) {
    $scope.formInfo.errors = [];
    AuthService.sendPasswordResetLink(formInfo.email)
      .success(function(data, status, headers, config) {
        $log.info(data);
        $scope.formInfo.isResetEmailSent = true;
      })
      .error(function(data, status, headers, config) {
        $log.error(data); 
        $scope.formInfo.errors.push(data.error);
      });

  };
  

});
