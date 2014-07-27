angular.module('playfully.register', [])

.constant('REG_ERRORS', {
  'email.not.unique': "The email address is already in use by another user. Please provide a different email address",
  'username.not.unique': "That screen name is not available"

})

.config(function config( $stateProvider, $urlRouterProvider ) {

  var registerOptionsConfig = {
    templateUrl: 'register/register.html',
    controller: 'RegisterOptionsModalCtrl'
  };
  $stateProvider.state('registerOptions', {
    url: 'register',
    parent: 'modal',
    views: { 'modal@': registerOptionsConfig }
  })
  .state('sdkRegisterOptions', {
    url: '/sdk/register',
    parent: 'site',
    data: { hideWrapper: true, authorizedRoles: ['guest'] },
    views: { 'main@': registerOptionsConfig }
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



.controller('RegisterInstructorCtrl',
    function ($scope, $log, $rootScope, $state, UserService, Session, AUTH_EVENTS, REG_ERRORS) {
      var user = null;

      $scope.account = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm: '',
        role: 'instructor',
        acceptedTerms: false,
        newsletter: true,
        errors: [],
        isRegCompleted: false
      };

      $scope.register = function( account ) {
        if (account.firstName && account.firstName.indexOf(' ') > -1) {
          firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
          $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ')+1);
          $scope.account.firstName = firstName;
        }
        UserService.register(account)
          .success(function(data, status, headers, config) {
            user = data;
            Session.create(user.id, user.role);
            $scope.account.isRegCompleted = true;
          })
          .error(function(data, status, headers, config) {
            $log.error(data);
            $scope.account.isRegCompleted = false;
            if ( data.hasOwnProperty('key') ) {
              $scope.account.errors.push(REG_ERRORS[data.key]);
            } else {
              $scope.account.errors.push(data.error);
            }
          });
      };

    $scope.finish = function() {
      if (user !== null) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
      }
    };

})


.controller('RegisterStudentModalCtrl',
    function ($scope, $log, $rootScope, $state, UserService, CoursesService, Session, AUTH_EVENTS, REG_ERRORS) {
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


      $scope.confirmCode = function(conf) {
        $scope.confirmation.errors = [];
        CoursesService.verifyCode(conf.code)
          .then(function(resp) {
            $log.info(resp);
            if (resp.data.key.indexOf('invalid') >= 0) {
              $scope.confirmation.errors.push(resp.data.status);
            } else {
              $scope.course = resp.data;
              $scope.account = angular.copy(_blankAccount);
              $scope.account.regCode = $scope.confirmation.code;
            }
          });
      };

      $scope.register = function(account) {
        UserService.register(account)
          .success(function(data, status, headers, config) {
            user = data;
            Session.create(user.id, user.role);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
          })
          .error(function(data, status, headers, config) {
            $log.error(data);
            $scope.account.isRegCompleted = false;
            if ( data.hasOwnProperty('key') ) {
              $scope.account.errors.push(REG_ERRORS[data.key]);
            } else {
              $scope.account.errors.push(data.error);
            }
          });
      };
});

