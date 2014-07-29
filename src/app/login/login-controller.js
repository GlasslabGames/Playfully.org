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

    var authEdmodoConfig = {
      templateUrl: 'login/login-edmodo.html',
      controller: 'LoginEdmodoCtrl'
    };
    $stateProvider.state('edmodo', {
      url: '/auth/edmodo',
      onEnter: function($state, $log, ipCookie) {
        $log.info("Hey");
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
      resolve: {
        currentUser: function(UserService) {
          return UserService.currentUser();
        }
      }
    })
    .state('sdkAuthEdmodo', {
      url: '/sdk/auth/edmodo',
      parent: 'site',
      data: { authorizedRoles: ['student', 'instructor'], hideWrapper: true },
      views: { 'main@': authEdmodoConfig },
      resolve: {
        currentUser: function(UserService) {
          return UserService.currentUser();
        }
      }
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
              $window.location.search = 'action=CLOSE';
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
  function ($scope, $rootScope, $state, $window, $cookies, $log, currentUser, AUTH_EVENTS) {
    $scope.user = null;

    $scope.logInWithEdmodo = function() {
      $log.info('logInWithEdmodo');
      $window.location.href = '/auth/edmodo/login';
    };

    $scope.finishLogin = function() {
      if ($state.current.data.hideWrapper) {
        $window.location.search = 'action=CLOSE';
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, $scope.user);
      }
    };


    if (currentUser) {
      $scope.user = currentUser;
    }

    // UserService.currentUser()
    //   .then(function(user) {
    //     $log.info(user);
        // if (user !== null) {
        //   $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
        // } else {
        //   $scope.authError = 'Unable to login with Edmodo';
        // }
      // });

});

