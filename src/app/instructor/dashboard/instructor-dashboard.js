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
  function ( $scope, $location, $log, courses, games, myGames, GamesService, ReportsService) {

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

    $scope.reports = {
      isOpen: false,
      selected: null,
      options: []
    };

    $scope.myGames = myGames;
    $scope.games = games;
    $scope.status = { 
      selectedOption: findFirstValidGame(games),
      selectedCourse: findFirstValidCourse(courses)
    };

    function findFirstValidGame(games) {
      // find first "valid" game (not archived)
      for(var i = 0; i < games.length; i++) {
        if(games[i].enabled) {
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
          return courses[i];
        }
      }

      return null;
    }

    // TODO: get report details


    $scope.goToReports = function() {
      // $scope.status.selectedCourse.id
      // $scope.status.selectedOption.gameId
      //console.log("selectedCourse:", $scope.status.selectedCourse.id);
      //console.log("gameId:", $scope.status.selectedOption.gameId);

      // use current course and current game
      //$location.path('/reports/sowo/course/93/game/AA-1');
      $location.path('/reports');
    };

    $scope.getTimes = function(n) { return new Array(n); };

    $scope.$watch('status.selectedCourse', function(newValue, oldValue) {
      // TODO: need to check if gameId in couse
      GamesService.getAllReports($scope.status.selectedOption.gameId)
        .then(function(data) {
          _resetSowo();

          if (data.list && data.list.length) {
            $scope.reports.options = data.list;

            // find sowo
            $scope.reports.selected = null;
            for(var i = 0; i < data.list.length; i++) {
              if(data.list[i].id == 'sowo') {
                $scope.reports.selected = data.list[i];
                break; // exit loop
              }
            }

            if($scope.reports.selected) {
              ReportsService.get($scope.reports.selected.id, $scope.status.selectedOption.gameId, newValue.id)
                .then(function(data) {
                  //$log.info(data);
                  _populateSowo(data);
                }, function(data) {
                  $log.error(data);
                });
            }
          }
        });
    });

    var _resetSowo = function() {
      $scope.sowo = {
        shoutOuts: null,
        watchOuts: null,
        // set max rows for SOWO
        max:       7,
        // to display show more button
        hasOverflow: false
      };
    };

    var _populateSowo = function(data) {
      var sowo = data;
      var soTotal = 0;
      var woTotal = 0;

     if (sowo.length) {
        // pre fill data
        $scope.sowo.shoutOuts = [];
        $scope.sowo.watchOuts = [];
        for(var i = 0; i < $scope.sowo.max; i++) {
          $scope.sowo.shoutOuts[i] = {
            student: {},
            results: [],
            overflowText: "",
            order: [0, ""]
          };
          $scope.sowo.watchOuts[i] = {
            student: {},
            results: [],
            overflowText: "",
            order: [0, ""]
          };
        }

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
      }

      // get max totals
      var total = Math.max(soTotal, woTotal);
      // if totals less then max, trim array of empties
      if( total &&
          total < $scope.sowo.max) {
        // trim array

        $scope.sowo.shoutOuts.splice(total, $scope.sowo.shoutOuts.length - total);
        $scope.sowo.watchOuts.splice(total, $scope.sowo.watchOuts.length - total);
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
});


