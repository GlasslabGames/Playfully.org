angular.module( 'instructor.dashboard', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state('instructorDashboard', {
    abstract: true,
    url: '/dashboard',
    data: {
      authorizedRoles: ['instructor', 'admin'],
      pageTitle: 'Dashboard'
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollmentsWithStudents();
      },
      activeCourses: function(courses, $q, $filter) {
        var deferred = $q.defer();
        var active = $filter('filter')(courses, {archived: false});
        deferred.resolve(active);
        return deferred.promise;
      },
      games: function(GamesService) { return GamesService.all(); },
      myGames: function(GamesService) { return GamesService.getMyGames(); }
    },
    views: {
      main: {
        templateUrl: 'instructor/dashboard/instructor-dashboard.html',
        controller: function ($scope, myGames) { $scope.myGames = myGames; }
      }
    }
  })

  .state('instructorDashboard.default', {
    url: '',
    controller: function($scope, $state, $log, myGames, activeCourses) {
      // Decide which state to send the instructor to, based on whether
      // they have courses set up.
      if (!myGames.length) {
        $state.transitionTo('instructorDashboard.intro');
      } else {
        $state.transitionTo('instructorDashboard.gameplay',
          { gameId: myGames[0].gameId, courseId: activeCourses[0].id });
      }
    }
  })

  .state('instructorDashboard.intro', {
    url: '/intro',
    templateUrl: 'instructor/dashboard/_dashboard-intro.html'
  })

  .state('instructorDashboard.gameplay', {
    url: '/game/:gameId/course/:courseId',
    templateUrl: 'instructor/dashboard/_dashboard-reports.html',
    controller: 'InstructorDashboardCtrl'
  });
})


.controller('InstructorDashboardCtrl', function($scope, $state, $stateParams, $log, activeCourses, games, myGames, GamesService, ReportsService) {

  $scope.students = {};
  $scope.courses = activeCourses;
  $scope.games = games;
  $scope.myGames = myGames;
  $scope.status = {
    selectedGameId: $stateParams.gameId,
    selectedCourseId: $stateParams.courseId,
    selectedGame: null
  };
  $scope.reports = {
    isOpen: false,
    selected: null,
    options: []
  };
  $scope.sowo = {
    shoutOuts: null,
    watchOuts: null,
    // set max rows for SOWO
    max: 7,
    // to display show more button
    hasOverflow: false
  };

  var _setSelectedGameById = function(gameId) {
    $scope.status.selectedGame = _.find($scope.games, function(game) {
      return game.gameId == gameId;
    });
  };

  var _populateStudentsListFromCourses = function(courseList) {
    angular.forEach(courseList, function(course) {
      angular.forEach(course.users, function(student) {
        if (!$scope.students.hasOwnProperty(student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });
  };

  var _getReports = function() {
    GamesService.getAllReports($stateParams.gameId)
      .then(function(data) {
        if (data.list && data.list.length) {
          $scope.reports.options = data.list;

          $scope.reports.selected = _.find(data.list, function(report) {
            return report.id == 'sowo';
          }) || null;

          if ($scope.reports.selected) {
            ReportsService.get($scope.reports.selected.id, $stateParams.gameId, $stateParams.courseId).then(function(data) {
                _populateSowo(data);
              }, function(data) {
                $log.error(data);
              });
          }
        }
      });
  };


  var _initDashboard = function() {
    _populateStudentsListFromCourses(activeCourses);
    _setSelectedGameById($stateParams.gameId);

    $scope.$watch('status.selectedCourseId', function(newValue, oldValue) {
      if (newValue) {
        $state.transitionTo('instructorDashboard.gameplay',
          { gameId: $scope.status.selectedGameId, courseId: newValue });
      }
    });

    _getReports();
  };


  var _populateSowo = function(data) {
    var sowo = data;
    var soTotal = 0;
    var woTotal = 0;

    if (sowo.length) {
      $scope.sowo.shoutOuts = [];
      $scope.sowo.watchOuts = [];

      // sowo count sorted by server
      // sort alpha in view
      angular.forEach(sowo, function(assessment) {
        var student = $scope.students[assessment.userId];
        student = _compileNameOfStudent(student);

        if (assessment.results.hasOwnProperty('shoutout') &&
            assessment.results.shoutout.length) {
          if (soTotal < $scope.sowo.max) {
            $scope.sowo.shoutOuts[soTotal] = {
              student: student,
              results: assessment.results['shoutout'],
              overflowText: _getOverflowText(assessment.results['shoutout']),
              order: [
                assessment.results['shoutout'].length,
                student.name
              ]
            };
            soTotal++;
          } else {
            $scope.sowo.hasOverflow = true;
          }
        }
        if (assessment.results.hasOwnProperty('watchout') &&
            assessment.results.watchout.length) {
          if (woTotal < $scope.sowo.max) {
            $scope.sowo.watchOuts[woTotal] = {
              student: student,
              results: assessment.results['watchout'],
              overflowText: _getOverflowText(assessment.results['watchout']),
              order: [
                assessment.results['watchout'].length,
                student.name
              ]
            };
            woTotal++;
          } else {
            $scope.sowo.hasOverflow = true;
          }
        }
      });

      // get max totals
      var total = Math.max(soTotal, woTotal);
      var listToBackfill = null;
      if ($scope.sowo.shoutOuts.length < total) {
        listToBackfill = $scope.sowo.shoutOuts; 
      } else if ($scope.sowo.watchOuts.length != total) {
        listToBackfill = $scope.sowo.watchOuts;
      }

      // Populate the end of the shorter array with empty records
      // so that we have an even number
      if (listToBackfill) {
        for (var i = listToBackfill.length; i < total; i++) {
          listToBackfill[i] = {
            student: {},
            results: [],
            overflowText: '',
            order: [0, '']
          };
        }
      }
    }
  };

  var _compileNameOfStudent = function(student) {
    var name = student.firstName;
    if(student.lastName) {
      name += ' ' + student.lastName + '.';
    }

    student.name = name;
    return student;
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

  _initDashboard();
});

