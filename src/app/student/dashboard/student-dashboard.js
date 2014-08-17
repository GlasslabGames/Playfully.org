angular.module( 'student.dashboard', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'studentDashboard', {
    // parent: 'site',
    url: '/home',
    views: {
      'main@': {
        controller: 'DashboardStudentCtrl',
        templateUrl: 'student/dashboard/student-dashboard.html'
      }
    },
    data:{
      pageTitle: 'Home',
      authorizedRoles: ['student']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })
  .state( 'studentDashboardModal', {
    abstract: true,
    parent: 'studentDashboard',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'sm'
      });

    }
  })
  .state( 'enrollInCourse', {
    parent: 'studentDashboardModal',
    url: '/enroll',
    views: {
      'modal@': {
        controller: 'EnrollInCourseModalCtrl',
        templateUrl: 'student/dashboard/course-enroll.html'
      }
    },
    data:{
      pageTitle: 'Add a Class Code',
      authorizedRoles: ['student']
    }
  });
})

.controller( 'DashboardStudentCtrl', function ( $scope, $log, $window, ipCookie, courses, games, UserService) {
  $scope.courses = courses;
  $scope.gamesInfo = {};
  angular.forEach(games, function(game) {
    $scope.gamesInfo[game.gameId] = game;
  });
})

.controller( 'EnrollInCourseModalCtrl',
  function ( $scope, $rootScope, $state, $log, $timeout, CoursesService) {

    $scope.verification = {
      code: null,
      errors: []
    };
    
    $scope.verify = function(verification) {
      $scope.enrollment = null;
      $scope.verification.errors = [];
      CoursesService.verifyCode(verification.code)
        .then(function(result) {
          $scope.enrollment = result.data;
          $scope.enrollment.courseCode = $scope.verification.code;
          $scope.enrollment.errors = [];
        }, function(result) {
          if ( result.data.error ) {
            $scope.verification.errors.push(result.data.error);
          }
        });
    };

    $scope.enroll = function(enrollment) {
      $scope.enrollment.errors = [];
      CoursesService.enroll(enrollment.courseCode)
        .success(function(data, status, headers, config) {
          $rootScope.modalInstance.close();
          return $timeout(function () {
            $state.go('studentDashboard', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, config) {
          $log.error(data);
        });
    };

});


