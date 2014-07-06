angular.module('playfully.register', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('registerOptions', {
      url: 'register',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'register/register.html',
          controller: 'RegisterModalCtrl'
        }
      }
    });
})

.controller('RegisterModalCtrl',
    function ($scope, $log, $rootScope, $state, UserService, Session, AUTH_EVENTS) {

    $scope.reg = {
      role: 'instructor',
      currentStep: 1,
      firstName: null,
      email: null,
      password: null,
      confirm: null,
      status: 'incomplete',
      errors: []
    };


    $scope.goToNextStep = function() {
      $scope.reg.currentStep += 1;
    };

    $scope.verifyInstructorReg = function() {
      if ($scope.reg.role == 'instructor') {
        return (!$scope.reg);
        // || !$scope.reg.email.length ||
        //   !$scope.reg.password.length || !$scope.reg.confirm.length ||
        //   ($scope.reg.password !== $scope.reg.confirm));
      }
      return false;
    };

    $scope.registerInstructor = function(reg) {
      while($scope.reg.errors.length > 0) {
        $scope.reg.errors.pop();
      }
      UserService.register(reg)
        .success(function(data, status, headers, config) {
          $scope.reg.status = 'instructorRegComplete';   
          $scope.reg.currentStep = null;
          user = data;
          Session.create(user.id, user.role);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
        })
        .error(function(data, status, headers, config) {
          $scope.reg.errors.push(data.error);
        });
    };


  // $scope.credentials = { username: '', password: '' };
  // $scope.authError = null;

  // $scope.login = function(credentials) {
  //   $scope.authError = null;

  //   AuthService.login(credentials)
  //     .success(function(data, status, headers, config) {
  //       console.log(data);
  //       $modalInstance.close();
  //       $scope.authError = null;
  //       $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
  //     })
  //     .error(function(data, status, headers, config) {
  //       $scope.authError = data.error;
  //       $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
  //     });
  // };

  // $scope.cancelLogin = function() {
  //   $modalInstance.close();
  // };

});
