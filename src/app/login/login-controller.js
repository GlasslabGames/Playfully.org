angular.module('playfully.login', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  var loginOptionsConfig = {
    templateUrl: 'login/login.html',
    controller: 'LoginOptionsModalCtrl'
  };
  $stateProvider.state('loginOptions', {
    url: 'login',
    parent: 'modal',
    views: { 'modal@': loginOptionsConfig },
    data:{ authorizedRoles: ['guest'] }
  })
  .state('sdkLoginOptions', {
    url: '/sdk/login',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': loginOptionsConfig },
  });


  var loginInstructorConfig = {
    templateUrl: 'login/login-instructor.html',
    controller: 'LoginCtrl'
  };
  $stateProvider.state('loginInstructor', {
    url: 'login/instructor',
    parent: 'modal',
    views: { 'modal@': loginInstructorConfig },
    data:{ authorizedRoles: ['guest'] }
  })
  .state('sdkLoginInstructor', {
    url: '/sdk/login/instructor',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': loginInstructorConfig }
  });



  var loginStudentConfig = {
    templateUrl: 'login/login-student.html',
    controller: 'LoginCtrl'
  };
  $stateProvider.state('loginStudent', {
      url: 'login/student',
      parent: 'modal',
      views: { 'modal@': loginStudentConfig },
      data:{ authorizedRoles: ['guest'] }
    })
    .state('sdkLoginStudent', {
      url: '/sdk/login/student',
      parent: 'site',
      data: { hideWrapper: true },
      views: { 'main@': loginStudentConfig },
    });

    $stateProvider.state('authEdmodo', {
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

.controller('LoginOptionsModalCtrl', function ($scope, $rootScope, $location, $window, $log, $state, THIRD_PARTY_AUTH) {
  $log.info($location.search());
  $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
  $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;

  $scope.logInWithEdmodo = function() {
    $log.info('logInWithEdmodo');
    $window.location.href = '/auth/edmodo/login';
  };

})

.controller('LoginCtrl',
  function ($scope, $rootScope, $log, $state, $window, AuthService, AUTH_EVENTS) {
    $scope.credentials = { username: '', password: '' };
    $scope.authError = null;

    $scope.login = function ( credentials ) {
      $scope.authError = null;

      AuthService.login(credentials).then(function(result) {
        if ($state.current.data.hideWrapper) {
          $window.location.search = 'action=CLOSE';
        } else {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
        }
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

