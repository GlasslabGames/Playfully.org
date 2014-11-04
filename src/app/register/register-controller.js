angular.module('playfully.register', ['register.const'])

.config(function config( $stateProvider, $urlRouterProvider ) {

  var registerOptionsConfig = {
    templateUrl: 'register/register.html',
    controller: 'RegisterOptionsModalCtrl'
  };
  $stateProvider.state('registerOptions', {
    url: 'register',
    parent: 'modal',
    views: { 'modal@': {
      templateUrl: 'register/register-options.html',
      controller: 'RegisterOptionsModalCtrl'
    } }
  })
  .state('sdkv2RegisterOptions', {
    url: '/sdk/v2/game/:gameId/register',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': {
      templateUrl: 'register/v2/sdk-register-options.html',
      controller: 'sdkv2RegisterOptionsModalCtrl'
    } }
  });


  var registerInstructorConfig = {
    templateUrl: 'register/register-instructor.html',
    controller: 'RegisterInstructorCtrl'
  };
  $stateProvider.state('registerInstructor', {
    url: 'register/instructor',
    parent: 'modal',
    views: { 'modal@': registerInstructorConfig }
  })
  .state('sdkRegisterInstructor', {
    url: '/sdk/register/instructor',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': registerInstructorConfig }
  })
  .state('sdkv2RegisterInstructor', {
      url: '/sdk/v2/register/instructor',
      parent: 'site',
      data: {hideWrapper: true},
      views: {
          'main@': {
              templateUrl: 'register/v2/sdk-register-instructor.html',
              controller: 'RegisterInstructorCtrl'
          }
      }
  });

 var registerBetaConfig = {
    templateUrl: 'register/register-beta.html',
    controller: 'RegisterBetaCtrl'
  };
  $stateProvider.state('registerBeta', {
    url: 'register/beta',
    parent: 'modal',
    views: { 'modal@': registerBetaConfig }
  })
  .state('sdkRegisterBeta', {
    url: '/sdk/v2/register/beta',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': {
      templateUrl: 'register/v2/sdk-register-beta.html',
      controller: 'RegisterBetaCtrl'
    } }
  })
  .state('sdkRegisterPlayfullyInfo', {
    url: '/sdk/v2/register/playfully/info',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': {
      templateUrl: 'register/v2/sdk-register-playfully-info.html',
      controller: 'RegisterBetaCtrl'
    } }
  });


  var registerStudentConfig = {
    templateUrl: 'register/register-student.html',
    controller: 'RegisterStudentModalCtrl'
  };
  $stateProvider.state('registerStudent', {
    url: 'register/student',
    parent: 'modal',
    views: { 'modal@': registerStudentConfig } 
  })
  .state('sdkRegisterStudent', {
    url: '/sdk/register/student',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': registerStudentConfig }
  })
  .state('sdkv2RegisterStudent', {
    url: '/sdk/v2/game/:gameId/register/student',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': {
      templateUrl: 'register/v2/sdk-register-student.html',
      controller: 'sdkv2RegisterStudentModalCtrl'
    } }
  })
  .state('sdkv2RegisterStudentSuccess', {
      url: '/sdk/register/student/success',
      parent: 'site',
      data: {hideWrapper: true},
      views: {
          'main@': {
              templateUrl: 'register/sdk-register-student-success.html',
              controller: 'sdkv2RegisterStudentModalCtrl'
          }
      }
  })
  .state('sdkRegisterStudentSuccess', {
    url: '/sdk/register/student/success',
    parent: 'site',
    data: { hideWrapper: true },
    views: { 'main@': {
        templateUrl: 'register/sdk-register-student-success.html',
        controller: 'RegisterStudentModalCtrl'
    } }
  });
})

.directive('pwConfirm', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      scope.$watch(attrs.pwConfirm, function (confirmPassword) {
        var isValid = ctrl.$viewValue === confirmPassword;
        ctrl.$setValidity('pwmatch', isValid);
      });
    }
  };
}])

