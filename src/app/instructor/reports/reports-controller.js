angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router',
  'reports',
  'courses',
  'stickyNg'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'reports', {
    abstract: true,
    url: '/reports',
    views: {
      main: {
        templateUrl: 'instructor/reports/reports.html',
        controller: 'ReportsCtrl'
      }
    },
    resolve: {
      activeCourses: function(CoursesService) {
        return CoursesService.getActiveEnrollmentsWithStudents();
      },
      myGames: function(GamesService) {
          return GamesService.getMyGames();
      },
      defaultGame: function($stateParams, myGames) {
        if (myGames[0]) {
           return myGames[0].gameId;
        }
        return;
      },
      gameReports: function(GamesService, myGames) {
        if (myGames[0]) {
           return GamesService.getAllReports(myGames[0].gameId);
        }
        return {};
      }
    },
    data: {
      authorizedRoles: ['instructor','admin'],
      pageTitle: 'Reports'
    }
  })

  /**
   * If the user navigates the default Reports route, we need to choose
   * the first game and first course.
   **/
  .state('reports.default', {
    url: '',
    controller: function($scope, $state, $log, defaultGame, activeCourses, gameReports) {
      if (activeCourses.length) {
        $state.transitionTo('reports.details', {
          reportId: $scope.reports.options[0].id,
          gameId: defaultGame,
          courseId: activeCourses[0].id
        });
      }
    },
    data: {
      authorizedRoles: ['instructor','admin'],
      pageTitle: 'Reports'
    }
  })

  .state( 'reports.details', {
    url: '/:reportId/game/:gameId/course/:courseId?skillsId&stdntIds',
    templateUrl: function($stateParams) {
      return 'instructor/reports/' + $stateParams.reportId + '.html';
    },
    resolve: {
      gameReports: function($stateParams, GamesService) {
        return GamesService.getAllReports($stateParams.gameId);
      }
    },
    controller: 'ReportsDetailCtrl'
  });
})

