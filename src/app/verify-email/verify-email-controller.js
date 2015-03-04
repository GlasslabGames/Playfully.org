angular.module('playfully.verify-email', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider

    .state('modal.verifyEmail', {
      url: '/verify-email/:hashCode?:subscribe?:seatsSelected?:packageType',
      views: {
        'modal@': {
          templateUrl: 'verify-email/verify-email.html',
          controller: 'verifyModalCtrl'
        }
      },
      resolve: {
//        verification: function($stateParams, $log, AuthService) {
//          console.log('hashCode:', $stateParams.hashCode);
//          return AuthService.verifyEmailCode($stateParams.hashCode)
//            .then(function(data) { return data;},
//              function(data) { return data; });
//        }
      }
    });
})

.controller('verifyModalCtrl',
  function ($scope, $log, $rootScope, $state, $stateParams, $window, AuthService, AUTH_EVENTS) {
    $scope.errorMessage = "";
    $scope.subscribe = $stateParams.subscribe;
    $scope.seatsSelected = $stateParams.seatsSelected;
    $scope.packageType = $stateParams.packageType;

      $scope.verifyEmailCode = function () {
      return AuthService.verifyEmailCode($stateParams.hashCode)
        .then(function (response) {
          var userData = response.data;
          $scope.isVerified = (response.status < 400) ? true : false;
          if (userData.licenseStatus === "pending") {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, userData);
          }
          return userData;
        })
        .then(null, function (err) {
          if( err.data &&
              err.data.error) {
            $scope.errorMessage = err.data.error;
          } else {
            $scope.errorMessage = "There was a problem with verifying your account. Please email beta_playfully@glasslabgames.org";
          }
        });
    };

    $scope.closeWindow = function () {
      if ($state.current.url.indexOf('sdk') > -1) {
        $window.location.search = 'action=CLOSE';
      } else {
        $rootScope.modalInstance.close();
      }
    };
});
