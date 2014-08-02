angular.module('playfully.login', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  var loginOptionsConfig = {
    templateUrl: 'login/login.html',
    controller: 'LoginOptionsCtrl'
  };
  $stateProvider.state('loginOptions', {
    url: 'login',
    parent: 'modal',
    views: { 'modal@': loginOptionsConfig },
    data:{ authorizedRoles: ['guest'] },
    onEnter: function($state, $log, ipCookie) {
      if (ipCookie('inSDK')) {
        ipCookie.remove('inSDK');
    }
  }})
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

    var authEdmodoConfig = {
      templateUrl: 'login/login-edmodo.html',
      controller: 'LoginEdmodoCtrl'
    };
    var edmodoResolve = {
      currentUser: function(UserService) {
        return UserService.currentUser();
      },
      enrollments: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    };
    $stateProvider.state('edmodo', {
      url: '/auth/edmodo',
      onEnter: function($state, $log, ipCookie) {
        if (ipCookie('inSDK')) {
          $state.go('sdkAuthEdmodo');
        } else {
          $state.go('authEdmodo');
        }
      }
    })
    .state('authEdmodo', {
      url: '/auth/edmodo/finish',
      parent: 'modal',
      data: { authorizedRoles: ['student', 'instructor'] },
      views: { 'modal@': authEdmodoConfig },
      resolve: edmodoResolve
    })
    .state('sdkAuthEdmodo', {
      url: '/sdk/auth/edmodo',
      parent: 'site',
      data: { authorizedRoles: ['student', 'instructor'], hideWrapper: true },
      views: { 'main@': authEdmodoConfig },
      resolve: edmodoResolve
    });

    $stateProvider.state('passwordPrompt', {
      url: '/sdk/login/confirm',
      parent: 'site',
      data: { hideWrapper: true, authorizedRoles: ['all'] },
      views: {
        'main@': {
          templateUrl: 'login/password-prompt.html',
          controller: 'LoginConfirmCtrl'
        }
      },
      resolve: {
        currentUser: function(UserService) {
          return UserService.currentUser();
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
    })
    .state('sdkLogout', {
      parent: 'site',
      url: '/sdk/logout',
      onEnter: function($state, AuthService) {
        AuthService.logout().then(function() {
          $state.transitionTo('sdkLoginOptions');
        });
      }
    });
})

.controller('LoginOptionsCtrl',
  function ($scope, $rootScope, $location, $window, $log, $state, THIRD_PARTY_AUTH) {
    $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
    $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;

    $scope.logInWithEdmodo = function() {
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
          $window.location.search = 'action=SUCCESS&id='+result.data.id;
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

.controller('LoginConfirmCtrl',
  function ($scope, $rootScope, $log, $state, $window, currentUser, AuthService, AUTH_EVENTS) {
    if (!currentUser) {
      $state.transitionTo('sdkLoginOptions');
    } else {
      $scope.credentials = {
        username: currentUser.username,
        password: null
      };
    }

    $scope.login = function ( credentials ) {
      $scope.authError = null;
      AuthService.logout()
        .then(function() {
          AuthService.login(credentials).then(function(result) {
            $log.info(result);
            if ($state.current.data.hideWrapper) {
              $window.location.search = 'action=SUCCESS&id='+result.data.id;
            } else {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
            }
          }, function(result) {
            $log.error(result);
            $scope.authError = result.data.error;
            $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
          });
        });
    };
})

.controller('LoginEdmodoCtrl',
  function ($scope, $rootScope, $state, $window, $cookies, $log, currentUser, enrollments, AUTH_EVENTS, CoursesService, $timeout) {

    $scope.user = currentUser;

    // If the student is already enrolled, just finish the login
    // process. (Otherwise we will ask for a class code.
    if (currentUser.role == 'student' && enrollments.length > 0) {
      $scope.finishLogin();
    }

    $scope.logInWithEdmodo = function() {
      $log.info('logInWithEdmodo');
      $window.location.href = '/auth/edmodo/login';
    };

    $scope.verification = {
      code: null,
      errors: []
    };

    $scope.verify = function(verification) {
      $log.info(verification);
      // Need to just enroll the student
      $scope.verification.errors = [];
      CoursesService.enroll(verification.code)
        .success(function(data, status, headers, config) {
          if ($state.current.data.hideWrapper) {
            $window.location.search = 'action=SUCCESS&id='+$scope.user.id;
          } else {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, $scope.user);
          }
        })
        .error(function(data, status, headers, config) {
          $scope.verification.errors.push(data.error);
        });
    };

    $scope.finishLogin = function() {
      if ($state.current.data.hideWrapper) {
        $window.location.search = 'action=SUCCESS&id='+$scope.user.id;
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, $scope.user);
      }
    };

});

