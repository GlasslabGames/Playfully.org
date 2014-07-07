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
          controller: 'RegisterModalCtrl'
        }
      }
    })
    .state('registerStudent', {
      url: 'register/student',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'register/register-student.html',
          controller: 'RegisterModalCtrl'
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



.controller('RegisterModalCtrl',
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

});

    // $scope.reg = {
    //   role: 'instructor',
    //   currentStep: 1,
    //   firstName: null,
    //   email: null,
    //   password: null,
    //   confirm: null,
    //   status: 'incomplete',
    //   errors: []
    // };


    // $scope.goToNextStep = function() {
    //   $scope.reg.currentStep += 1;
    // };

    // $scope.verifyInstructorReg = function() {
    //   if ($scope.reg.role == 'instructor') {
    //     return (!$scope.reg);
    //     // || !$scope.reg.email.length ||
    //     //   !$scope.reg.password.length || !$scope.reg.confirm.length ||
    //     //   ($scope.reg.password !== $scope.reg.confirm));
    //   }
    //   return false;
    // };

    // $scope.registerInstructor = function(reg) {
    //   while($scope.reg.errors.length > 0) {
    //     $scope.reg.errors.pop();
    //   }
    //   UserService.register(reg)
    //     .success(function(data, status, headers, config) {
    //       $scope.reg.status = 'instructorRegComplete';   
    //       $scope.reg.currentStep = null;
    //       user = data;
    //       Session.create(user.id, user.role);
    //       $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
    //     })
    //     .error(function(data, status, headers, config) {
    //       $scope.reg.errors.push(data.error);
    //     });
    // };

