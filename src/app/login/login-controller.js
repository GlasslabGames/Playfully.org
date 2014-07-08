angular.module('playfully.login', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('loginOptions', {
      url: 'login',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login.html',
          controller: 'LoginOptionsModalCtrl'
        }
      }
    })
    .state('loginInstructor', {
      url: 'login/instructor',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login-instructor.html',
          controller: 'LoginModalCtrl'
        }
      }
    })
    .state('loginStudent', {
      url: 'login/student',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login-student.html',
          controller: 'LoginModalCtrl'
        }
      }
    });
})

.controller('LoginOptionsModalCtrl', function ($scope, $rootScope, $window, $log) {

  $scope.logInWithEdmodo = function() {
    $log.info('logInWithEdmodo');
    $window.location.href = '/auth/edmodo/login';
  };

})

.controller('LoginModalCtrl', function ($scope, $rootScope, $log, AuthService, AUTH_EVENTS) {
  $scope.credentials = { username: '', password: '' };
  $scope.authError = null;

  $scope.login = function ( credentials ) {
    $scope.authError = null;

    AuthService.login(credentials).then(function(result) {
      $log.info(result);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
    }, function(result) {
      $log.error(result);
      $scope.authError = result.data.error;
      $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
    });

  };

  
});

