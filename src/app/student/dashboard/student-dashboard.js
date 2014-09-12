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
        size: 'sm',
        keyboard: false
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
  function ( $scope, $rootScope, $state, $log, $timeout, courses, CoursesService) {

    $scope.verification = {
      code: null,
      errors: []
    };

    
    $scope.verify = function(verification) {
      $scope.enrollment = null;
      $scope.verification.errors = [];
      var userNotEnrolledInCourse = true;
      var enrolledCourse = null;
      // Check whether the user is already enrolled
      if (courses.length) {
        angular.forEach(courses, function(course) {
          if (verification.code === course.code) {
            userNotEnrolledInCourse = false;
            enrolledCourse = course;
          }
        });
      }
      // Only verify the code if the user isn't already in the course
      if (userNotEnrolledInCourse) {
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
      } else {
        msg = "You have already enrolled in this course: " + enrolledCourse.title;
        $scope.verification.errors.push(msg);
      }
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

    $scope.closeModal = function() {
      $scope.$close(true);
      return $timeout(function () {
        $state.go('studentDashboard', {}, { reload: true });
      }, 100);
    };

});


