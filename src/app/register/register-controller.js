angular.module('playfully.register', ['register.const'])

.config(function config( $stateProvider, $urlRouterProvider ) {

  $stateProvider.state('modal.register', {
    url: '/register?:upgrade?:packageType?:seatsSelected?:role',
    parent: 'modal',
    data: {
      modalSize: 'lg'
    },
    views: { 'modal@': {
      templateUrl: 'register/register-options.html',
      controller: 'RegisterOptionsModalCtrl'
    } }
  });


  var registerInstructorConfig = {
    templateUrl: 'register/register-instructor.html',
    controller: 'RegisterInstructorCtrl'
  };
  $stateProvider.state('modal.register.instructor', {
    url: '/instructor',
    views: { 'modal@': registerInstructorConfig }
  })
  .state('sdk.sdkRegisterInstructor', {
    url: '/register/instructor',
    data: { hideWrapper: true },
    views: { 'main@': registerInstructorConfig }
  });


  var registerStudentConfig = {
    templateUrl: 'register/register-student.html',
    controller: 'RegisterStudentModalCtrl'
  };
  $stateProvider.state('modal.register.student', {
    url: '/student',
    views: { 'modal@': registerStudentConfig } 
  })
  .state('sdk.sdkRegisterStudent', {
    url: '/register/student',
    data: { hideWrapper: true },
    views: { 'main@': registerStudentConfig }
  })

  .state('sdk.sdkRegisterStudentSuccess', {
    url: '/register/student/success',
    data: { hideWrapper: true },
    views: { 'main@': {
        templateUrl: 'register/v2/sdk-register-student-success.html',
        controller: 'RegisterStudentModalCtrl'
    } }
  });


  var registerResellerConfig = {
    templateUrl: 'register/register-reseller.html',
    controller: 'RegisterResellerCtrl'
  };
  $stateProvider.state('modal.register.reseller', {
    url: '/reseller',
    views: { 'modal@': registerResellerConfig }
  })
  .state('sdk.sdkRegisterReseller', {
    url: '/register/reseller',
    data: { hideWrapper: true },
    views: { 'main@': registerResellerConfig }
  });



  var registerDeveloperConfig = {
    templateUrl: 'register/register-developer.html',
    controller: 'RegisterDeveloperCtrl'
  };
  $stateProvider.state('modal.register.developer', {
    url: '/developer',
    views: { 'modal@': registerDeveloperConfig }
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

.controller('RegisterOptionsModalCtrl', function ($scope, $stateParams, THIRD_PARTY_AUTH) {
  $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
  $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;
  $scope.upgrade = $stateParams.upgrade;
  $scope.role = $stateParams.role;
})

.controller('RegisterInstructorCtrl',
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, AuthService, Session, AUTH_EVENTS, ERRORS, REGISTER_CONSTANTS, ENV) {
        var user = null;
        var packageInfo = {
            packageType: null || $stateParams.packageType,
            seatsSelected: null || $stateParams.seatsSelected
         };
        $scope.upgrade = null || $stateParams.upgrade;
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
        newsletter: false,
        errors: [],
        isRegCompleted: false
      };

      $scope.states = REGISTER_CONSTANTS.states;

      $scope.validatePassword = AuthService.validatePassword;
      $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
      $scope.validatePasswordTip = AuthService.validatePasswordTip;
      $scope.passwordMinLength = AuthService.passwordMinLength;

      $scope.register = function( account ) {
        $scope.regForm.isSubmitting = true;
        if (account.firstName && account.firstName.indexOf(' ') > -1) {
          firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
          $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ')+1);
          $scope.account.firstName = firstName;
        }
        // Get the standard based on state
        if( account.state === "Texas" ) {
          account.standards = "TEKS";
        }
        else {
          account.standards = "CCSS";
        }
        UserService.register(account, $scope.upgrade, packageInfo)
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
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, AuthService, CoursesService, Session, AUTH_EVENTS, ERRORS) {
      var user = null;

      $scope.confirmation = {
        code: null,
        errors: []
      };
      $scope.acceptedTerms = false;
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

      $scope.validatePassword = AuthService.validatePassword;
      $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
      $scope.validatePasswordTip = AuthService.validatePasswordTip;
      $scope.passwordMinLength = AuthService.passwordMinLength;

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
                    $state.go('sdk.sdkv2LoginStudentSuccess');
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
              $state.go('sdk.sdkRegisterStudentSuccess');
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

.controller('RegisterResellerCtrl',
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, AuthService, Session, AUTH_EVENTS, ERRORS, REGISTER_CONSTANTS, ENV) {
        var user = null;
        var packageInfo = {
            packageType: null || $stateParams.packageType,
            seatsSelected: null || $stateParams.seatsSelected
         };
        $scope.upgrade = null || $stateParams.upgrade;
        $scope.account = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          state: null,
          school: '',
          confirm: '',
          role: 'res-cand',
          acceptedTerms: false,
          newsletter: false,
          errors: [],
          isRegCompleted: false
        };

      $scope.states = REGISTER_CONSTANTS.states;

      $scope.validatePassword = AuthService.validatePassword;
      $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
      $scope.validatePasswordTip = AuthService.validatePasswordTip;
      $scope.passwordMinLength = AuthService.passwordMinLength;

      $scope.registerReseller = function( account ) {
        $scope.regForm.isSubmitting = true;
        if (account.firstName && account.firstName.indexOf(' ') > -1) {
          firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
          $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ')+1);
          $scope.account.firstName = firstName;
        }
        // Get the standard based on state
        if( account.state === "Texas" ) {
          account.standards = "TEKS";
        }
        else {
          account.standards = "CCSS";
        }
        UserService.register(account, $scope.upgrade, packageInfo)
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


.controller('RegisterBetaCtrl',
    function ($scope, $log, $rootScope, $state, UserService, AuthService, Session, AUTH_EVENTS, ERRORS) {
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
            newsletter: false,
            errors: [],
            isRegCompleted: false
        };

        $scope.validatePassword = AuthService.validatePassword;
        $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
        $scope.validatePasswordTip = AuthService.validatePasswordTip;
        $scope.passwordMinLength = AuthService.passwordMinLength;

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

})


.controller('RegisterDeveloperCtrl',
    function ($scope, $log, $rootScope, $state, $window, UserService, AuthService, Session, AUTH_EVENTS, ERRORS) {
      var user = null;

      $scope.account = {
        firstName: '',
        lastName: '',
        email: '',
        organization: '',
        orgRole: '',
        numGames: '',
        subjects: '',
        interest: '',
        confirm: '',
        role: 'developer',
        errors: [],
        isRegCompleted: false
      };

      $scope.validatePassword = AuthService.validatePassword;
      $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
      $scope.validatePasswordTip = AuthService.validatePasswordTip;
      $scope.passwordMinLength = AuthService.passwordMinLength;

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

});

