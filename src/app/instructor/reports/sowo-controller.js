angular.module( 'instructor.reports')

.controller( 'SowoCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService,defaultGameId, coursesInfo) {

    // Select course in params
    $scope.courses.selectedCourseId = $stateParams.courseId;
    // Select game
    $scope.games.selectedGameId = defaultGameId;

    // Games - Setup games options

    $scope.games.options = {};
    angular.forEach(myGames, function(game) {
        $scope.games.options[''+game.gameId] = game;
    });

    // Reports - Setup reports options

    $scope.reports.options = [];
    var currentReport = $state.current.name.split('.')[2];
    angular.forEach(gameReports.list, function(report) {
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
        // select report that matches this state
        if (currentReport === report.id) {
          $scope.reports.selected = report;
        }
      }
    });

    // Set parent scope developer info

    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }

    // GH: Needed to fix PLAY-393, where IE requires the border-collapse property
    // of the reports table to be 'separate' instead of 'collapse'. Tried to
    // use conditional IE comments in index.html, but it doesn't work with
    // IE 10 and higher.
    $scope.isIE = function() {
      return $window.navigator.userAgent.test(/trident/i);
    };

   ///////// SOWO functions ///////////////////

    var _resetSowo = function() {
      $scope.sowo = {
        shoutOuts: [],
        watchOuts: [],
        // to display show more button
        hasOverflow: false
      };
    };

    //  _populateSowo helper functions

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

    var _getSelectedStudentIdsFromCourse = function(course) {
      var studentIds = [];
      angular.forEach(course.users, function(student) {
        if (student.isSelected) {
          studentIds.push(student.id);
        }
      });
      return studentIds;
    };

    //  Populates Shoutout Watchout

    var _populateSowo = function(data) {
      var sowo = data;
      var soTotal = 0;
      var woTotal = 0;
      var total = 0;

      if (sowo.length) {
        // calc total columns
        angular.forEach(sowo, function(assessment) {
          if (assessment.results.hasOwnProperty('shoutout') &&
            assessment.results.shoutout.length) {
            soTotal++;
          }
          if (assessment.results.hasOwnProperty('watchout') &&
            assessment.results.watchout.length) {
            woTotal++;
          }
        });
        total = Math.max(soTotal, woTotal);

        // pre fill data
        $scope.sowo.shoutOuts = [];
        $scope.sowo.watchOuts = [];
        for(var i = 0; i < total; i++) {
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
        soTotal = 0;
        woTotal = 0;
        angular.forEach(sowo, function(assessment) {
          var student = $scope.students[assessment.userId];
          student = _compileNameOfStudent(student);

          if (assessment.results.hasOwnProperty('shoutout') &&
            assessment.results.shoutout.length) {
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
          }
          if (assessment.results.hasOwnProperty('watchout') &&
            assessment.results.watchout.length) {
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
          }
        });
      }
    };

    // helper functions

    var _isValidReport = function(reportId){
      for(var i = 0; i < $scope.reports.options.length; i++) {
        if($scope.reports.options[i].id === reportId) {
          return true;
        }
      }
      return false;
    };

    var _getDefaultReportId = function() {
      if( $scope.reports.options &&
          $scope.reports.options[0] &&
          $scope.reports.options[0].id) {
        return $scope.reports.options[0].id;
      } else {
        return "sowo";
      }
    };

    // Get SOWO reports
    ReportsService.get('sowo', $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        if( !_isValidReport('sowo') ) {
          $state.transitionTo('reports.details' + '.' + _getDefaultReportId(), {
            gameId: $stateParams.gameId,
            courseId: $stateParams.courseId
          });
          return;
        }
        _resetSowo();
        _populateSowo(users);
    });

    // Select Course students

    /**
     * If there is a stdntIds parameter, parse the ids and select the
     * individual students accordingly. Otherwise select all students.
     **/

    var _selectStudents = function() {
      var selectedStudents = null;
      var activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];
      if ($stateParams.stdntIds) {
        selectedStudents = $stateParams.stdntIds.split(',');
      }
      angular.forEach(activeCourse.users, function(student) {
        if (selectedStudents && selectedStudents.indexOf(''+student.id) < 0) {
          student.isSelected = false;
          activeCourse.isPartiallySelected = true;
          activeCourse.isExpanded = true;
        } else {
          student.isSelected = true;
        }
      });
    };
    _selectStudents();

    $scope.getSelectedStudents = function() {
      var activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];
      if (activeCourse.isPartiallySelected) {
        studentIds = _getSelectedStudentIdsFromCourse(activeCourse);
        if (studentIds.length > 0) {
          return studentIds;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };




});



