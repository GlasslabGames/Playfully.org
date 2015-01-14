angular.module('playfully.login', [])

.config(function config( $stateProvider, $stickyStateProvider, $urlRouterProvider ) {

  // Login Options

  $stateProvider.state('modal.login', {
    url: '/login',
    data:{ pageTitle: 'Sign In'},
    views: {
      'modal@': {
        templateUrl: 'login/login.html',
        controller: 'LoginOptionsCtrl'
      }
    }
  })

  .state('sdk.sdkLoginOptions', {
    url: '/login',
    parent: 'sdk',
    data: { hideWrapper: true },
    views: { 'main@': {
      templateUrl: 'login/v1/sdk-login.html',
      controller: 'sdkLoginCtrl'
      }
    }
  });

  // Instructor Login
  var loginInstructorConfig = {
    templateUrl: 'login/login-instructor.html',
    controller: 'LoginCtrl'
  };
  $stateProvider.state('modal.login.instructor', {
    url: '/instructor',
    views: { 'modal@': loginInstructorConfig },
    data:{ pageTitle: 'Instructor Sign In'}
  });

  // Student Login
  var loginStudentConfig = {
    templateUrl: 'login/login-student.html',
    controller: 'LoginCtrl'
  };
  $stateProvider.state('modal.login.student', {
    url: '/student',
    views: { 'modal@': loginStudentConfig },
    data:{ pageTitle: 'Student Sign In'}
  })
  .state('sdk.sdkLoginStudent', {
    url: '/login/student',
    data: { hideWrapper: true },
    views: { 'main@': loginStudentConfig }
  });

  // Developer Login
  var loginDeveloperConfig = {
    templateUrl: 'login/login-developer.html',
    controller: 'LoginCtrl'
  };
  $stateProvider.state('modal.login.developer', {
    url: '/developer',
    views: { 'modal@': loginDeveloperConfig },
    data:{ pageTitle: 'Developer Sign In'}
  });

  // Edomodo Login
  var authEdmodoConfig = {
    templateUrl: 'login/login-edmodo.html',
    controller: 'LoginEdmodoCtrl'
  };

  $stateProvider.state('edmodo', {
    url: '/auth/edmodo',
    onEnter: function($state, $log, ipCookie) {
      if (ipCookie('inSDK')) {
        $state.go('sdk.sdkAuthEdmodo');
      } else {
        $state.go('authEdmodo');
      }
    }
  })
  .state('authEdmodo', {
    url: '/auth/edmodo/finish',
    parent: 'modal',
    data: { authorizedRoles: ['student','instructor','developer','admin'] },
    views: { 'modal@': authEdmodoConfig },
    resolve: {
      currentUser: function(UserService) {
        return UserService.currentUser();
      },
      enrollments: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })
  .state('sdk.sdkAuthEdmodo', {
    url: '/auth/edmodo',
    data: { authorizedRoles: ['student','instructor','developer','admin'], hideWrapper: true },
    views: { 'main@': authEdmodoConfig },
    resolve:  {
      currentUser: function(UserService) {
        return UserService.currentUser();
      },
      enrollments: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  });

  // Password Prompt
  $stateProvider.state('sdk.sdkPasswordPrompt', {
    url: '/login/confirm',
    data: { hideWrapper: true, authorizedRoles: ['student', 'instructor','admin'] },
    views: {
      'main@': {
        templateUrl: 'login/v1/sdk-password-prompt.html',
        controller: 'sdkLoginConfirmCtrl'
      }
    },
    resolve: {
      currentUser: function(UserService) {
        return UserService.currentUser();
      }
    }
  })

  // Login Success
  .state('sdk.sdkLoginSuccess', {
    url: '/login/success',
    data: { hideWrapper: true, authorizedRoles: ['student','instructor','admin'] },
    views: {
      'main@': {
        templateUrl: 'login/v1/sdk-login-success.html',
        controller: function($scope, $window, $log, courses) {
          $scope.courses = courses;
          $scope.closeWindow = function() {
            $window.location.search = 'action=SUCCESS';
          };
        }
      }
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })

  // Reset Login Data
  .state('sdk.sdkLoginResetData', {
    url: '/login/resetdata',
    data: { hideWrapper: true, authorizedRoles: ['student', 'instructor','admin'] },
    views: {
      'main@': {
        templateUrl: 'login/v1/sdk-resetdata-prompt.html',
        controller: 'sdkLoginConfirmCtrl'
      }
    },
    resolve: {
      currentUser: function(UserService) {
        return UserService.currentUser();
      }
    }
  })

  // Logout
  .state('root.logout', {
    url: '/logout',
    resolve: {
      data: function($rootScope, $log, AuthService, AUTH_EVENTS) {
        AuthService.logout().then(function(response) {
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        }, function(response) {
          $log.error(response);
        });
      }
    }
  })
  .state('sdk.sdkLogout', {
    url: '/logout',
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
    $scope.logInWithIcivics= function() {
      $window.location.href = '/auth/icivics/login';
    };
})
.controller('LoginCtrl',
  function ($scope, $rootScope, $log, $state, $window, AuthService, AUTH_EVENTS) {
    $scope.credentials = { username: '', password: '' };
    $scope.authError = null;

    $scope.login = function ( credentials ) {
      $scope.loginForm.isSubmitting = true;
      $scope.authError = null;
      AuthService.login(credentials)
          .then(function(result) {
            $scope.loginForm.isSubmitting = false;
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
          }, function(result) {
            $log.error(result);
            $scope.loginForm.isSubmitting = false;
            $scope.authError = result.data.error;
            $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
          });

  };
})
.controller('sdkLoginCtrl',
  function ($scope, $rootScope, $log, $window, $state, AuthService, AUTH_EVENTS, THIRD_PARTY_AUTH) {

    $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
    $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;
    $scope.credentials = { username: '', password: '' };
    $scope.authError = null;

    $scope.login = function ( credentials ) {
      $scope.authError = null;
      $scope.studentLoginForm.isSubmitting = true;

      AuthService.login(credentials).then(function(result) {
        $scope.studentLoginForm.isSubmitting = false;

        $state.go('sdk.sdkLoginSuccess');

      }, function(result) {
        $log.error(result);
        $scope.studentLoginForm.isSubmitting = false;
        $scope.authError = result.data.error;
        $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
      });

  };

    $scope.logInWithEdmodo = function() {
      $window.location.href = '/auth/edmodo/login';
    };
})
.controller('sdkLoginConfirmCtrl',
  function ($scope, $rootScope, $log, $state, $window, currentUser, AuthService, AUTH_EVENTS) {
    if (!currentUser) {
      $state.transitionTo('sdk.sdkLoginOptions');
    } else {
      $scope.credentials = {
        username: currentUser.username,
        password: null
      };
    }

    $scope.login = function ( credentials ) {
      $scope.authError = null;
      AuthService.login(credentials).then(function(result) {
        if ($state.current.data.hideWrapper) {
          $window.location.search = 'action=SUCCESS';
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
.controller('LoginEdmodoCtrl',
  function ($scope, $rootScope, $state, $window, $log, currentUser, enrollments, AUTH_EVENTS, CoursesService, $timeout) {

    $scope.user = currentUser;

    $scope.finishLogin = function() {
      if ($state.current.data.hideWrapper) {
        $window.location.search = 'action=SUCCESS';
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, $scope.user);
      }
    };

    // If the student is already enrolled, just finish the login
    // process. (Otherwise we will ask for a Class Code.)
    if (currentUser.role == 'student' && enrollments.length > 0) {
      $scope.finishLogin();
    }

    $scope.logInWithEdmodo = function() {
      $window.location.href = '/auth/edmodo/login';
    };

    $scope.verification = {
      code: null,
      errors: []
    };

    $scope.verify = function(verification) {
      // Need to just enroll the student
      $scope.verification.errors = [];
      CoursesService.enroll(verification.code)
        .success(function(data, status, headers, config) {
          if ($state.current.data.hideWrapper) {
            $window.location.search = 'action=SUCCESS';
          } else {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, $scope.user);
          }
        })
        .error(function(data, status, headers, config) {
          $scope.verification.errors.push(data.error);
        });
    };

});

