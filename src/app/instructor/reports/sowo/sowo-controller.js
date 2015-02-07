angular.module( 'instructor.reports')

.filter('hasSOWO', function() {
  return function(studentList, reportType) {
    var result = _.filter(studentList, function(student) {
      return _.has(student, 'sowo') && student.sowo.length > 0;
    });
    return result;
  };
})

.controller( 'SowoCtrl',
  function($scope, $rootScope, $log, $state, $stateParams, $window, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService,defaultGameId, coursesInfo) {

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
    $scope.reportInfo.foundSowo = false;
      // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected= $scope.courses.options[$stateParams.courseId];
    // Games
    $scope.games.selectedGameId = defaultGameId;

    $scope.whatNow = {};
    $scope.whatNow.isCollapsed = false;




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
      if (!ReportsService.isValidReport(reportId, $scope.reports.options)) {
          $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId, $scope.reports.options), {
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
        _populateStudentWithReportData(users,reportId);
        // check if any students have any sowo from this game
        _findAnySOWO();
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

      // Select default whatNow
      $scope.selectWhatNow($scope.reportInfo.activeHeaders[0]);
    };

    /* for each user augment reportInfo with results from API */
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

      var _findAnySOWO = function () {
          var students = $scope.courses.options[$scope.courses.selectedCourseId].users;
          var sowoList = $scope.reportInfo.headers;
          var found = false;
          _.each(sowoList, function (sowo) {
              _.each(students, function (student) {
                  if (student[reportId]) {
                      found = _.any(student[reportId], function (studentSOWO) {
                          return studentSOWO.id === sowo.id;
                      });
                      if (found) {
                          $scope.reportInfo.foundSowo = true;
                          return false;
                      }
                  }
              });
              if (found) {
                  return false;
              }
          });
      };

      $scope.hasSOWO = function (sowo, student) {
         if (student &&
             student[reportId]&&
             sowo) {
             var found = _.any(student[reportId],
                 function(studentSOWO) {
                    return studentSOWO.id === sowo;
                 });
             if (found) {
                 return found;
             }
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
        var studentIds = ReportsService.getSelectedStudentIds(activeCourse);
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
      var result = REPORT_CONSTANTS.legend[label];
      /* Check whether WO removal feature is enabled */
      if (label == 'wo' && !!$rootScope.features.canRemoveWO) {
        result += ' gl-reports-wo-icon--removable';
      }
      return result;
    };

    $scope.removeWO = function(sowoId, student) {
      if (sowoId.indexOf('wo') !== 0) { return false; }
      // Need to hook this up to a service.
      $window.alert('Remove ' + sowoId + ' for ' + student.firstName);
      ReportsService.removeWatchOut(student.id, $scope.games.selectedGameId, sowoId);
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

    $scope.selectWhatNow = function (wo) {
      var targetWo = _.find($scope.reportInfo.headers, {'title': wo.title});
      $scope.whatNow.selected = targetWo;
    };

    $scope.col = {firstName: {reverse: false}, totalTimePlayed: {}, current: 'firstName'};
    $scope.colName = {value: 'firstName'};
    $scope.isCollapsed = {value: localStorageService.get(JSON.stringify($stateParams))};



});



