angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router',
  'reports'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'reports', {
    url: '/reports',
    views: {
      main: {
        templateUrl: 'instructor/reports/reports.html',
        controller: 'ReportsCtrl'
      }
    },
    resolve: {
      allGames: function(GamesService) {
        return GamesService.all();
      },
      activeCourses: function(CoursesService) {
        return CoursesService.getActiveEnrollmentsWithStudents();
      }
    },
    data: {
      authorizedRoles: ['instructor'],
      pageTitle: 'Reports'
    }
  });
})


.controller( 'ReportsCtrl',
  function($scope, $state, $stateParams, $log, allGames, activeCourses, CoursesService, ReportsService) {

    $scope.students = {};
    $scope.achievements = { options: {}, selected: null, active: [], startIndex: 0 };

    /* Courses */
    $scope.courses = { selectedId: null, options: {} };
    angular.forEach(activeCourses, function(course) {
      course.isExpanded = false;
      course.isPartiallySelected = false;
      $scope.courses.options[course.id] = course;
      angular.forEach(course.users, function(student) {
        if (!$scope.students.hasOwnProperty(student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });
    $scope.activeCourses = activeCourses;

    $scope.$watch('courses.selectedId', function(newValue, oldValue) {
      if (newValue == null) { return; }
      /**
       * Deselect all students in the old course, set expanded and selected
       * options accordingly.
       **/
      if (oldValue) {
        angular.forEach($scope.courses.options[oldValue].users, function(student) {
          student.isSelected = false;
        });
        $scope.courses.options[oldValue].isExpanded = false;
        $scope.courses.options[oldValue].isPartiallySelected = false;
      }
      if (!$scope.courses.options[newValue].isPartiallySelected) {
        angular.forEach($scope.courses.options[newValue].users, function(student) {
          student.isSelected = true;
        });
      }
    });

    /* Initialize with the first course in the list selected */
    $scope.courses.selectedId = null;
    if (activeCourses.length) {
      $scope.courses.selectedId = activeCourses[0].id;
    }
    
    /* Set the passed-in course to be the selected one */
    $scope.selectCourse = function($event, courseId) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.courses.selectedId = courseId;
    };

    /* Toggle the visibility of this student */
    $scope.toggleStudent = function($event, student, course) {
      $event.preventDefault();
      $event.stopPropagation();
      // Students are not selectable for Shout Out / Watch Out
      if ($scope.reports.selected == 'SOWO') { return false;}

      student.isSelected = !student.isSelected;
      course.isPartiallySelected = false;
      /* If any students are not selected, set isPartiallySelected to true */
      angular.forEach(course.users, function(student) {
        if (!student.isSelected) {
          course.isPartiallySelected= true;
        }
      });
      if (student.isSelected && course.id != $scope.courses.selectedId) {
        $scope.selectCourse($event, course.id);
      }
    };










    $scope.games = {
      isOpen: false,
      selected: 'AA-1',
      options: {}
    };
    /* Set up active games in the games list */
    angular.forEach(allGames, function(game) {
      if (game.enabled) {
        $scope.games.options[''+game.gameId] = game;
      }
    });


    /* Hardcode available reports */
    $scope.reports = {
      isOpen: false,
      selected: 'SOWO',
      options: {
        'SOWO': {
          id: 'SOWO',
          title: 'Shout Out and Watch Out',
          positon: 1
        },
        'ACHV': {
          id: 'ACHV',
          title: 'Game Achievements & Time Played',
          position: 2
        }
      }
    };

    $scope.selectGame = function($event, key) {
      $scope.games.selected = key;
      $scope.toggleDropdown($event, 'games');
    };

    $scope.selectReport = function($event, key) {
      $scope.reports.selected = key;
      $scope.toggleDropdown($event, 'reports');
    };

    $scope.selectGame = function($event, key) {
      $scope.games.selected = key;
      $scope.toggleDropdown($event, 'games');
    };

    $scope.toggleDropdown = function($event, collection) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[collection].isOpen = !$scope[collection].isOpen;
    };


    $scope.$watchCollection('[games.selected, reports.selected]', function(newValue, oldValue) {
      if ($scope.activeCourses.length === 0) {
        return;
      }
      var requestedGame = newValue[0];
      var requestedReport = newValue[1];

      if (requestedReport == 'ACHV') {
        ReportsService.getAchievements(requestedGame, $scope.courses.selectedId)
          .then(function(data) {
            if (!data.length) {
              
              return false;
            }
            angular.forEach(data, function(d) {
              $scope.students[d.userId].achievements = d.achievements;
              $scope.students[d.userId].totalTimePlayed = d.totalTimePlayed;
            });
            /* Populate achievements list if we haven't already */
            angular.forEach(data[0].achievements, function(achievement) {
              var achv = angular.copy(achievement);
              delete achv.won;
              if (!$scope.achievements.options.hasOwnProperty(achievement.group)) {
                $scope.achievements.options[achievement.group] = [achv];
              } else {
                $scope.achievements.options[achievement.group].push(achv);
              }
            });
            $scope.achievements.selected = data[0].achievements[0].group;
          });
          
      } else if (requestedReport = 'SOWO') {
        ReportsService.getSOWO(requestedGame, $scope.courses.selectedId)        
          .then(function(data) {
            if (data.length !== 0) {
              $scope.sowo = data;
            } else {
              $scope.sowo = [{
                timestamp: 1406692325,
                assessmentId: "sowo",
                engine: "javascript",
                gameSessionId: "",
                gameId: "AA-1",
                userId: 25,
                results: {
                watchout: [{ id: "wo1", total: 4, overPercent: 0.5 }],
                shoutout: [{ id: "so1", total: 3, overPercent: 1 }],
                version: 0.01
                }
              }];
            }
          });
      }

    });

  $scope.$watch('achievements.selected', function(newValue, oldValue) {
    $scope.selectActiveAchievements(newValue, 0);
  });

  $scope.selectActiveAchievements = function(group, index) {
    if ($scope.achievements.options[group]) {
      if (index < 0 || $scope.achievements.options[group].length < index + 3) {
        return false;
      } else {
        $scope.achievements.startIndex = index;
        $scope.achievements.active = $scope.achievements.options[group].slice(index, index + 3);
      }
    }
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



});