.controller('RegisterOptionsModalCtrl', function ($scope, THIRD_PARTY_AUTH) {
  $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
  $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;

})
.controller('sdkv2RegisterOptionsModalCtrl', function ($scope,$stateParams, THIRD_PARTY_AUTH) {
    $scope.gameId = $stateParams.gameId;
    $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
    $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;

})
.controller('RegisterInstructorCtrl',
    function ($scope, $log, $rootScope, $state, $window, UserService, Session, AUTH_EVENTS, ERRORS, REGISTER_CONSTANTS) {
      var user = null;

        $scope.account = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        state: null,
        school: '',
        confirm: '',
        role: 'instructor',
        acceptedTerms: false,
        newsletter: true,
        errors: [],
        isRegCompleted: false
      };

      $scope.states = REGISTER_CONSTANTS.states;

      $scope.register = function( account ) {
        $scope.regForm.isSubmitting = true;
        if (account.firstName && account.firstName.indexOf(' ') > -1) {
          firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
          $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ')+1);
          $scope.account.firstName = firstName;
        }
        UserService.register(account)
          .success(function(data, status, headers, config) {
            user = data;
            Session.create(user.id, user.role, data.loginType);
            $scope.regForm.isSubmitting = false;
            $scope.account.isRegCompleted = true;
          })
          .error(function(data, status, headers, config) {
            $log.error(data);
            $scope.regForm.isSubmitting = false;
            $scope.account.isRegCompleted = false;
            if ( data.error ) {
              $scope.account.errors.push(data.error);
            } else {
              $scope.account.errors.push(ERRORS['general']);
            }
          });
      };


    $scope.finish = function() {
      if (user !== null) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      }
    };
    $scope.closeWindow = function () {
        $window.location.search = 'action=SUCCESS';
    };

})


