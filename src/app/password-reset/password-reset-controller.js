angular.module('playfully.password-reset', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('passwordReset', {
      url: 'forgot-password?type',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ authorizedRoles: ['guest'] }
    })
    .state('sdkPasswordReset', {
      url: '/sdk/forgot-password?type',
      parent: 'site',
      views: {
        'main@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ authorizedRoles: ['guest'], hideWrapper: true }
    })



    .state('passwordUpdate', {
      url: 'reset-password/:hashCode',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-update.html',
          controller: 'PasswordUpdateModalCtrl'
        }
      },
      resolve: {
        confirmation: function($stateParams, $log, AuthService) {
          return AuthService.verifyPasswordResetCode($stateParams.hashCode)
            .then(function(data) { return data;},
              function(data) { return data; });
        }
      }
    });
})

.controller('PasswordResetModalCtrl', function ($scope, $log, $rootScope, $state, $stateParams, AuthService) {
  $scope.userType = $stateParams.type;

  $scope.formInfo = {
    isSubmitting: false,
    isResetEmailSent: false,
    errors: []
  };

  $scope.resetPassword = function ( formInfo ) {
    $scope.formInfo.isSubmitting = true;

    $scope.formInfo.errors = [];
    AuthService.sendPasswordResetLink(formInfo.email)
      .success(function(data, status, headers, config) {
        $log.info(data);
        $scope.formInfo.isResetEmailSent = true;
      })
      .error(function(data, status, headers, config) {
        $log.error(data); 
        $scope.formInfo.errors.push(data.error);
        $scope.formInfo.isSubmitting = false;
      });

  };
  

})

.controller('PasswordUpdateModalCtrl', function ($scope, $log, $rootScope, $stateParams, AuthService, confirmation) {

  $scope.confirmation = confirmation;
  $scope.isPasswordUpdated = false;
  $scope.isConfirmed = (confirmation.status < 400) ? true : false;
  $log.info(confirmation);

  $scope.resetPassword = function(formInfo) {
    AuthService.updatePassword(formInfo.password, $stateParams.hashCode)
      .success(function(data, status, headers, config) {
        $log.info(data);
        $scope.isPasswordUpdated = true;
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

});


