angular.module( 'instructor.reports')


.controller( 'CompetencyCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, defaultGameId, ReportsService, REPORT_CONSTANTS, localStorageService) {

    var reportId = 'competency';

    if(!$scope.comps) {
      $scope.comps = {};
    }

    $scope.comps.active = [];
    // Select course in params
    $scope.courses.selectedId = $stateParams.courseId;
    // Select game
    $scope.games.selected = defaultGameId;
    //
    $scope.comps.standards = {};

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

    ////// Comps functions //////////////

    $scope.selectActiveComps = function(group, index) {
      angular.forEach($scope.comps.options, function(option) {
        if (option.id == group) {
          var totalItems = 0;
          angular.forEach(option.subGroups, function(subGroup) {
            totalItems += subGroup.items.length;
          });
          $scope.comps.totalCount = totalItems;

          if (index < 0 || totalItems < index + 3) {
            return false;
          } else {
            $scope.comps.startIndex = index;
            $scope.comps.active = option.list.slice(index, index + 3);
          }
        }
      });
    };

    var _populateComps = function(reports) {
      if (reports && reports.length) {
        for(var i = 0; i < reports.length; i++) {
          reports[i].list = [];
          for(var j = 0; j < reports[i].variant.length; j++) {
            for(var k = 0; k < reports[i].variant[j].levels.length; k++) {
              reports[i].variant[j].levels[k].standard = {
                title:       reports[i].variant[j].title,
                description: reports[i].variant[j].description
              };

              reports[i].list.push( reports[i].variant[j].levels[k] );
            }
          }
        }
      }
      return reports;
    };

    var _initComps = function() {
      angular.forEach(gameReports.list, function(report) {

        if (report.id == reportId) {
          // prep data for display, copy data in root of report to each child so it can access it there
          $scope.comps.options   = angular.copy(report.competency);
          $scope.comps.standards = angular.copy(report.levels);

          angular.forEach($scope.comps.options, function(competency) {
            competency.variant = angular.copy(report.variant);
          });
        }
      });
      //console.log("competency:", $scope.comps.options);

      /* Select one of the skill types (or default to the first) */
      if ($stateParams.skillsId && $stateParams.skillsId !== 'false') {
        $scope.comps.selected = $stateParams.skillsId;
      } else {
        if ($scope.comps.options && $scope.comps.options.length) {
          $scope.comps.selected = $scope.comps.options[0].id;
        }
      }

      //$scope.comps.options = _populateComps($scope.comps.options);
      $scope.selectActiveComps($scope.comps.selected, 0);
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

    var _populateStudentComps = function(users) {
      if (users) {
        console.log("competency users:", users);
        // Attach comps and time played to students
        angular.forEach(users, function(user) {
          if(user) {
            $scope.students[user.userId].comps = user.results;
          }
        });
      }
    };

    /* Retrieve the appropriate report and process the user objects */
    ReportsService.get(reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(users) {
        if( !_isValidReport(reportId) ) {
          $state.transitionTo('reports.details' + '.' + _getDefaultReportId(), {
            gameId: $stateParams.gameId,
            courseId: $stateParams.courseId
          });
          return;
        }
        // initiate comps and populate student comps
        _initComps();
        _populateStudentComps(users);
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

    $scope.isAwardedComp = function(active, student) {
      if(student) {
        for(var i = 0; i < student.length; i++) {
          // TODO: check for subgroup
          if( (student[i].item === active.id) &&
              student[i].won
            ) {
              return true;
          }
        }
      }
      return false;
    };

    $scope.convertStandard = function(standard) {
       return REPORT_CONSTANTS.legend[standard];
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



