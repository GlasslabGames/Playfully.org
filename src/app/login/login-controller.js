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
      data:{ authorizedRoles: ['guest'] }
    })
    .state('gameLoginOptions', {
      url: '/game/login',
      parent: 'site',
      data: { hideWrapper: true },
      views: {
        'main@': {
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
      },
      data:{ authorizedRoles: ['guest'] }
    })
    .state('gameLoginInstructor', {
      url: '/game/login/instructor',
      parent: 'site',
      data: { hideWrapper: true },
      views: {
        'main@': {
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
      },
      data:{ authorizedRoles: ['guest'] }
    })
    .state('gameLoginStudent', {
      url: '/game/login/student',
      parent: 'site',
      data: { hideWrapper: true },
      views: {
        'main@': {
          templateUrl: 'login/login-student.html',
          controller: 'LoginModalCtrl'
        }
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
        data: function($rootScope, $log, AuthService, AUTH_EVENTS) {
          AuthService.logout().then(function() {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
          });
        }
      }
    });
})

.controller('LoginOptionsModalCtrl', function ($scope, $rootScope, $window, $log, $state) {

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

