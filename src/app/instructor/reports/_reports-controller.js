angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router',
  'reports',
  'courses',
  'stickyNg',
  'reports.const',
  'LocalStorageModule'
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
      defaultCourse: function(activeCourses) {
        if (activeCourses[0]) {
            return activeCourses.id;
        }
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
    url: '/details',
    templateUrl: 'instructor/reports/reports-detail.html',
    controller: 'ReportsDetailCtrl'
  })
  .state('reports.details.sowo', {
    url: '/sowo/game/:gameId/course/:courseId?skillsId&stdntIds',
    templateUrl: 'instructor/reports/sowo.html',
    controller: 'SowoCtrl'
  })
  .state('reports.details.achievements', {
    url: '/achievements/game/:gameId/course/:courseId?skillsId&stdntIds',
    templateUrl: 'instructor/reports/achievements.html',
    controller: 'AchievementsCtrl',
    parameters: ['gameId','courseId']
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
    // Adds students from activeCourses to student object
    console.log('activeCourses: ', activeCourses);
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

    $scope.goToSelected = function(reportId,gameId,courseId,skillsId) {
        $state.go('reports.details' + '.' + reportId, {
          gameId: gameId,
          courseId: courseId,
          skillsId: skillsId || false
        }, {inherit: false});
    };

    $scope.toggleDropdown = function($event, collection) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[collection].isOpen = !$scope[collection].isOpen;
    };
})

.controller('ReportsDetailCtrl', function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService) {
});

