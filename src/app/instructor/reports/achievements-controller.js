angular.module( 'instructor.reports')

.controller( 'AchievementsCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, REPORT_CONSTANTS,localStorageService) {
    console.log('gameReports:', gameReports);
    $scope.achievements.active = [];

    // GH: Needed to fix PLAY-393, where IE requires the border-collapse property
    // of the reports table to be 'separate' instead of 'collapse'. Tried to
    // use conditional IE comments in index.html, but it doesn't work with
    // IE 10 and higher.
    $scope.isIE = function() {
      return $window.navigator.userAgent.test(/trident/i);
    };

    // Set parent scope developer info
    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }

    // Select Game, Course, and Report
    $scope.games.selected = defaultGameId;
    $scope.courses.selectedId = $stateParams.courseId;
    $scope.reports.selected = $state.current.name.split('.')[2];
    //* Reports *//
    var currentReport = $state.current.name.split('.')[2];
    // Set up report dropdown based on selected game
    $scope.reports.options = [];
    angular.forEach(gameReports.list, function(report) {
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
        // select report that matches this state
        if (currentReport === report.id) {
          $scope.reports.selected = report;
        }
      }
    });


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

    /* Retrieve the appropriate report and process the user objects */
    ReportsService.get('achievements', $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        if( !_isValidReport('achievements') ) {
          $state.transitionTo('reports.details' + '.' + _getDefaultReportId(), {
            gameId: $stateParams.gameId,
            courseId: $stateParams.courseId
          });
          return;
        }
        // initiate achievements and populate student achievements
        _initAchievements();
        _populateStudentAchievements(users);

    });

    $scope.selectActiveAchievements = function(group, index) {
      angular.forEach($scope.achievements.options, function(option) {
        if (option.id == group) {
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
        }
      });
    };

    $scope.isAwardedAchievement = function(activeAchv, studentAchv) {

      if(studentAchv) {
        for(var i = 0; i < studentAchv.length; i++) {
          // TODO: check for subgroup
          if( (studentAchv[i].item === activeAchv.id) &&
              studentAchv[i].won
            ) {
              return true;
          }
        }
      }
      return false;
    };
// is this even used?
//  $scope.getStudentResult = function(studentId, achievement) {
//    angular.forEach($scope.students, function(student) {
//      if (student.id == studentId) {
//        angular.forEach(student.achievements, function(achv) {
//          if (achv.group == achievement.group && achv.item == achievement.item) {
//            return achv.won;
//          }
//        });
//      }
//    });
//  };

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

    var _initAchievements = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == 'achievements') {
          $scope.achievements.options = report.achievements;
        }
      });

      /* Select one of the skill types (or default to the first) */
      if ($stateParams.skillsId && $stateParams.skillsId !== 'false') {
        $scope.achievements.selected = $stateParams.skillsId;
      } else {
        if ($scope.achievements.options && $scope.achievements.options.length) {
          $scope.achievements.selected = $scope.achievements.options[0].id;
        }
      }

      $scope.achievements.options = _populateAchievements($scope.achievements.options);
      $scope.selectActiveAchievements($scope.achievements.selected, 0);
      $scope.achievements.selectedOption = _.find($scope.achievements.options,
          function(option) {
            return option.id === $scope.achievements.selected;
          });
    };

    var _populateAchievements = function(reports) {
      if (reports && reports.length) {
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
      }
      return reports;
    };
    var _populateStudentAchievements = function(users) {
      if (users) {
        // Attach achievements and time played to students
        angular.forEach(users, function(user) {
          $scope.students[user.userId].achievements    = user.achievements;
          $scope.students[user.userId].totalTimePlayed = user.totalTimePlayed;
        });
      }
//      for testing
//      $scope.courses.options[110].users[1].totalTimePlayed = 200000;
//      $scope.courses.options[110].users[4].totalTimePlayed = 300000;
//      $scope.courses.options[110].users[1].totalTimePlayed = 100000;
//      $scope.courses.options[110].users[2].totalTimePlayed = 500000;
//      $scope.courses.options[110].users[1].achievements[0].won = true;
//      $scope.courses.options[110].users[7].achievements[0].won = true;
//      $scope.courses.options[110].users[6].achievements[0].won = true;
//      $scope.courses.options[110].users[2].achievements[0].won = true;
//      $scope.courses.options[110].users[5].achievements[1].won = true;
//      $scope.courses.options[110].users[4].achievements[1].won = true;
//      $scope.courses.options[110].users[7].achievements[1].won = true;
//      $scope.courses.options[110].users[2].achievements[1].won = true;
//      $scope.courses.options[110].users[3].achievements[2].won = true;
//      $scope.courses.options[110].users[6].achievements[2].won = true;
//      $scope.courses.options[110].users[8].achievements[2].won = true;
//      $scope.courses.options[110].users[2].achievements[2].won = true;
//      console.log('courses:', $scope.courses.options);
//      console.log('students', $scope.students);
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
    $scope.convertStandard = function(standard) {
       return REPORT_CONSTANTS.legend[standard];
    };

    // This function is used by the angular orderBy filter, it is iterated on each user object and returns a value to be compared against all other users. Closure allows us to add additional parameters
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

    $scope.saveState = function(key,currentState) {
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


});



