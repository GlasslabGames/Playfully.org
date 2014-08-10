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
    $scope.achievements = [];

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

    $scope.$watch('courses.selectedId', function(newValue, oldValue) {
      if (oldValue) {
        angular.forEach($scope.courses.options[oldValue].users, function(student) {
          student.isSelected = false;
        });
        $scope.courses.options[oldValue].isExpanded = false;
      }
      angular.forEach($scope.courses.options[newValue].users, function(student) {
        student.isSelected = true;
      });
    });

    $scope.courses.selectedId = activeCourses[0].id;
    
    $scope.selectCourse = function($event, courseId) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.courses.selectedId = courseId;
    };

    $scope.toggleStudent = function($event, student, course) {
      $event.preventDefault();
      $event.stopPropagation();
      $log.info(student);
      $log.info(course);
      student.isSelected = !student.isSelected;
      course.isPartiallySelected = false;
      angular.forEach(course.users, function(student) {
        if (!student.isSelected) {
          course.isPartiallySelected= true;
        }
      });
    };





    $scope.games = {
      isOpen: false,
      selected: 'AA-1',
      options: {}
    };
    angular.forEach(allGames, function(game) {
      if (game.enabled) {
        $scope.games.options[''+game.gameId] = game;
      }
    });


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

    $scope.toggleDropdown = function($event, collection) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[collection].isOpen = !$scope[collection].isOpen;
    };


    $scope.$watchCollection('[games.selected, reports.selected]', function(newValue, oldValue) {
      var requestedGame = newValue[0];
      var requestedReport = newValue[1];

      if (requestedReport == 'ACHV') {
        ReportsService.getAchievements(requestedGame, $scope.courses.selectedId)
          .then(function(data) {
            angular.forEach(data, function(d) {
              $scope.students[d.userId].achievements = d.achievements;
            });
            if (!$scope.achievements.length) {
              angular.forEach(data[0].achievements, function(achievement) {
                var achv = angular.copy(achievement);
                delete achv.won;
                $scope.achievements.push(achv);
              });
            }
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


  $scope.getStudentResult = function(studentId, achievement) {
    angular.forEach($scope.students, function(student) {
      if (student.id == studentId) {
        angular.forEach(student.achievements, function(achv) {
          if (achv.group == achievement.group && achv.item == achievement.item) {
            $log.info('Got a match at least');
            return achv.won;
          }
        });
      }
    });
  };




});


