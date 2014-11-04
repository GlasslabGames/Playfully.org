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
        return GamesService.all('details');
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

      $rootScope.modalInstance.result.finally(function(result) {
        return $state.transitionTo('studentDashboard');
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
  })
  .state('sdkv2EnrollInCourse', {
    parent: 'site',
    url: '/sdk/v2/game/:gameId/enroll',
    resolve: {
      games: function (GamesService) {
        return GamesService.all('details');
      },
      courses: function (CoursesService) {
        return CoursesService.getEnrollments();
      }
    },
    views: {
      'main@': {
        controller: 'sdkv2EnrollInCourseModalCtrl',
        templateUrl: 'student/dashboard/v2/sdk-course-enroll.html'
      }
    },
    data: {
      hideWrapper: true,
      authorizedRoles: ['student']
    }
  })
  .state( 'sdkEnrollInCourse', {
    parent: 'site',
    url: '/sdk/v2/enroll',
    resolve: {
      games: function (GamesService) {
        return GamesService.all('details');
      },
      courses: function (CoursesService) {
        return CoursesService.getEnrollments();
      }
    },
    views: {
      'main@': {
        controller: 'EnrollInCourseModalCtrl',
        templateUrl: 'student/dashboard/sdk-course-enroll.html'
      }
    },
    data:{
      hideWrapper: true,
      authorizedRoles: ['student']
    }
  });
})

.controller( 'DashboardStudentCtrl', function ( $scope, $log, $window, $state, $modal, ipCookie, courses, games) {
  $scope.courses = courses;
  $scope.gamesInfo = {};
  angular.forEach(games, function(game) {
    $scope.gamesInfo[game.gameId] = game;
  });

  $scope.hasLinks = function(gameId) {
    if($scope.gamesInfo[gameId].buttons) {
      for(var i = 0; i < $scope.gamesInfo[gameId].buttons.length; i++){
        if( $scope.isValidLinkType($scope.gamesInfo[gameId].buttons[i]) ) {
          return true;
        }
      }
    }

    return false;
  };

  $scope.isValidLinkType = function(button) {
    if( (button.type == 'play' || button.type == 'download') &&
         button.links &&
        ($scope.isSingleLinkType(button) || $scope.isMultiLinkType(button)) ) {
      return true;
    }
    return false;
  };

  $scope.isSingleLinkType = function(button) {
    if(button.links && button.links.length == 1) {
      return true;
    }
    return false;
  };

  $scope.isMultiLinkType = function(button) {
    if(button.links && button.links.length > 1) {
      return true;
    }
    return false;
  };

  $scope.goToPlayGame = function(gameId) {

    // TODO: this should not open a modal here it should just route and the route state should open the modal on the current page
    if($scope.gamesInfo[gameId].play.type == 'missions') {
      $modal.open({
        size: 'lg',
        keyboard: false,
        data:{
          parentState: 'studentDashboard'
        },
        resolve: {
          gameMissions: function(GamesService) {
            return GamesService.getGameMissions(gameId);
          },
          gameId: function(){
            return gameId;
          }
        },
        templateUrl: 'games/game-play-missions.html',
        controller: 'GameMissionsModalCtrl'

      });
    } else {
      $window.location = "/games/"+gameId+"/play-"+$scope.gamesInfo[gameId].play.type;
    }
  };
  $scope.goToLink = function(link) {
    $window.open(link);
  };
})

.controller( 'EnrollInCourseModalCtrl',
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, courses, CoursesService) {

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
        var msg = "You have already enrolled in this course: " + enrolledCourse.title;
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

})

.controller('sdkv2EnrollInCourseModalCtrl',
function ($scope, $rootScope, $state, $stateParams, $log, $timeout, courses, CoursesService) {

  $scope.verification = {
    code: null,
    errors: []
  };
  $scope.enroll = function (verification) {
    $scope.enrollment = null;
    $scope.verification.errors = [];
    var msg;
    var userNotEnrolledInCourse = true;
    var courseHasCurrentGame = false;
    var enrolledCourse = null;
    // Check whether the user is already enrolled
    if (courses.length) {
      angular.forEach(courses, function (course) {
        if (verification.code === course.code) {
          // check if current game is in selected course
          courseHasCurrentGame = _.any(course.games, function (game) {
            return game.id === $stateParams.gameId;
          });
          userNotEnrolledInCourse = false;
          enrolledCourse = course;
        }
      });
    }

    if (!courseHasCurrentGame) {
      msg = "The class you tried to join does not have this game.";
      $scope.verification.errors.push(msg);
      return;
    }

    // Only verify the code if the user isn't already in the course
    if (userNotEnrolledInCourse) {
      CoursesService.verifyCode(verification.code)
          .then(function (result) {
            $scope.enrollment = result.data;
            $scope.enrollment.courseCode = $scope.verification.code;
            $scope.enrollment.errors = [];
          }, function (result) {
            if (result.data.error) {
              $scope.verification.errors.push(result.data.error);
            }
          })
          .then(function () {
            CoursesService.enroll(verification.code)
                .then(function () {
                  $state.go('sdkv2LoginStudentSuccess', {gameId: $stateParams.gameId});
                });
          })
      ;
    } else {
      msg = "You have already enrolled in this course: " + enrolledCourse.title;
      $scope.verification.errors.push(msg);
    }
  };


});


