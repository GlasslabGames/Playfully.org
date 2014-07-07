angular.module('playfully.login', [])

.config(function config( $stateProvider, $urlRouterProvider ) {
  $stateProvider
    .state('loginOptions', {
      url: 'login',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login.html',
          controller: 'LoginOptionsModalCtrl'
        }
      }
    })
    .state('loginInstructor', {
      url: 'login/instructor',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login-instructor.html',
          controller: 'LoginModalCtrl'
        }
      }
    })
    .state('loginStudent', {
      url: 'login/student',
      parent: 'modal',
      views: {
        'modal@': {
          templateUrl: 'login/login-student.html',
          controller: 'LoginModalCtrl'
        }
      }
    });
})

.controller('LoginOptionsModalCtrl', function ($scope, $rootScope, $window, $log) {

  $scope.logInWithEdmodo = function() {
    $log.info('logInWithEdmodo');
    $window.location.href = '/auth/edmodo/login';
  };

})

.controller('LoginModalCtrl', function ($scope, $rootScope, $log, AuthService, AUTH_EVENTS) {
  $scope.credentials = { username: '', password: '' };
  $scope.authError = null;

  $scope.login = function ( credentials ) {
    $scope.authError = null;

    AuthService.login(credentials).then(function(result) {
      $log.info(result);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
    }, function(result) {
      $log.error(result);
      $scope.authError = result.data.error;
      $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
    });

  };

  
});










    /*function ($scope, $log, $rootScope, $state, $modalInstance, AuthService, AUTH_EVENTS) {

  $scope.credentials = { username: '', password: '' };
  $scope.authError = null;

  $scope.state = {
    activeScreen: 'initial'
  };

  $scope.login = function(credentials) {
    $scope.authError = null;

    AuthService.login(credentials)
      .success(function(data, status, headers, config) {
        console.log(data);
        $modalInstance.close();
        $scope.authError = null;
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
      })
      .error(function(data, status, headers, config) {
        $scope.authError = data.error;
        $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
      });
  };

  $scope.retrievePassword = function(formInput) {
    AuthService.sendPasswordResetLink(formInput.email)
      // .then(function(response) {
      //   // temporary handler until API is working
      //   $scope.state.emailAddress = response;
      //   $scope.state.activeScreen = 'forgotPasswordSuccess';
      // });
      .success(function(data, status, headers, config) {
        console.log(data);
      })
      .error(function(data, status, headers, config) {
        console.log(data);
      });
  };

  $scope.showInstructorLogin = function() {
    $scope.state.activeScreen = 'instructor'; 
  };

  $scope.showStudentLogin = function() {
    $scope.state.activeScreen = 'student'; 
  };

  $scope.showForgotPassword = function() {
    $scope.state.activeScreen = 'forgotPassword';
  };

  $scope.showRegistration = function() {
    console.log($modalInstance);
  };

  $scope.cancelLogin = function() {
    $modalInstance.close();
  };
  */
