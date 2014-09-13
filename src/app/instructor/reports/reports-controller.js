angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router',
  'reports'
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
      myGames: function(GamesService) { return GamesService.getMyGames(); },
      defaultGame: function($stateParams, myGames) { 
        return myGames[0].gameId;
      }
    },
    data: {
      authorizedRoles: ['instructor'],
      pageTitle: 'Reports'
    }
  })

  /**
   * If the user navigates the default Reports route, we need to choose
   * the first game and first course.
   **/
  .state('reports.default', {
    url: '',
    controller: function($scope, $state, $log, defaultGame, activeCourses) {
      if (activeCourses.length) {
        $state.transitionTo('reports.details', {
          reportId: 'achievements',
          gameId: defaultGame,
          courseId: activeCourses[0].id
        });
      }
    }
  })

  .state( 'reports.details', {
    url: '/:reportId/game/:gameId/course/:courseId?skillsId',
    templateUrl: function($stateParams) {
      return 'instructor/reports/' + $stateParams.reportId + '.html';
    },
    controller: 'ReportsDetailCtrl',
    resolve: {
      gameReports: function($stateParams, GamesService) {
        return GamesService.getAllReports($stateParams.gameId);
      }
    }
  });
})

.controller( 'ReportsCtrl',
  function($scope, $log, $state, $stateParams, myGames, activeCourses, defaultGame) {
    if (!defaultGame) {
      $state.transitionTo('reports.details', {
        reportId: 'achievements',
        gameId: myGames[0].gameId,
        courseId: activeCourses[0].id
      });
    }

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

    // Set up Reports dropdown based on reports available to
    // the selected Game.
    $scope.reports.options = angular.copy(gameReports.list);
    angular.forEach($scope.reports.options, function(report) {
      if (report.id == $stateParams.reportId) {
        $scope.reports.selected = report;
      }
    });

    // Set parent scope developer info
    if (gameReports.hasOwnProperty('developer')) {
      $scope.developer.logo = gameReports.developer.logo;
    }

    /* By default, select all students in the selected course */
    angular.forEach($scope.courses.options[$scope.courses.selectedId].users,
      function(student) { student.isSelected = true; }
    );

    /* Retrieve the appropriate report and process the data */
    ReportsService.get($stateParams.reportId, $stateParams.gameId, $stateParams.courseId)
      .then(function(data) {
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

});
























// 
// .controller( 'ReportsCtrlOld',
//   function($scope, $state, $stateParams, $log, allGames, activeCourses, CoursesService, ReportsService, GamesService) {
// 
//     $scope.students = {};
//     $scope.achievements = { options: {}, selected: null, active: [], startIndex: 0, totalCount: 0 };
//     $scope.sowoInfo = {};
//     $scope.achievementInfo = {};
// 
//     /* Courses */
//     $scope.courses = { selectedId: null, options: {} };
//     angular.forEach(activeCourses, function(course) {
//       course.isExpanded = false;
//       course.isPartiallySelected = false;
//       $scope.courses.options[course.id] = course;
//       angular.forEach(course.users, function(student) {
//         if (!$scope.students.hasOwnProperty(student.id)) {
//           $scope.students[student.id] = student;
//         }
//       });
//     });
//     $scope.activeCourses = activeCourses;
// 
//     $scope.$watch('courses.selectedId', function(newValue, oldValue) {
//       if (newValue == null) { return; }
//       /**
//        * Deselect all students in the old course, set expanded and selected
//        * options accordingly.
//        **/
//       if (oldValue) {
//         angular.forEach($scope.courses.options[oldValue].users, function(student) {
//           student.isSelected = false;
//         });
//         $scope.courses.options[oldValue].isExpanded = false;
//         $scope.courses.options[oldValue].isPartiallySelected = false;
//       }
//       if (!$scope.courses.options[newValue].isPartiallySelected) {
//         angular.forEach($scope.courses.options[newValue].users, function(student) {
//           student.isSelected = true;
//         });
//       }
//     });
// 
//     /* Initialize with the first course in the list selected */
//     $scope.courses.selectedId = null;
//     if (activeCourses.length) {
//       $scope.courses.selectedId = activeCourses[0].id;
//     }
//     
//     /* Set the passed-in course to be the selected one */
//     $scope.selectCourse = function($event, courseId) {
//       $event.preventDefault();
//       $event.stopPropagation();
//       $scope.courses.selectedId = courseId;
//     };
// 
//     /* Toggle the visibility of this student */
//     $scope.toggleStudent = function($event, student, course) {
//       $event.preventDefault();
//       $event.stopPropagation();
//       // Students are not selectable for Shout Out / Watch Out
//       if ($scope.reports.selected && $scope.reports.selected.id == 'sowo') {
//         return false;
//       }
// 
//       student.isSelected = !student.isSelected;
//       course.isPartiallySelected = false;
// 
//       /* If any students are not selected, set isPartiallySelected to true */
//       angular.forEach(course.users, function(student) {
//         if (!student.isSelected) {
//           course.isPartiallySelected= true;
//         }
//       });
//       if (student.isSelected && course.id != $scope.courses.selectedId) {
//         $scope.selectCourse($event, course.id);
//       }
//     };
// 
//     $scope.games = {
//       isOpen: false,
//       selected: 'AA-1',
//       options: {}
//     };
//     /* Set up active games in the games list */
//     angular.forEach(allGames, function(game) {
//       if (game.enabled) {
//         $scope.games.options[''+game.gameId] = game;
//       }
//     });
// 
// 
//     /* Hardcode available reports */
//     $scope.reports = {
//       isOpen: false,
//       selected: null,
//       options: []
//     };
// 
//     $scope.selectGame = function($event, key) {
//       $scope.games.selected = key;
//       $scope.toggleDropdown($event, 'games');
//     };
// 
//     $scope.selectReport = function($event, report) {
//       $scope.reports.selected = report;
//       $scope.toggleDropdown($event, 'reports');
//     };
// 
//     $scope.selectGame = function($event, key) {
//       $scope.games.selected = key;
//       $scope.toggleDropdown($event, 'games');
//     };
// 
//     $scope.toggleDropdown = function($event, collection) {
//       $event.preventDefault();
//       $event.stopPropagation();
//       $scope[collection].isOpen = !$scope[collection].isOpen;
//     };
// 
//     $scope.$watch('courses.selectedId', function(courseId, oldValue) {
//       if($scope.reports.selected &&
//          $scope.reports.selected.id &&
//          $scope.games.selected ) {
//         ReportsService.get($scope.reports.selected.id, $scope.games.selected, courseId)
//           .then(function(data) {
//             if ($scope.reports.selected.id == 'sowo') {
//               _resetSowo();
//               _populateSowo(data);
//             } else if ($scope.reports.selected.id == 'achievements') {
//               _populateStudentAchievements(data);
//             }
//           });
//       }
//     });
// 
//     $scope.$watchCollection('games.selected', function(newValue, oldValue) {
//       GamesService.getAllReports(newValue)
//         .then(function(data) {
//           if (data.list && data.list.length) {
//             $scope.reports.options = data.list;
//             $scope.reports.selected = data.list[0];
// 
//             angular.forEach($scope.reports.options, function(report) {
//                 if(report.id == 'achievements') {
//                   _populateAchievements(report.achievements);
//                 }
//             });
//           }
//           if (data.developer) {
//             $scope.developer = data.developer;
//           }
//         });
//     });
// 
// 
//     $scope.$watchCollection('reports.selected', function(report, oldValue) {
//       if ($scope.activeCourses.length === 0 || report == null || oldValue == null) {
//         return;
//       }
// 
//       ReportsService.get(report.id, $scope.games.selected, $scope.courses.selectedId)
//         .then(function(data) {
//           if (report.id == 'sowo') {
//             _resetSowo();
//             _populateSowo(data);
//           } else if (report.id == 'achievements') {
//             _populateStudentAchievements(data);
//           }
//         });
// 
//     });
// 
//   $scope.$watch('achievements.selected', function(newValue, oldValue) {
//     $scope.selectActiveAchievements(newValue, 0);
//   });
// 
//   $scope.selectActiveAchievements = function(group, index) {
//     angular.forEach($scope.achievements.options, function(option) {
//       if (option.id == group) {
//         var totalItems = 0;
//         angular.forEach(option.subGroups, function(subGroup) {
//           totalItems += subGroup.items.length;
//         });
//         $scope.achievements.totalCount = totalItems;
// 
//         if (index < 0 || totalItems < index + 3) {
//           return false;
//         } else {
//           $scope.achievements.startIndex = index;
//           $scope.achievements.active = option.list.slice(index, index + 3);
//         }
//       }
//     });
//   };
// 
//   $scope.isAwardedAchievement = function(activeAchv, studentAchv) {
//     if(studentAchv) {
//       for(var i = 0; i < studentAchv.length; i++) {
//         // TODO: check for subgroup
//         if( (studentAchv[i].item == activeAchv.id) &&
//             studentAchv[i].won
//           ) {
//             return true;
//         }
//       }
//     }
// 
//     return false;
//   };
// 
//   $scope.getStudentResult = function(studentId, achievement) {
//     angular.forEach($scope.students, function(student) {
//       if (student.id == studentId) {
//         angular.forEach(student.achievements, function(achv) {
//           if (achv.group == achievement.group && achv.item == achievement.item) {
//             return achv.won;
//           }
//         });
//       }
//     });
//   };
// 
//   var _resetSowo = function() {
//     $scope.sowo = {
//       shoutOuts: [],
//       watchOuts: [],
//       // to display show more button
//       hasOverflow: false
//     };
//   };
// 
//   var _populateSowo = function(data) {
//     var sowo = data;
//     var soTotal = 0;
//     var woTotal = 0;
//     var total = 0;
// 
//     if (sowo.length) {
//       // calc total columns
//       angular.forEach(sowo, function(assessment) {
//         if (assessment.results.hasOwnProperty('shoutout') &&
//           assessment.results.shoutout.length) {
//           soTotal++;
//         }
//         if (assessment.results.hasOwnProperty('watchout') &&
//           assessment.results.watchout.length) {
//           woTotal++;
//         }
//       });
//       total = Math.max(soTotal, woTotal);
// 
//       // pre fill data
//       $scope.sowo.shoutOuts = [];
//       $scope.sowo.watchOuts = [];
//       for(var i = 0; i < total; i++) {
//         $scope.sowo.shoutOuts[i] = {
//           student: {},
//           results: [],
//           overflowText: "",
//           order: [0, ""]
//         };
//         $scope.sowo.watchOuts[i] = {
//           student: {},
//           results: [],
//           overflowText: "",
//           order: [0, ""]
//         };
//       }
// 
//       // sowo count sorted by server
//       // sort alpha in view
//       soTotal = 0;
//       woTotal = 0;
//       angular.forEach(sowo, function(assessment) {
//         var student = $scope.students[assessment.userId];
//         student = _compileNameOfStudent(student);
// 
//         if (assessment.results.hasOwnProperty('shoutout') &&
//           assessment.results.shoutout.length) {
//             $scope.sowo.shoutOuts[soTotal] = {
//               student: student,
//               results: assessment.results['shoutout'],
//               overflowText: _getOverflowText(assessment.results['shoutout']),
//               order: [
//                 assessment.results['shoutout'].length,
//                 student.name
//               ]
//             };
//             soTotal++;
//         }
//         if (assessment.results.hasOwnProperty('watchout') &&
//           assessment.results.watchout.length) {
//             $scope.sowo.watchOuts[woTotal] = {
//               student: student,
//               results: assessment.results['watchout'],
//               overflowText: _getOverflowText(assessment.results['watchout']),
//               order: [
//                 assessment.results['watchout'].length,
//                 student.name
//               ]
//             };
//             woTotal++;
//         }
//       });
//     }
//   };
// 
//   var _compileNameOfStudent = function(student) {
//     var name = student.firstName;
//     if(student.lastName) {
//       name += ' ' + student.lastName + '.';
//     }
// 
//     student.name = name;
//     return student;
//   };
// 
//   var _getOverflowText = function(results) {
//     overflowText = '';
//     angular.forEach(results, function(r, i) {
//       if (i >= 3) {
//         overflowText += '<p>' + r.description + '</p>';
//       }
//     });
//     return overflowText;
//   };
// 
// 
//   var _getRandomTime = function() {
//     return Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000) + 1000;
//   };
// 
//   var _populateAchievements = function(reports) {
//     for(var i = 0; i < reports.length; i++) {
//       reports[i].list = [];
//       for(var j = 0; j < reports[i].subGroups.length; j++) {
//         for(var k = 0; k < reports[i].subGroups[j].items.length; k++) {
//           reports[i].subGroups[j].items[k].standard = {
//             title:       reports[i].subGroups[j].title,
//             description: reports[i].subGroups[j].description
//           };
// 
//           reports[i].list.push( reports[i].subGroups[j].items[k] );
//         }
//       }
//     }
// 
//     $scope.achievements.options = reports;
//     $scope.achievements.selected = reports[0].id;
//   };
// 
//   var _populateStudentAchievements = function(data) {
//     // Attach achievements and time played to students
//     angular.forEach(data, function(d) {
//       $scope.students[d.userId].achievements    = d.achievements;
//       $scope.students[d.userId].totalTimePlayed = d.totalTimePlayed;
//     });
//   };
// 
// });
// 
// */
