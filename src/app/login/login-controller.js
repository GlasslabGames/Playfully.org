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
      },
      data:{
        authorizedRoles: ['guest']
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
      },
      data:{
        authorizedRoles: ['guest']
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
      },
      data:{
        authorizedRoles: ['guest']
      }
    })
    .state('authEdmodo', {
      url: 'auth/edmodo',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login-edmodo.html',
          controller: 'LoginEdmodoCtrl'
        }
      }
    })
    .state('logout', {
      parent: 'site',
      url: '/logout',
      resolve: {
        data: function($rootScope, AuthService, AUTH_EVENTS) {
          AuthService.logout().then(function() {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
          });
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
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
    }, function(result) {
      $log.error(result);
      $scope.authError = result.data.error;
      $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
    });

  };

  
})

.controller('LoginEdmodoCtrl', function ($scope, $rootScope, $window, $log, UserService, AUTH_EVENTS) {

  $scope.logInWithEdmodo = function() {
    $log.info('logInWithEdmodo');
    $window.location.href = '/auth/edmodo/login';
  };

  UserService.currentUser()
    .then(function(user) {
      if (user !== null) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      } else {
        $scope.authError = 'Unable to login with Edmodo';
      }
    });

});

