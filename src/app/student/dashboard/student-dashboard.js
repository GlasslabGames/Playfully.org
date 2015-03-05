angular.module( 'student.dashboard', [
  'courses',
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state('root.studentDashboard', {
    url: 'home',
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
        return GamesService.active('details');
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })

  .state( 'modal.enrollInCourse', {
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
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })

  .state( 'sdk.sdkEnrollInCourse', {
    url: '/v2/enroll',
    resolve: {
      games: function (GamesService) {
        return GamesService.active('details');
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

.controller( 'DashboardStudentCtrl', function ( $scope, $log, $window, $state, $modal, ipCookie, courses, games, DetectionSvc) {
  $scope.currentOS = null;

  if (DetectionSvc.getOSSupport().supported) {
    $scope.currentOS = DetectionSvc.getOSSupport().identity;
  }

  $scope.courses = courses;
  $scope.gamesInfo = {};

  angular.forEach(courses, function(course) {
      course.hasEnabledGames = _.some(course.games, function(game) {
          return game.assigned;
      });
  });

  angular.forEach(games, function(game) {
    $scope.gamesInfo[game.gameId] = game;
  });

  /**
   * This method has been updated to cache the result of whether a particular game
   * has valid links, to avoid doing a lot of the previous looping.
   **/
  $scope.hasLinks = function(gameId) {
    var game = $scope.gamesInfo[gameId];
    if (_.has(game, 'hasLinks')) {
      return game.hasLinks;
    } else {
      var result = false;
      if (game.buttons) {
        result = _.any(game.buttons, function(button) {
          return $scope.isValidLinkType(button);
        });
      }
      $scope.gamesInfo[gameId].hasLinks = result;
      return result;
    }
  };

  $scope.isValidLinkType = function(button) {
    return ((button.type == 'play' || button.type == 'download') &&
         button.links && ($scope.isSingleLinkType(button) || $scope.isMultiLinkType(button)));
  };

  $scope.isSingleLinkType = function(button) {
    return (_.has(button, 'links') && button.links.length == 1);
  };

  $scope.isMultiLinkType = function(button) {
    return (_.has(button, 'links') && button.links.length > 1);
  };

  $scope.goToPlayGame = function(gameId) {

    if ($scope.gamesInfo[gameId].play.type === 'missions') {
      $state.go('modal-lg.missions', {gameId: gameId});
    } else {
      $window.location = "/games/" + gameId + "/play-" + $scope.gamesInfo[gameId].play.type;
    }
    // TODO: this should not open a modal here it should just route and the route state should open the modal on the current page
    //  $modal.open({
    //    size: 'lg',
    //    keyboard: false,
    //    data:{
    //      parentState: 'studentDashboard'
    //    },
    //    resolve: {
    //      gameMissions: function(GamesService) {
    //        return GamesService.getGameMissions(gameId);
    //      },
    //      gameId: function(){
    //        return gameId;
    //      }
    //    },
    //    templateUrl: 'games/game-play-missions.html',
    //    controller: 'GameMissionsModalCtrl'
    //
    //  });
    //} else {
    //  $window.location = "/games/"+gameId+"/play-"+$scope.gamesInfo[gameId].play.type;
    //}
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
      // Check whether the user is already enrolled
      if (courses.length) {
        var matchingCourses = _.first(courses, {'code': verification.code});
        if (matchingCourses.length) { 
          $scope.verification.errors.push("You have already enrolled in this course: " + matchingCourses[0].title);
          userNotEnrolledInCourse = false;
        }
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
      }
    };

    $scope.enroll = function(enrollment) {
      $scope.enrollment.errors = [];
      CoursesService.enroll(enrollment.courseCode)
        .success(function(data, status, headers, config) {
          $scope.close();
          return $timeout(function () {
            $state.go($state.current, {}, {reload: true});
          }, 100);
        })
        .error(function(data, status, config) {
          $log.error(data);
          $scope.enrollment.errors.push(data.error);
        });
    };

});
