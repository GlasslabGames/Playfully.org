angular.module( 'instructor.dashboard', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'instructorDashboard', {
    parent: 'site',
    url: '/dashboard',
    views: {
      'main@': {
        controller: 'InstructorDashboardCtrl',
        templateUrl: 'instructor/dashboard/instructor-dashboard.html'
      }
    },
    data:{
      pageTitle: 'Dashboard',
      authorizedRoles: ['instructor']
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollmentsWithStudents();
      },
      games: function(GamesService) {
        return GamesService.all();
      },
      myGames: function(GamesService) {
        return GamesService.getMyGames();
      }
    }
  });
})

.controller( 'InstructorDashboardCtrl',
  function ( $scope, $log, courses, games, myGames, GamesService, ReportsService) {

    $scope.students = {};
    $scope.courses = courses;

    // Populate students list from courses
    angular.forEach(courses, function(course) {
      angular.forEach(course.users, function(student) {
        if (!$scope.students.hasOwnProperty(student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });


    $scope.myGames = myGames;
    $scope.games = games;
    $scope.status = { 
      selectedOption: findFirstValidGame(games),
      selectedCourseId: findFirstValidCourse(courses)
    };

    function findFirstValidGame(games) {
      // find first "valid" game (not archived)
      for(var i = 0; i < games.length; i++) {
        if(games[i].enabled) {
          $log.debug(games[i]);
          return games[i];
        }
      }

      return null;
    }

    // find first "valid" course (not archived)
    function findFirstValidCourse(courses) {
      // find first "valid" game (not archived)
      for(var i = 0; i < courses.length; i++) {
        if(!courses[i].archived) {
          return courses[i].id;
        }
      }

      return null;
    }

    $scope.getTimes = function(n) { return new Array(n); };

    $scope.$watch('status.selectedCourseId', function(newValue, oldValue) {
      ReportsService.get('sowo', $scope.status.selectedOption.gameId, newValue)
        .then(function(data) {
          _populateSowo(data);
        }, function(data) {
          $log.error(data);
        });
    });

    /* Set the passed-in course to be the selected one */
    $scope.selectCourse = function($event, courseId) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.selectedCourseId = courseId;
    };

    var _populateSowo = function(data) {
      var sowo = data;

      $scope.sowo = { 
        shoutOuts: [],
        watchOuts: []
      };

      if (sowo.length) {
        angular.forEach(sowo, function(assessment) {
          if (assessment.results.hasOwnProperty('shoutout')) {
            $scope.sowo.shoutOuts.push({
              student: $scope.students[assessment.userId],
              results: assessment.results['shoutout'],
              overflowText: _getOverflowText(assessment.results['shoutout'])
            });
          }
          if (assessment.results.hasOwnProperty('watchout')) {
            $scope.sowo.watchOuts.push({
              student: $scope.students[assessment.userId],
              results: assessment.results['watchout'],
              overflowText: _getOverflowText(assessment.results['watchout'])
            });
          }
        });
      }
    };

  var _getOverflowText = function(results) {
    overflowText = '';
    angular.forEach(results, function(r, i) {
      if (i >= 3) {
        overflowText += '<p>' + r.description + '</p>';
      }
    });
    return overflowText;
  };
});


