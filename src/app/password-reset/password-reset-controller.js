angular.module('playfully.password-reset', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('modal.passwordReset', {
      url: '/forgot-password?type',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ pageTitle: 'Forgot Password'}
    })
    .state('sdk.sdkPasswordReset', {
      url: '/forgot-password?type',
      views: {
        'main@': {
          templateUrl: 'password-reset/password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ hideWrapper: true }
    })
    .state('sdk.sdkv2PasswordReset', {
      url: '/v2/forgot-password?type',
      views: {
        'main@': {
          templateUrl: 'password-reset/v2/sdk-password-reset.html',
          controller: 'PasswordResetModalCtrl'
        }
      },
      data:{ hideWrapper: true }
    })



    .state('modal.passwordUpdate', {
      url: '/reset-password/:hashCode',
      views: {
        'modal@': {
          templateUrl: 'password-reset/password-update.html',
          controller: 'PasswordUpdateModalCtrl'
        }
      },
      resolve: {
        confirmation: function($stateParams, $log, AuthService) {
          return AuthService.verifyPasswordResetCode($stateParams.hashCode)
            .then(function(data) {
                return data;
              },
              function(data) { return data; });
        }
      }
    });
})

.controller('PasswordResetModalCtrl',
  function ($scope, $log, $rootScope, $state, $stateParams, $window, AuthService, $previousState) {
    $scope.userType = $stateParams.type;

    $scope.formInfo = {
      isSubmitting: false,
      isResetEmailSent: false,
      errors: []
    };

    $scope.goBackState = function () {
        $previousState.go();
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
      var fullUrl = $state.href($state.current.name, $state.params, {absolute: true});
      if (fullUrl.indexOf('sdk') > -1) {
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
  $scope.updateError = null;
  
  $scope.validatePassword = AuthService.validatePassword;
  $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
  $scope.passwordMinLength = AuthService.passwordMinLength;

  $scope.resetPassword = function(formInfo) {
    AuthService.updatePassword(formInfo.password, $stateParams.hashCode)
      .success(function(data, status, headers, config) {
        $scope.isPasswordUpdated = true;
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
        $scope.updateError = data.error;
      });
  };

  $scope.goToInstructorLogin = function() {
    $state.go('modal.login.instructor');
  };

});