.controller('RegisterStudentModalCtrl',
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, CoursesService, Session, AUTH_EVENTS, ERRORS) {
      var user = null;

      $scope.confirmation = {
        code: null,
        errors: []
      };

      $scope.course = null;

      $scope.account = null;

      var _blankAccount = {
        username: '',
        password: '',
        confirm: '',
        firstName: '',
        lastName: '',
        role: 'student',
        regCode: null,
        errors: [],
        isRegCompleted: false
      };

      $scope.closeWindow = function() {
        $window.location.search = 'action=SUCCESS';
      };

      $scope.confirmCode = function(conf) {
        $scope.regInit.isSubmitting = true;
        $scope.confirmation.errors = [];
        CoursesService.verifyCode(conf.code)
          .then(function(resp) {
            $scope.regInit.isSubmitting = false;
            $scope.course = resp.data;
            $scope.account = angular.copy(_blankAccount);
            $scope.account.regCode = $scope.confirmation.code;
          }, function(resp) {
            $scope.regInit.isSubmitting = false;
            if ( resp.data.error ) {
              $scope.confirmation.errors.push(resp.data.error);
            }
          });
      };
      $scope.registerV2 = function (account) {
        $scope.regForm.isSubmitting = true;
        UserService.register(account)
            .success(function (data, status, headers, config) {
                $scope.regForm.isSubmitting = false;
                user = data;
                Session.create(user.id, user.role, data.loginType);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);

                if ($state.current.data.hideWrapper) {
                    $state.go('sdkv2LoginStudentSuccess');
                }
            })
            .error(function (data, status, headers, config) {
                $log.error(data);
                $scope.regForm.isSubmitting = false;
                $scope.account.isRegCompleted = false;
                if (data.error) {
                    $scope.account.errors.push(data.error);
                } else {
                    $scope.account.errors.push(ERRORS['general']);
                }
            });
      };
      $scope.register = function(account) {
        $scope.regForm.isSubmitting = true;
        UserService.register(account)
          .success(function(data, status, headers, config) {
            $scope.regForm.isSubmitting = false;
            user = data;
            Session.create(user.id, user.role, data.loginType);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);

            if ($state.current.data.hideWrapper) {
              $state.go('sdkRegisterStudentSuccess');
            }
          })
          .error(function(data, status, headers, config) {
            $log.error(data);
            $scope.regForm.isSubmitting = false;
            $scope.account.isRegCompleted = false;
            if ( data.error ) {
              $scope.account.errors.push(data.error);
            } else {
              $scope.account.errors.push(ERRORS['general']);
            }
          });
      };
})
.controller('sdkv2RegisterStudentModalCtrl',
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, CoursesService, Session, AUTH_EVENTS, ERRORS) {
        var user = null;

        $scope.confirmation = {
            code: null,
            errors: []
        };

        $scope.course = null;

        $scope.account = null;

        $scope.gameId = $stateParams.gameId;

        var _blankAccount = {
            username: '',
            password: '',
            confirm: '',
            firstName: '',
            lastName: '',
            role: 'student',
            regCode: null,
            errors: [],
            isRegCompleted: false
        };

        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
        };

        $scope.confirmCode = function (conf) {
            $scope.regInit.isSubmitting = true;
            $scope.confirmation.errors = [];
            CoursesService.verifyCode(conf.code)
                .then(function (resp) {
                    $scope.regInit.isSubmitting = false;
                    $scope.course = resp.data;
                    $scope.account = angular.copy(_blankAccount);
                    $scope.account.regCode = $scope.confirmation.code;
                    return;
                }, function (resp) {
                    $scope.regInit.isSubmitting = false;
                    if (resp.data.error) {
                        $scope.confirmation.errors.push(resp.data.error);
                    }
                });
        };
        $scope.registerV2 = function (account) {
            $scope.regForm.isSubmitting = true;
            UserService.register(account)
                .success(function (data, status, headers, config) {
                    $scope.regForm.isSubmitting = false;
                    user = data;
                    Session.create(user.id, user.role, data.loginType);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);

                    if ($state.current.data.hideWrapper) {
                        $state.go('sdkv2LoginStudentSuccess', {gameId: $scope.gameId });
                    }
                })
                .error(function (data, status, headers, config) {
                    $log.error(data);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = false;
                    if (data.error) {
                        $scope.account.errors.push(data.error);
                    } else {
                        $scope.account.errors.push(ERRORS['general']);
                    }
                });
        };
        $scope.register = function (account) {
            $scope.regForm.isSubmitting = true;
            UserService.register(account)
                .success(function (data, status, headers, config) {
                    $scope.regForm.isSubmitting = false;
                    user = data;
                    Session.create(user.id, user.role, data.loginType);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);

                    if ($state.current.data.hideWrapper) {
                        $state.go('sdkRegisterStudentSuccess');
                    }
                })
                .error(function (data, status, headers, config) {
                    $log.error(data);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = false;
                    if (data.error) {
                        $scope.account.errors.push(data.error);
                    } else {
                        $scope.account.errors.push(ERRORS['general']);
                    }
                });
        };
})
.controller('RegisterBetaCtrl',
    function ($scope, $log, $rootScope, $state, UserService, Session, AUTH_EVENTS, ERRORS) {
        var user = null;
        $scope.account = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            school: '',
            district: '',
            password: '',
            confirm: '',
            role: 'instructor',
            acceptedTerms: false,
            newsletter: true,
            errors: [],
            isRegCompleted: false
        };

        $scope.register = function (account) {
            $scope.regForm.isSubmitting = true;
            if (account.firstName && account.firstName.indexOf(' ') > -1) {
                firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
                $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ') + 1);
                $scope.account.firstName = firstName;
            }
            UserService.register(account)
                .success(function (data, status, headers, config) {
                    user = data;
                    Session.create(user.id, user.role);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = true;
                })
                .error(function (data, status, headers, config) {
                    $log.error(data);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = false;
                    if (data.error) {
                        $scope.account.errors.push(data.error);
                    } else {
                        $scope.account.errors.push(ERRORS['general']);
                    }
                });
        };

        $scope.finish = function () {
            if (user !== null) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
            }
        };

});





