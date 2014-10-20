angular.module( 'instructor.reports')


.controller( 'MissionProgressCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, REPORT_CONSTANTS,localStorageService) {
    if(!$scope.achievements) {
      $scope.achievements = {};
    }

    $scope.achievements.active = [];
    // Select course in params
    $scope.courses.selectedId = $stateParams.courseId;
    // Select game
    $scope.games.selected = defaultGameId;

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

    ////// Achievements functions //////////////

    $scope.selectActiveAchievements = function(group, index) {
      $scope.achievements.totalCount = $scope.achievements.options.length;
      if (index < 0 || $scope.achievements.totalCount < index + 3) {
        return false;
      } else {
        $scope.achievements.startIndex = index;
        $scope.achievements.active = $scope.achievements.options.slice(index, index + 3);
      }
          console.log($scope.achievements.active);

    };

    var _initAchievements = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == 'mission-progress') {
          $scope.achievements.options = report.table.headers;
        }
      });
      /* Select one of the skill types (or default to the first) */
      var achvExists = _.some($scope.achievements.options, function(achievement) {
            return achievement.id === $stateParams.skillsId;
      });
      if ($stateParams.skillsId && achvExists) {
        $scope.achievements.selected = $stateParams.skillsId;
      } else {
        if ($scope.achievements.options && $scope.achievements.options.length) {
          $scope.achievements.selected = $scope.achievements.options[0].id;
        }
      }

      $scope.selectActiveAchievements($scope.achievements.selected, 0);
      $scope.achievements.selectedOption = _.find($scope.achievements.options,
          function(option) {
            return option.id === $scope.achievements.selected;
          });
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

    var _populateStudentAchievements = function(users) {
      if (users) {
        // Attach achievements and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].missions    = user.missions;
          $scope.students[user.userId].totalTimePlayed = user.totalTimePlayed;
        });
      }
    };

    /* Retrieve the appropriate report and process the user objects */
    ReportsService.get('mission-progress', $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        if( !_isValidReport('mission-progress') ) {
          $state.transitionTo('reports.details' + '.' + _getDefaultReportId(), {
            gameId: $stateParams.gameId,
            courseId: $stateParams.courseId
          });
          return;
        }
        console.log('users: ', users);
        // initiate achievements and populate student achievements
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
      var activeCourse = $scope.courses.options[$scope.courses.selectedId];
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
      var activeCourse = $scope.courses.options[$scope.courses.selectedId];
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
            if (!mission.completed) {
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



