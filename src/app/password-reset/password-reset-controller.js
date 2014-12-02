angular.module('playfully.password-reset', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('modal.passwordReset', {
      url: 'forgot-password?type',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ pageTitle: 'Forgot Password'}
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
      data:{ hideWrapper: true }
    })
    .state('sdkv2PasswordReset', {
      url: '/sdk/v2/forgot-password?type',
      parent: 'site',
      views: {
        'main@': {
          templateUrl: 'password-reset/v2/sdk-password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ hideWrapper: true }
    })



    .state('modal.passwordUpdate', {
      url: 'reset-password/:hashCode',
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

.controller('PasswordResetModalCtrl',
  function ($scope, $log, $rootScope, $state, $stateParams, $window, AuthService) {
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
          $scope.formInfo.isResetEmailSent = true;
        })
        .error(function(data, status, headers, config) {
          $log.error(data); 
          $scope.formInfo.errors.push(data.error);
          $scope.formInfo.isSubmitting = false;
        });

    };

    $scope.closeWindow = function() {
      if ($state.current.url.indexOf('sdk') > -1) {
        $window.location.search = 'action=CLOSE';
      } else {
        $rootScope.modalInstance.close();
      }
    };
})

.controller('PasswordUpdateModalCtrl', function ($scope, $log, $rootScope, $state, $stateParams, AuthService, confirmation) {

  $scope.confirmation = confirmation;
  $scope.isPasswordUpdated = false;
  $scope.isConfirmed = (confirmation.status < 400) ? true : false;

  $scope.resetPassword = function(formInfo) {
    AuthService.updatePassword(formInfo.password, $stateParams.hashCode)
      .success(function(data, status, headers, config) {
        $scope.isPasswordUpdated = true;
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.goToInstructorLogin = function() {
    $state.go('loginInstructor');
  };

});


