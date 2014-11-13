angular.module( 'instructor.reports')

.controller( 'SowoCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService,defaultGameId, coursesInfo) {

    ///// Setup selections /////

    // Report
    var reportId = 'sowo';

    if (!$scope.reportInfo) {
      $scope.reportInfo = {};
    }
    $scope.reportInfo.groups = [];
    $scope.reportInfo.selectedGroup = {};
    $scope.reportInfo.selectedGroupId = null;
    $scope.reportInfo.headers = [];
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected= $scope.courses.options[$stateParams.courseId];
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
      var id = ReportsService.getDefaultReportId(reportId,$scope.reports.options);
      $state.transitionTo('reports.details' + '.' + id, {
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
        _init();
        _resetSowo();
        _populateSowo(users);
    });
    var _init = function () {

      // Get both groups, shoutout and watchout
      angular.forEach(gameReports.list, function (report) {
        if (report.id == reportId) {
          $scope.reportInfo.groups = (!!report.table.groups) ? angular.copy(report.table.groups) : [];
        }
      });

      // Get currently selectedGroupId
      if ($stateParams.skillsId && $stateParams.skillsId !== 'false') {
        $scope.reportInfo.selectedGroupId = $stateParams.skillsId;
      } else {
        if ($scope.reportInfo.groups && $scope.reportInfo.groups.length) {
          $scope.reportInfo.selectedGroupId = $scope.reportInfo.groups[0].id;
        }
      }

      // Get currently selected group or default to first
      $scope.reportInfo.selectedGroup = _.find($scope.reportInfo.groups,
          function (group) {
            return group.id === $scope.reportInfo.selectedGroupId;
          });

      // Get headers of currently selected group
      $scope.reportInfo.headers = (!!$scope.reportInfo.selectedGroup.headers) ? $scope.reportInfo.selectedGroup.headers : [];

    };
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
    // Highlights currently selected column, name is the default selected column
    $scope.sortSelected = function (colName) {

      var columns = $scope.col;
      // check if column exists
      if (!columns[colName]) {
        columns[colName] = {};
      }
      // check if clicked column is already active
      if (columns['current'] === colName) {
        columns[colName].reverse = !columns[colName].reverse;
        return;
      }
      // set previous current values to false
      columns[columns.current].reverse = false;
      // set clicked column as new current and to active
      columns.current = colName;
      return;
    };

    $scope.saveState = function (currentState) {
      var key = JSON.stringify($stateParams);
      if (localStorageService.isSupported) {
        if (currentState) {
          localStorageService.remove(key);
        } else {
          localStorageService.set(key, true);
        }
      }
    };

    $scope.col = {firstName: {reverse: false}, totalTimePlayed: {}, current: 'firstName'};
    $scope.colName = {value: 'firstName'};
    $scope.isCollapsed = {value: localStorageService.get(JSON.stringify($stateParams))};

});



