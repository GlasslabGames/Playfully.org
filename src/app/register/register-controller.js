angular.module('playfully.register', [])

.constant('REG_ERRORS', {
  'email.not.unique': "The email address is already in use by another user. Please provide a different email address"

})

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('registerOptions', {
      url: 'register',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'register/register.html',
          controller: 'RegisterOptionsModalCtrl'
        }
      }
    })
    .state('registerInstructor', {
      url: 'register/instructor',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'register/register-instructor.html',
          controller: 'RegisterInstructorModalCtrl'
        }
      }
    })
    .state('registerStudent', {
      url: 'register/student',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'register/register-student.html',
          controller: 'RegisterStudentModalCtrl'
        }
      }
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

.controller('RegisterOptionsModalCtrl', function ($scope) {

})



.controller('RegisterInstructorModalCtrl',
    function ($scope, $log, $rootScope, $state, UserService, Session, AUTH_EVENTS, REG_ERRORS) {
      var user = null;

      $scope.account = {
        firstName: '',
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
    function ($scope, $log, $rootScope, $state, UserService, Session, AUTH_EVENTS, REG_ERRORS) {
      var user = null;
      $scope.reg = {
        role: 'student',
        errors: []
      };

      $scope.confirmCode = function(regInfo) {
        $scope.reg.errors = [];
        console.log(regInfo);
        UserService.register(regInfo)
          .success(function(data, status, headers, config) {
            $log.info(data);
          })
          .error(function(data, status, headers, config) {
            $log.error(data);
            $scope.reg.errors.push(data.error);
          });
      };
});