.controller( 'ReportsCtrl',
  function($scope, $log, $state, $stateParams, myGames, activeCourses, defaultGame, gameReports) {

    /* Games */

    $scope.games = {
      isOpen: false,
      selected: null,
      options: {}
    };
    /* Set up active games in the games list */
    angular.forEach(myGames, function(game) {
      if (game.enabled) {
        $scope.games.options[''+game.gameId] = game;
        if (game.gameId == $stateParams.gameId) {
          $scope.games.selected = game.gameId;
        }
      }
    });

    $scope.developer = {};

    /* Courses */

    $scope.activeCourses = activeCourses;
    $scope.courses = { selectedId: null, options: {} };
    if (activeCourses.length) {
      $scope.courses.selectedId = activeCourses[0].id;
    }
    /* Set up active courses for this instructor */
    angular.forEach(activeCourses, function(course) {
      course.isExpanded = false;
      course.isPartiallySelected = false;
      $scope.courses.options[course.id] = course;
    });

    $scope.selectCourse = function($event, courseId) {
      $event.preventDefault();
      $event.stopPropagation();
      var newState = {
        reportId: $scope.reports.selected.id,
        gameId: $scope.games.selected,
        courseId: courseId
      };
      if ($scope.achievements.selected) {
        newState.skillsId = $scope.achievements.selected;
      }
      _clearOtherCourses(courseId);
      $state.transitionTo('reports.details', newState);
    };


    // Reset all classes and their students except for the id passed in
    // (which should be the newly-selected course.
    var _clearOtherCourses = function(exceptedCourseId) {
      angular.forEach($scope.courses.options, function(course) {
        if (course.id != exceptedCourseId) {
          angular.forEach(course.users, function(student) {
            student.isSelected = false;
          });
          course.isPartiallySelected = false;
        }
      });
    };

    /**
     * Initialize achievements in this parent scope so that it's available
     * to the selectCourse method above (was previously in reports.details).
     **/
    $scope.achievements = {};


    /* Reports */

    $scope.reports = {
      isOpen: false,
      selected: null,
      options: []
    };

    // Set up Reports dropdown based on reports available to
    // the selected Game.
    angular.forEach(gameReports.list, function(report) {
      // only add enabled reports
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
      }
    });
    // select first if on exists
    if($scope.reports.options.length) {
      $scope.reports.selected = $scope.reports.options[0];
    }


    /* Students */

    $scope.students = {};

    angular.forEach(activeCourses, function(course) {
      angular.forEach(course.users, function(student) {
        if (!$scope.students.hasOwnProperty(student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });

    /* Allow individual students to be toggled on or off. */
    $scope.toggleStudent = function($event, student, course) {
      $event.preventDefault();
      $event.stopPropagation();
      // Students are not selectable for Shout Out / Watch Out
      if ($scope.reports.selected && $scope.reports.selected.id == 'sowo') {
        return false;
      }
      // For now, don't allow students in unselected courses to be selected
      // TODO: Maybe figure out a way to update course and select student via
      // the URL?
      if (course.id != $scope.courses.selectedId) {
        return false;
        // $scope.selectCourse($event, course.id);
      }

      student.isSelected = !student.isSelected;
      course.isPartiallySelected = false;

      /* If any students are not selected, set isPartiallySelected to true */
      angular.forEach(course.users, function(student) {
        if (!student.isSelected) {
          course.isPartiallySelected = true;
        }
      });
    };


    $scope.toggleDropdown = function($event, collection) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[collection].isOpen = !$scope[collection].isOpen;
    };
})






.controller( 'ReportsDetailCtrl',
  function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService) {

    // First, let's make sure the requested game is okay for them to see.
    var requestedGameOK = false;
    angular.forEach(myGames, function(game) {
      if (game.gameId == $stateParams.gameId) {
        requestedGameOK = true;
      }
    });
    if (!requestedGameOK) { $state.transitionTo('reports.default'); }
    
    // Reflect report selections from URL
    $scope.games.selected = $stateParams.gameId;
    $scope.courses.selectedId = $stateParams.courseId;

    // Set parent scope developer info
    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }


    //* Reports */

    // Set up Reports dropdown based on reports available to
    // the selected Game.
    $scope.reports.options = [];
    angular.forEach(gameReports.list, function(report) {
      // only add enabled reports
      if(report.enabled) {
        $scope.reports.options.push( angular.copy(report) );
      }
    });

    // find selected report
    $scope.reports.selected = null;
    for(var r in $scope.reports.options) {
      if ($scope.reports.options[r].id === $stateParams.reportId) {
        $scope.reports.selected = $scope.reports.options[r];
        break;
      }
    }

    // select if report not select, and options then select first one
    if( !$scope.reports.selected &&
         $scope.reports.options.length) {
      $scope.reports.selected = $scope.reports.options[0];
    }

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

    // var preselectedStudents = 
    // angular.forEach($scope.courses.options[$scope.courses.selectedId].users,
    //   function(student) {
    //     if ($stateParams.stdntIds && $stateParams.stdntIds.indexOf(student.id) < 0) {
    //       student.isSelected = false;
    //       $scope.courses.options[$scope.courses.selectedId].isPartiallySelected = true;
    //     }
    //     else {
    //       student.isSelected = true; 
    //     }
    //   }
    // );

    /* Retrieve the appropriate report and process the data */
    ReportsService.get($stateParams.reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(data) {

        if( !_isValidReport($stateParams.reportId) ) {
          $state.transitionTo('reports.details', {
            reportId: _getDefaultReportId(),
            gameId: $stateParams.gameId,
            courseId: $stateParams.courseId
          });
          return;
        }

        if ($stateParams.reportId == 'sowo') {
          _resetSowo();
          _populateSowo(data);
        } else if ($stateParams.reportId == 'achievements') {
          _initAchievements();
          _populateStudentAchievements(data);
        }
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
          console.log($scope.achievements.active);
      });
    };

  $scope.isAwardedAchievement = function(activeAchv, studentAchv) {
    if(studentAchv) {
      for(var i = 0; i < studentAchv.length; i++) {
        // TODO: check for subgroup
        if( (studentAchv[i].item == activeAchv.id) &&
            studentAchv[i].won
          ) {
            return true;
        }
      }
    }

    return false;
  };

  $scope.getStudentResult = function(studentId, achievement) {
    angular.forEach($scope.students, function(student) {
      if (student.id == studentId) {
        angular.forEach(student.achievements, function(achv) {
          if (achv.group == achievement.group && achv.item == achievement.item) {
            return achv.won;
          }
        });
      }
    });
  };


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

    var _resetSowo = function() {
      $scope.sowo = {
        shoutOuts: [],
        watchOuts: [],
        // to display show more button
        hasOverflow: false
      };
    };

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


    var _getRandomTime = function() {
      return Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000) + 1000;
    };


    var _initAchievements = function() {
      angular.forEach(gameReports.list, function(report) {
        if (report.id == 'achievements') {
          $scope.achievements.options = report.achievements;
        }
      });

      /* Select one of the skill types (or default to the first) */
      if ($stateParams.skillsId) {
        $scope.achievements.selected = $stateParams.skillsId;
      } else {
        if ($scope.achievements.options && $scope.achievements.options.length) {
          $scope.achievements.selected = $scope.achievements.options[0].id;
        }
      }

      $scope.achievements.options = _populateAchievements($scope.achievements.options);
      $scope.selectActiveAchievements($scope.achievements.selected, 0);

          
        //   angular.forEach(report.achievements, function(achv) {
        //     if (achv.id == $scope.achievements.selected) {
        //       achievements = achv.list;
        //     }
        //   });
        // $scope.achievements.available = _populateAchievements(report.achievements);
        // index = 0;
        // $scope.achievements.active = $scope.achievements.available.slice(index, index + 3);
        // }
      // });
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

    var _populateStudentAchievements = function(data) {
      if (data) {
        // Attach achievements and time played to students
        angular.forEach(data, function(d) {
          $scope.students[d.userId].achievements    = d.achievements;
          $scope.students[d.userId].totalTimePlayed = d.totalTimePlayed;
        });
      }
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

});

