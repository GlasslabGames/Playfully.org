angular.module( 'instructor.reports')

.controller( 'SowoCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService,defaultGameId, coursesInfo) {

    ///// Setup selections /////

    // Report
    var reportId = 'sowo';
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    // Games
    $scope.games.selectedGameId = defaultGameId;

    ///// Setup options /////

    // Games

    $scope.games.options = {};
    angular.forEach(myGames, function(game) {
        $scope.games.options[''+game.gameId] = game;
    });

    // Reports

    $scope.reports.options = [];
    angular.forEach(gameReports.list, function(report) {
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
        // select report that matches this state
        if (reportId === report.id) {
          $scope.reports.selected = report;
        }
      }
    });

    // Check if game has selected report

    if (!ReportsService.isValidReport(reportId,$scope.reports.options))  {
      var yeah = ReportsService.getDefaultReportId(reportId,$scope.reports.options);
      $state.transitionTo('reports.details' + '.' + yeah, {
        gameId: $stateParams.gameId,
        courseId: $stateParams.courseId
      });
      return;
    }

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

    ///// SOWO functions /////

   // Retrieve report and populate table

    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        _resetSowo();
        _populateSowo(users);
    });

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

    // Select Course students

    $scope.activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];

    // If there are studentIds in parameters, set student's isSelected property as true
    // else set all student's isSelected property as true

    ReportsService.selectStudents($scope.activeCourse, $stateParams.stdntIds);

    $scope.getSelectedStudents = function() {
      var activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];
      if (activeCourse.isPartiallySelected) {
        studentIds = ReportsService.getSelectedStudentIds(activeCourse);
        return studentIds.length > 0 ? studentIds : null;
      } else {
        return null;
      }
    };




});



