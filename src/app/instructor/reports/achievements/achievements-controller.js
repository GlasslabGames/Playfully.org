angular.module( 'instructor.reports')


.controller( 'AchievementsCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, UserService, REPORT_CONSTANTS,localStorageService) {


    ///// Setup selections /////

    // Report
    var reportId = 'achievements';
    // Courses
    $scope.courses.selectedCourseId = $stateParams.courseId;
    $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

      // Games
    $scope.games.selectedGameId = defaultGameId;

    // Get the default standard from the user
    $scope.defaultStandards = "CCSS";

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

    ///// Achievements Functions /////

    if(!$scope.achievements) {
      $scope.achievements = {};
    }

    $scope.achievements.active = [];

    // Retrieve report and populate table
    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        _initAchievements();
        _populateStudentAchievements(users);
    });

    // Populates achievements selector
    $scope.selectActiveAchievements = function(group, index) {
      var totalItems = 0;
      var list = [];
      angular.forEach($scope.achievements.options.achievements, function(option) {
        var standardAdded = false;
        angular.forEach(option.standards, function(standard) {
          // Add the achievement to the table if we haven't already
          if( !standardAdded && standard.group == group ) {
            totalItems++;
            list.push( option );
            standardAdded = true;
          }
        });
        /*if (option.id == group) {
          var totalItems = 0;
          angular.forEach(option.subGroups, function(subGroup) {
            totalItems += subGroup.items.length;
          });
          $scope.achievements.totalCount = totalItems;

          if (index < 0 || totalItems < index + 3) {
            return false;
          } else {
            $scope.achievements.startIndex = index;
            $scope.achievements.active = option.list.slice(index, index + 3);
          }
        }*/
      });
      $scope.achievements.totalCount = totalItems;
      if( index < 0 || totalItems < index + 3 ) {
        return false;
      } else {
        $scope.achievements.startIndex = index;
        $scope.achievements.active = list.slice(index, index + 3);
      }
    };

    var _populateAchievements = function(reports) {
      /*if( reports && reports.achievements && reports.achievements.length ) {
        reports.
        for( var i = 0; i < reports.achievements.length; i++ ) {
          for( var j = 0; j < reports.achievements[i].standards.length; j++ ) {
            if( reports.achievements[i].standards[j].group == $scope.achievements.selected ) {
              reports.list
            }
          }
        }
      }*/

      if( reports ) {
        // Verify if this report has the standards we're looking for, otherwise default to CCSS
        if( !reports.groups[ $scope.defaultStandards ] ) {
          $scope.defaultStandards = "CCSS";
        }
        if( reports.groups[ $scope.defaultStandards ] && reports.groups[ $scope.defaultStandards ].length ) {
          reports.mappings = {};
          for( var i = 0; i < reports.groups[ $scope.defaultStandards ].length; i++ ) {
            reports.mappings[ reports.groups[ $scope.defaultStandards ][i].id ] = {};
            for( var j = 0; j < reports.groups[ $scope.defaultStandards ][i].subGroups.length; j++ ) {
              reports.mappings[ reports.groups[ $scope.defaultStandards ][i].id ][ reports.groups[ $scope.defaultStandards ][i].subGroups[j].id ] = reports.groups[ $scope.defaultStandards ][i].subGroups[j];
            }
          }
        }
        if( reports.achievements && reports.achievements.length ) {
          for ( var k = 0; k < reports.achievements.length; k++ ) {
            for( var l = 0; l < reports.achievements[k].standards.length; l++ ) {
              // Only allow standards of the default Id to be added to the mapping
              var standardId = reports.achievements[k].standards[l].id;
              if( standardId !== $scope.defaultStandards ) {
                continue;
              }

              var group = reports.achievements[k].standards[l].group;
              var subGroup = reports.achievements[k].standards[l].subGroup;

              reports.achievements[k].standards[l].title = reports.mappings[ group ][ subGroup ].title;
              reports.achievements[k].standards[l].description = reports.mappings[ group ][ subGroup ].description;
              reports.achievements[k].standards[l].icon = reports.mappings[ group ][ subGroup ].icon;
            }
          }
        }
      }


      /*if (reports && reports.length) {
        for(var i = 0; i < reports.length; i++) {
          reports[i].list = [];
          for(var j = 0; j < reports[i].subGroups.length; j++) {
            for(var k = 0; k < reports[i].subGroups[j].items.length; k++) {
              reports[i].subGroups[j].items[k].standard = {
                title:       reports[i].subGroups[j].title,
                description: reports[i].subGroups[j].description
              };

              reports[i].list.push( reports[i].subGroups[j].items[k] );
            }
          }
        }
      }*/
      return reports;
    };

    // Populate achievements table
    var _initAchievements = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == reportId) {
          $scope.achievements.options = report.achievements;
        }
      });

      // Make sure we're accessing standards that exist for this game
      if( $scope.currentUser &&
          $scope.currentUser.defaultStandards &&
          $scope.achievements.options.groups[ $scope.currentUser.defaultStandards ] ) {
        $scope.defaultStandards = $scope.currentUser.defaultStandards;
      }

      /* Select one of the skill types (or default to the first) */
      var achvExists = _.some($scope.achievements.options.groups[ $scope.defaultStandards ], function(achievement) {
            return achievement.id === $stateParams.skillsId;
      });
      if ($stateParams.skillsId && achvExists) {
        $scope.achievements.selected = $stateParams.skillsId;
      } else {
        if ($scope.achievements.options && $scope.achievements.options.groups[ $scope.defaultStandards ].length) {
          $scope.achievements.selected = $scope.achievements.options.groups[ $scope.defaultStandards ][0].id;
        }
      }

      $scope.achievements.options = _populateAchievements($scope.achievements.options);
      $scope.selectActiveAchievements($scope.achievements.selected, 0);
      $scope.achievements.selectedOption = _.find($scope.achievements.options.groups[ $scope.defaultStandards ],
          function(option) {
            return option.id === $scope.achievements.selected;
          });
    };

    var _populateStudentAchievements = function(users) {
      if (users) {
        // Attach achievements and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].achievements    = user.achievements;
          $scope.students[user.userId].totalTimePlayed = user.totalTimePlayed;
        });
      }
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

    $scope.isAwardedAchievement = function(activeAchv, studentId) {
      if($scope.students[studentId]) {
        var studentAchv = $scope.students[studentId].achievements || [];

        for(var i = 0; i < studentAchv.length; i++) {
          if( (studentAchv[i].item === activeAchv.id) &&
            studentAchv[i].won
            ) {
            return true;
          }
        }
      }

      return false;
    };

    $scope.getLabelClass = function(icon) {
       return REPORT_CONSTANTS.legend[icon];
    };

    $scope.userSortFunction = function(colName) {
        return function(user) {
            if (colName === 'firstName') {
                return user.firstName;
            }
            if (colName === 'totalTimePlayed') {
                return user.totalTimePlayed;
            }
            // finds user's first achievement that matches our criteria
            var achievement = _.find(user.achievements, function(achv) {
                return achv.item === colName;
            });
            if (achievement) {
               if (achievement.won) {
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
      console.log(currentState);
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
    $scope.colName = { value: 'firstName' };
    $scope.isCollapsed = {value: localStorageService.get(JSON.stringify($stateParams))};
});



