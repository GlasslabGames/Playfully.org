angular.module( 'instructor.reports')

/**
   Students are scored on a 3-point scale for each mission.
     0: actual reasoning
     1: reasoning with one factor (univariate)
     2: reasoning with multiple factors (multivariate)

   Dot for Univariate column:
     IF score = 0, red
     IF score = 1, green
     IF score = 2, green
     IF no score yet, gray

   Dot for Multivariate column:
     IF score = 0, red
     IF score = 1, red
     IF score = 2, green
     IF no score yet, gray
*/

.controller( 'CompetencyCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, REPORT_CONSTANTS, localStorageService) {

    var reportId = 'competency';

    if(!$scope.reportInfo) {
      $scope.reportInfo = {};
    }

    // reset to empty
    $scope.reportInfo.selectedGroupId = null;
    $scope.reportInfo.labels  = [];
    $scope.reportInfo.headers = [];
    $scope.reportInfo.groups  = [];

    // Select course in params
    $scope.courses.selectedCourseId = $stateParams.courseId;
    // Select game
    $scope.games.selectedGameId = defaultGameId;
    // Set current Report

    // Games - Setup games options
    $scope.games.options = {};
    angular.forEach(myGames, function(game) {
        $scope.games.options[''+game.gameId] = game;
    });

    // Reports - Setup reports options
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
      $state.transitionTo('reports.details' + '.' + ReportsService.getDefaultReportId(reportId,   $scope.reports.options), {
        gameId: $stateParams.gameId,
        courseId: $stateParams.courseId
      });
      return;
    }

    // Set parent scope developer info
    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }

    ////// Comps functions //////////////

    /* Retrieve the appropriate report and process the user objects */
    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(usersReportData) {

        // initiate and populate student data
        _init();
        _populateStudentWithReportData(usersReportData, reportId);
    });

    var _init = function() {
      angular.forEach(gameReports.list, function(report) {

        if (report.id == reportId) {
          // save report table info into reportInfo table
          $scope.reportInfo.labels  = (!!report.table.labels)  ? angular.copy(report.table.labels)  : [];
          $scope.reportInfo.headers = (!!report.table.headers) ? angular.copy(report.table.headers) : [];
          $scope.reportInfo.groups  = (!!report.table.groups)  ? angular.copy(report.table.groups)  : [];
        }
      });

      /* Select one of the group types (or default to the first) */
      if ($stateParams.skillsId && $stateParams.skillsId !== 'false') {
        $scope.reportInfo.selectedGroupId = $stateParams.skillsId;
      } else {
        if ($scope.reportInfo.groups && $scope.reportInfo.groups.length) {
          $scope.reportInfo.selectedGroupId = $scope.reportInfo.groups[0].id;
        }
      }
    };

    /* for each user replace reportInfo with results from API */
    var _populateStudentWithReportData = function(usersReportData, reportId) {
      if ( usersReportData &&
           $scope.courses &&
           $scope.courses.options &&
           $scope.courses.selectedCourseId &&
           $scope.courses.options[$scope.courses.selectedCourseId]
        ) {
        var students = $scope.courses.options[$scope.courses.selectedCourseId].users;
        angular.forEach(students, function(student) {
          //console.log("usersReportData:", usersReportData);
          var userReportData = _findUserByUserId(student.id, usersReportData) || {};
          var columns = _processUsersReportData(userReportData.results || {});

          student[reportId] = columns;
        });
      }
    };

    // find user
    var _findUserByUserId = function(userId, users){
      for(var i = 0; i < users.length; i++) {
        if( users[i] &&
            userId == users[i].userId) {
          return users[i];
        }
      }
      return null;
    };

    var _processUsersReportData = function(usersReportData){
      var columns = angular.copy($scope.reportInfo.headers);

      // for each column
      angular.forEach(columns, function(col) {
        // add column meta info
        /*
          Dot for Univariate column:
           IF score = 0, not-mastered
           IF score = 1, mastered
           IF score = 2, mastered
           IF no score yet, not-enough-info

          Dot for Multivariate column:
           IF score = 0, not-mastered
           IF score = 1, not-mastered
           IF score = 2, mastered
           IF no score yet, not-enough-info
        */

        col.groups = {};

        // for each group in each column
        angular.forEach($scope.reportInfo.groups, function(group) {
          col.groups[group.id] = {};

          // default not-enough-info (user might not have any report data
          col.groups[group.id].level = 'not-enough-info';

          // for each user report data, determine what level
          angular.forEach(usersReportData, function(item, key) {
            if(key == group.id) {
              if(item.level === 0) {
                col.groups[group.id].level = 'not-mastered';
              }
              else if(item.level === 1) {
                col.groups[group.id].level = (col.id === 'uni') ? 'mastered' : 'not-mastered';
              }
              else if(item.level === 2) {
                col.groups[group.id].level = 'mastered';
              }
            }
          });
        });
      });

      return columns;
    };

    //// Course Functions //////

    // Select Course students

    $scope.activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];

    // If there are studentIds in parameters, set student's isSelected property as true
    // else set all student's isSelected property as true

    ReportsService.selectStudents($scope.activeCourse, $stateParams.stdntIds);

    $scope.getSelectedStudents = function(activeCourse) {
      if (activeCourse.isPartiallySelected) {
        studentIds = ReportsService.getSelectedStudentIds(activeCourse);
        if (studentIds.length > 0) {
          return studentIds;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    $scope.getLabelClass = function(label) {
        return REPORT_CONSTANTS.legend[label];
    };

    $scope.userSortFunction = function(colName) {
        return function(user) {

            if (colName === 'firstName') {
                return user.firstName;
            }
            if (colName === 'totalTimePlayed') {
                return user.totalTimePlayed;
            }
            // finds user's first comp that matches our criteria
            var comp = _.find(user.comps, function(a) {
                return a.item === colName;
            });
            if (comp) {
               if (comp.won) {
                   return 1;
               } else {
                   return 0;
               }
            } else {
                return 0;
            }
        };
    };
    // Highlights currently selected column, name is the default selected column
    $scope.sortSelected = function(colName) {

        var columns = $scope.col;
        // check if column exists
        if (!columns[colName]) {
          columns[colName] = {};
        }
        // check if clicked column is already active
        if (columns['current'] === colName) {
            columns[colName].reverse = !columns[colName].reverse;
//            console.log(columns[column]);
            return;
        }
        // set previous current values to false
        columns[columns.current].reverse = false;
        // set clicked column as new current and to active
        columns.current = colName;
        return;
    };

    $scope.saveState = function(currentState) {
      var key = JSON.stringify($stateParams);
      if (localStorageService.isSupported) {
        if (currentState) {
          localStorageService.remove(key);
        } else {
          localStorageService.set(key, true);
        }
      }
    };

    $scope.col = {firstName: {reverse:false}, totalTimePlayed: {}, current: 'firstName'};
    $scope.colName = {};
    $scope.isCollapsed = {value: localStorageService.get(JSON.stringify($stateParams))};

});



