angular.module('playfully.verify-email', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider

    .state('verifyEmail', {
      url: 'verify-email/:hashCode',
      parent: 'modal',
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
  function ($scope, $log, $rootScope, $state, $stateParams, $window, AuthService) {
        $scope.hello = function() {console.log('hello');};
        $scope.verifyEmailCode = function() {
            console.log($stateParams);
            return AuthService.verifyEmailCode($stateParams.hashCode)
                .then(function(response) {
                    var userData = response.data;
                    $scope.isVerified = (response.status < 400) ? true : false;
                    console.log($scope.isVerified);
                    return userData;
                })
                .then(null, function(err) {
                    console.err(err);
                });
        };

        $scope.closeWindow = function() {
            if ($state.current.url.indexOf('sdk') > -1) {
                $window.location.search = 'action=CLOSE';
            } else {
                $rootScope.modalInstance.close();
            }
        };
});
