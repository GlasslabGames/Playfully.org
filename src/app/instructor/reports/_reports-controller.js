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
  $stateProvider.state( 'root.reports', {
    abstract: true,
    url: 'reports',
    views: {
      'main@': {
        templateUrl: 'instructor/reports/reports.html',
        controller: 'ReportsCtrl'
      }
    },
    resolve: {
      courses: function (CoursesService) {
        return CoursesService.getEnrollmentsWithStudents();
      },
      activeCourses: function (courses, $q, $filter) {
        var deferred = $q.defer();
        var active = $filter('filter')(courses, {archived: false});
        deferred.resolve(active);
        return deferred.promise;
      },
      coursesInfo: function(activeCourses, ReportsService) {
        return ReportsService.getCourseInfo(activeCourses);
      },
      defaultCourseId: function(activeCourses) {
        if (activeCourses[0]) {
          return activeCourses[0].id;
        }
        return null;
      },
      myGames: function(defaultCourseId,coursesInfo) {
        if (defaultCourseId) {
          return coursesInfo[defaultCourseId].games;
        }
        return {};
      },
      defaultGameId: function(myGames) {
        if (myGames[0]) {
            return myGames[0].gameId;
        }
        return null;
      },
      gameReports: function(GamesService, myGames,defaultGameId) {
        if (myGames[0]) {
          return GamesService.getAllReports(defaultGameId);
        }
        return {};
      }
    },
    data: {
      authorizedRoles: ['instructor','manager','admin'],
      pageTitle: 'Reports'
    }
  })

  /**
   * If the user navigates the default Reports route, we need to choose
   * the first game and first course.
   **/
  .state('root.reports.default', {
    url: '',
    controller: function($scope, $state, $log, defaultGameId, activeCourses) {
      if (activeCourses.length && defaultGameId) {
        $state.go('root.reports.details.' + $scope.reports.options[0].id, {
          gameId: defaultGameId,
          courseId: activeCourses[0].id
        });
      } else {
        // First course doesn't have any games
      }
    },
    data: {
      authorizedRoles: ['instructor','manager','admin'],
      pageTitle: 'Reports'
    }
  })

  .state( 'root.reports.details', {
    url: '/details',
    template: '<div ui-view></div>',
    controller: 'ReportsDetailCtrl'
  })

    .state('root.reports.details.sowo', {
        url: '/sowo/game/:gameId/course/:courseId?skillsId&stdntIds',
        templateUrl: 'instructor/reports/sowo/sowo.html',
        controller: 'SowoCtrl',
        parameters: ['gameId','courseId'],
        resolve: {
          myGames: function($stateParams,coursesInfo) {
            // all available games for this course
            return coursesInfo[$stateParams.courseId].games;
          },
          defaultGame: function($stateParams, myGames) {
              // set default game
              var defaultGame = myGames[0];
              angular.forEach(myGames, function (game) {
                  if (game.gameId === $stateParams.gameId) {
                      defaultGame = game;
                  }
              });
              return defaultGame;
          },
          gameReports: function(myGames, defaultGame) {
            // set game report for default game
            var reports = {};
            if (defaultGame) {
                return defaultGame.reports;
            }
            return reports;
          }
        }
    })
    .state('root.reports.details.achievements', {
        url: '/achievements/game/:gameId/course/:courseId?skillsId&stdntIds',
        templateUrl: 'instructor/reports/achievements/achievements.html',
        controller: 'AchievementsCtrl',
        parameters: ['gameId','courseId'],
        resolve: {
          myGames: function($stateParams,coursesInfo) {
            // set all available games for this course
            return coursesInfo[$stateParams.courseId].games;
          },
          defaultGameId: function($stateParams, myGames) {
            var defaultGameId = myGames[0].gameId;
            angular.forEach(myGames, function(game) {
              if (game.gameId === $stateParams.gameId) {
                defaultGameId = game.gameId;
              }
            });
            return defaultGameId;
          },
          gameReports: function(myGames, defaultGameId) {
            // set game report for default game
            var reports = {};
            angular.forEach(myGames,function(game) {
              if (game.gameId === defaultGameId) {
                reports = game.reports;
              }
            });
            return reports;
          }
        }
    })
    .state('root.reports.details.competency', {
      url: '/competency/game/:gameId/course/:courseId?skillsId&stdntIds',
      templateUrl: 'instructor/reports/competency/competency.html',
      controller: 'CompetencyCtrl',
      parameters: ['gameId','courseId'],
      resolve: {
        myGames: function($stateParams,coursesInfo) {
          // set all available games for this course
          return coursesInfo[$stateParams.courseId].games;
        },
        defaultGameId: function($stateParams, myGames) {
          var defaultGameId = myGames[0].gameId;
          angular.forEach(myGames, function(game) {
            if (game.gameId === $stateParams.gameId) {
              defaultGameId = game.gameId;
            }
          });
          $stateParams = defaultGameId;
          return defaultGameId;
        },
        gameReports: function(myGames, defaultGameId) {
          // set game report for default game
          var reports = {};
          angular.forEach(myGames,function(game) {
            if (game.gameId === defaultGameId) {
              reports = game.reports;
            }
          });
          return reports;
        }
      }
    })
    .state('modal-xlg.competencyInfo', {
      url: '/reports/details/competency/game/:gameId/info',
      data:{
        pageTitle: 'Competency Report Info',
        authorizedRoles: ['instructor','manager','admin']
      },
      resolve: {
      },
      views: {
        'modal@': {
          templateUrl: 'instructor/reports/competency/info.html',
          controller: 'CompetencyInfoModalCtrl'
        }
      }
    })
    .state('root.reports.details.mission-progress', {
        url: '/mission-progress/game/:gameId/course/:courseId?skillsId&stdntIds',
        templateUrl: 'instructor/reports/mission-progress/mission-progress.html',
        controller: 'MissionProgressCtrl',
        parameters: ['gameId','courseId'],
        resolve: {
          myGames: function($stateParams,coursesInfo) {
            // set all available games for this course
            return coursesInfo[$stateParams.courseId].games;
          },
          defaultGame: function($stateParams, myGames) {
            var defaultGame = myGames[0];
            angular.forEach(myGames, function(game) {
              if (game.gameId === $stateParams.gameId) {
                defaultGame = game;
              }
            });
            return defaultGame;
          },
          gameReports: function(myGames, defaultGame) {
            // set game report for default game
            var reports = {};
            if (defaultGame) {
                return defaultGame.reports;
            }
            return reports;
          }
        }
    });

})

    .controller('ReportsCtrl',
    function ($scope, $log, $state, $stateParams, myGames, activeCourses, defaultGameId, gameReports) {

      $scope.reportDisplayType = 'wide';
      $scope.isStudentListVisible = false;


      $scope.games = {};
      $scope.developer = {};
      $scope.courses = {};
      $scope.activeCourses = activeCourses;
      $scope.reports = {};
      $scope.students = {};

      // Games - Setup game options and selected game //////////////

      $scope.games.isOpen = false;
      $scope.games.selectedGameId = null;
      $scope.games.options = {};

      angular.forEach(myGames, function (game) {
        if (game.enabled) {
          $scope.games.options['' + game.gameId] = game;
          if (game.gameId == $stateParams.gameId) {
            $scope.games.selectedGameId = game.gameId;
          }
        }
      });

      // Courses - Setup course options and select course ///////////
      $scope.courses.isOpen = false;
      $scope.courses.selectedCourseId = null;
      $scope.courses.options = {};

      if (activeCourses.length) {
        $scope.courses.selectedCourseId = activeCourses[0].id;
        $scope.courses.selected = activeCourses[0];
      }

      angular.forEach(activeCourses, function (course) {
        course.isExpanded = false;
        course.isPartiallySelected = false;
        $scope.courses.options[course.id] = course;
      });

      // Reports  - Setup report options based on selected game /////////

      $scope.reports.isOpen = false;
      $scope.reports.selected = null;
      $scope.reports.options = [];

      angular.forEach(gameReports.list, function (report) {
        // only add enabled reports
        if (report.enabled) {
          $scope.reports.options.push(angular.copy(report));
        }
      });

      // select first if on exists
      if ($scope.reports.options.length) {
        $scope.reports.selected = $scope.reports.options[0];
      }

      /* Students */

      // Adds students from activeCourses to student object

      angular.forEach(activeCourses, function (course) {
        angular.forEach(course.users, function (student) {
          if (!$scope.students.hasOwnProperty(student.id)) {
            $scope.students[student.id] = student;
          }
        });
      });

      /* Allow individual students to be toggled on or off. */
      $scope.toggleStudent = function ($event, student, course, reportId) {
        $event.preventDefault();
        $event.stopPropagation();
        if (reportId !== 'sowo') {
          student.isSelected = !student.isSelected;
        }
      };


      $scope.selectCourse = function ($event, courseId) {
        $event.preventDefault();
        $event.stopPropagation();

        var gameId;
        var newState = {
          gameId: gameId,
          courseId: courseId
        };

        // check if selected game is available for selected course
          var targetCourse = _.find($scope.courses.options, {id: parseInt(courseId)});
          angular.forEach(targetCourse.games, function (game) {
              if (game.gameId === $scope.games.selectedGameId) {
                gameId = $scope.games.selectedGameId;
               }
          });

          newState.gameId = gameId || targetCourse.games[0].gameId;

          _clearOtherCourses(courseId);
          $state.go('root.reports.details.' + $scope.reports.selected.id, newState);
      };
      // Reset all classes and their students except for the id passed in
      // (which should be the newly-selected course.
      var _clearOtherCourses = function (exceptedCourseId) {
        angular.forEach($scope.courses.options, function (course) {
          if (course.id != exceptedCourseId) {
            angular.forEach(course.users, function (student) {
              student.isSelected = false;
            });
            course.isPartiallySelected = false;
          }
        });
      };

      $scope.goToSelected = function (reportId, parameters) {
        $state.go('root.reports.details' + '.' + reportId, parameters);
      };

      $scope.toggleDropdown = function ($event, collection) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[collection].isOpen = !$scope[collection].isOpen;
      };

      // GH: Needed to fix PLAY-393, where IE requires the border-collapse property
      // of the reports table to be 'separate' instead of 'collapse'. Tried to
      // use conditional IE comments in index.html, but it doesn't work with
      // IE 10 and higher.
      $scope.isIE = function () {
        return $window.navigator.userAgent.test(/trident/i);
      };
    })

.controller('ReportsDetailCtrl', function($scope, $log, $state, $stateParams, gameReports, myGames, ReportsService, REPORT_CONSTANTS,localStorageService) {

});


