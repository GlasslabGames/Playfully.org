angular.module( 'instructor.reports')


.controller( 'MissionProgressCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, REPORT_CONSTANTS,localStorageService) {
    if(!$scope.missions) {
      $scope.missions = {};
    }
    $scope.missions.active = [];
    // Select course in params
    $scope.courses.selectedCourseId = $stateParams.courseId;
    // Select game
    $scope.games.selectedGameId = defaultGameId;
    // Set current Report
    var reportId = 'mission-progress';

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
      $state.transitionTo('reports.details' + '.' + ReportsService.getDefaultReportId(reportId,$scope.reports.options), {
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

    ////// Achievements functions //////////////

    $scope.selectActiveMissions = function(group, index) {
      $scope.missions.totalCount = $scope.missions.options.length;
      if (index < 0 || $scope.missions.totalCount < index + 3) {
        return false;
      } else {
        $scope.missions.startIndex = index;
        $scope.missions.active = $scope.missions.options.slice(index, index + 3);
      }
    };

    var _initAchievements = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == reportId) {
          $scope.missions.options = report.table.headers;
        }
      });
      /* Select one of the skill types (or default to the first) */
      var achvExists = _.some($scope.missions.options, function(achievement) {
            return achievement.id === $stateParams.skillsId;
      });
      if ($stateParams.skillsId && achvExists) {
        $scope.missions.selected = $stateParams.skillsId;
      } else {
        if ($scope.missions.options && $scope.missions.options.length) {
          $scope.missions.selected = $scope.missions.options[0].id;
        }
      }

      $scope.selectActiveMissions($scope.missions.selected, 0);
      $scope.missions.selectedOption = _.find($scope.missions.options,
          function(option) {
            return option.id === $scope.missions.selected;
          });
    };

    var _populateStudentAchievements = function(users) {
      if (users) {
        // Attach missions and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].missions    = user.missions;
          $scope.students[user.userId].totalTimePlayed = user.totalTimePlayed;
        });
      }
    };

    /* Retrieve the appropriate report and process the user objects */
    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        // initiate missions and populate student missions
        _initAchievements();
        _populateStudentAchievements(users);
    });

    //// Course Functions //////

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

    var _getSelectedStudentIdsFromCourse = function(course) {
      var studentIds = [];
      angular.forEach(course.users, function(student) {
        if (student.isSelected) {
          studentIds.push(student.id);
        }
      });
      return studentIds;
    };

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

    $scope.isAwardedAchievement = function(activeAchv, studentId) {
      if($scope.students[studentId]) {
        var studentAchv = $scope.students[studentId].missions || [];
        for(var i = 0; i < studentAchv.length; i++) {
          if( (studentAchv[i].id === activeAchv.id) &&
              studentAchv[i].completed
//            studentAchv[i].won
            ) {
            var numberOfStars = studentAchv[i].data.score.stars;
            return parseInt(numberOfStars);
          }
        }
      }

      return false;
    };


    $scope.userSortFunction = function(colName) {
    // an iterator applied on each user object
        return function(user) {

            if (colName === 'firstName') {
                return user.firstName;
            }
            if (colName === 'totalTimePlayed') {
                return user.totalTimePlayed;
            }
            // finds user's first mission that matches our criteria
            var mission = _.find(user.missions, function(mission) {
                return mission.linkText === colName;
            });
            if (!mission ||
                !mission.completed) {
                return 0;
            }
            var numberOfStars = mission.data.score.stars;
            if (numberOfStars) {
               return parseInt(numberOfStars);
            }
        };
    };
    // Highlights currently selected column, name is the default selected column
    $scope.highLightSelected = function(colName) {

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
    $scope.colName = {value:'firstName'};
    $scope.isCollapsed = {value: localStorageService.get(JSON.stringify($stateParams))};
});



