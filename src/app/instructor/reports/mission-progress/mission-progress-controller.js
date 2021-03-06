angular.module( 'instructor.reports')


.controller( 'MissionProgressCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGame, ReportsService, REPORT_CONSTANTS,localStorageService) {

    ///// Setup selections /////

    // Report
    var reportId = 'mission-progress';
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected = $scope.courses.options[$stateParams.courseId];
      // Games
    $scope.games.selectedGameId = defaultGame.gameId;

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

    // Check if game is premium and disabled
    if (defaultGame.price === 'Premium' && !defaultGame.assigned) {
        $scope.isGameDisabled = true;
    }

    // Check if selected game has selected report

    if (!ReportsService.isValidReport(reportId,$scope.reports.options))  {
      $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId,$scope.reports.options), {
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

    ///// Mission-Progress Functions  /////

    if(!$scope.missions) {
      $scope.missions = {};
    }

    $scope.missions.active = [];

    // Retrieve report and populate table

    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        _initMissions();
        _populateStudentMissions(users);
    });

    ///// Mission helper functions /////

    // Populates mission selector
    $scope.selectActiveMissions = function(group, index) {
      $scope.missions.totalCount = $scope.missions.options.length;
      if (index < 0 || $scope.missions.totalCount < index + 3) {
        return false;
      } else {
        $scope.missions.startIndex = index;
        $scope.missions.active = $scope.missions.options.slice(index, index + 3);
      }
    };

    // Populates report table header
    var _initMissions = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == reportId) {
          $scope.missions.options = report.table.headers;
        }
      });
      if ($scope.missions.options && $scope.missions.options.length) {
        $scope.missions.selected = $scope.missions.options[0].id;
      }
      $scope.selectActiveMissions($scope.missions.selected, 0);
      $scope.missions.selectedOption = _.find($scope.missions.options,
          function(option) {
            return option.id === $scope.missions.selected;
          });
    };

    var _populateStudentMissions = function(users) {
      if (users) {
        // Attach missions and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].missions    = user.missions;
          $scope.students[user.userId].totalTimePlayed = user.totalTimePlayed;
        });
      }
    };

    //// Course Functions  //////
    $scope.activeCourse = $scope.courses.options[$scope.courses.selectedCourseId];

    // If there are studentIds in parameters, set student's isSelected property as true
    // else set all student's isSelected property as true

    ReportsService.selectStudents($scope.activeCourse, $stateParams.stdntIds);

    $scope.isAwardedAchievement = function(activeAchv, studentId) {
      if($scope.students[studentId]) {
        var studentAchv = $scope.students[studentId].missions || [];
        for(var i = 0; i < studentAchv.length; i++) {
          if( (studentAchv[i].id === activeAchv.id) &&
              studentAchv[i].completed
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



