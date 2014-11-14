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
    $scope.reportInfo.activeHeaders = [];
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
          console.log('users,', users);
        _init();
        _populateStudentWithReportData(users,reportId);
        console.log('$scope.courses.options[$scope.courses.selectedCourseId].users', $scope.courses.options[$scope.courses.selectedCourseId].users);
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
          $scope.reportInfo.selectedGroupId = $scope.reportInfo.groups[1].id;
        }
      }

      // Get currently selected group or default to first
      $scope.reportInfo.selectedGroup = _.find($scope.reportInfo.groups,
          function (group) {
            return group.id === $scope.reportInfo.selectedGroupId;
          });

      // Get headers of currently selected group
      $scope.reportInfo.headers = (!!$scope.reportInfo.selectedGroup.headers) ? $scope.reportInfo.selectedGroup.headers : [];

      // Setup selector
      $scope.reportInfo.activeHeaders = $scope.reportInfo.headers.slice(0, 3);
      $scope.reportInfo.startIndex = 0;
      $scope.reportInfo.totalCount = $scope.reportInfo.headers.length;
    };

    /* for each user replace reportInfo with results from API */
    var _populateStudentWithReportData = function (usersReportData, reportId) {
      if (usersReportData &&
          $scope.courses &&
          $scope.courses.options &&
          $scope.courses.selectedCourseId &&
          $scope.courses.options[$scope.courses.selectedCourseId]
      ) {
        var students = $scope.courses.options[$scope.courses.selectedCourseId].users;
        angular.forEach(students, function (student) {
          var userReportData = _findUserByUserId(student.id, usersReportData) || {};
          var id = ($scope.reportInfo.selectedGroupId === "so") ? 'shoutout' : 'watchout';
          student[reportId] = userReportData.results ? (userReportData.results[id] || {}) : {};
        });
      }
    };

    var _findUserByUserId = function (userId, users) {
        var found;
        for (var i = 0; i < users.length; i++) {
            if (users[i].userId == userId) {
                 found = users[i];
            }
        }
        return found || null;
    };

      $scope.hasSOWO = function (sowo, student) {
         if (student &&
             student[reportId]&&
             sowo) {
             return _.any(student[reportId],
                 function(studentSOWO) {
                    return studentSOWO.id === sowo;
                 });
         }
         return false;
      };
      // Populates achievements selector
      $scope.selectActiveHeaders = function (activeHeaders, index) {
          $scope.reportInfo.totalCount =  $scope.reportInfo.headers.length;
              if (index < 0 || $scope.reportInfo.totalCount < index + 3) {
                  return false;
              } else {
                  $scope.reportInfo.startIndex = index;
                  $scope.reportInfo.activeHeaders = $scope.reportInfo.headers.slice(index, index + 3);
              }
      };
    //// Course Functions //////

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

      $scope.userSortFunction = function (colName) {
          return function (user) {
              if (colName === 'firstName') {
                  return user.firstName;
              }
              var hasSOWO = 0;
              if (user[reportId]) {
                  var selectedGroup = user[reportId];
                  for (var i = 0; i < selectedGroup.length; i ++) {
                      if (selectedGroup[i].title = colName) {
                          hasSOWO = true;
                      }
                  }
              }
              return hasSOWO ? 1 : 0;
          };
      };
    // Highlights currently selected column, name is the default selected column
    $scope.sortSelected = function (colName) {
        if ($scope.col[$scope.col.current]) {
            console.log($scope.col[$scope.col.current].reverse);
        }
      var columns = $scope.col;
      // check if column exists
      if (!columns[colName]) {
        columns[colName] = {};
      }
      // check if clicked column is already active
      if (columns['current'] === colName) {
        columns[colName].reverse = !!!columns[colName].reverse;
        return;
      }
      // set previous current values to false
      columns[columns.current].reverse = false;
      // set clicked column as new current and to active
      columns.current = colName;
      return;
    };

    $scope.getLabelInfo = function (label, type) {
        console.log(REPORT_CONSTANTS.legend[label]);
      return REPORT_CONSTANTS.legend[label];
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



