angular.module( 'instructor.courses', [
  'playfully.config',
  'ui.router',
  'courses',
  'checklist-model'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'courses', {
    url: '/classes',
    views: {
      'main': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'CoursesCtrl'
      }
    },
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollmentsWithStudents();
      }
    }
  })
  .state( 'courseModal', {
    abstract: true,
    parent: 'courses',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'lg'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('courses');
      });
    }
  })
  .state( 'newCourse', {
    parent: 'courseModal',
    url: '/new',
    views: {
      'modal@': {
        controller: 'NewCourseModalCtrl',
        templateUrl: 'instructor/courses/new-course.html'
      }
    },
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      }
    }
  })
  .state( 'archiveCourse', {
    parent: 'courseModal',
    url: '/:id/archive',
    views: {
      'modal@': {
        controller: 'UpdateCourseModalCtrl',
        templateUrl: 'instructor/courses/archive-course.html'
      }
    },
    data: {
      pageTitle: 'Archive Course',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    }
  })
  .state( 'lockCourse', {
    parent: 'courseModal',
    url: '/:id/lock',
    views: {
      'modal@': {
        controller: 'UpdateCourseModalCtrl',
        templateUrl: 'instructor/courses/lock-course.html'
      }
    },
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    }
  })
  .state( 'editCourse', {
    parent: 'courseModal',
    url: '/:id/edit',
    views: {
      'modal@': {
        controller: 'UpdateCourseModalCtrl',
        templateUrl: 'instructor/courses/edit-course.html'
      }
    },
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    }
  })
  .state( 'assignGamesToCourse', {
    parent: 'courseModal',
    url: '/:id/games',
    views: {
      'modal@': {
        controller: 'AssignGamesModalCtrl',
        templateUrl: 'instructor/courses/assign-games.html'
      }
    },
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      },
      games: function(GamesService) {
        return GamesService.all();
      }
    }
  });
})

.controller( 'CoursesCtrl',
  function ( $scope, $http, $log, courses, games, CoursesService) {
    $scope.courses = courses;
    $log.info(courses);
    $scope.showArchived = false;
    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });

})

.controller( 'NewCourseModalCtrl', function ( $scope, $rootScope, $state, $http, $log, games, CoursesService) {

  $scope.games = games;
  $scope.course = null;
  $scope.createdCourse = null;
  $scope.formProgress = {
    currentStep: 1,
    errors: [],
    goToNextStep: function() { this.currentStep += 1; return false; }
  };

  var _emptyCourse = {
    title: '',
    grade: [],
    games: []
  };

  $scope.reset = function() {
    $scope.course = angular.copy(_emptyCourse);
    $scope.createdCourse = null;
    $scope.formProgress.currentStep = 1;
    if ($scope.newCourseForm) {
      $scope.newCourseForm.$setPristine();
    }
  };

  $scope.toggleGameLock = function ($event, game) {
    $log.info(game);
    $event.preventDefault();
    $event.stopPropagation();
    game.settings.missionProgressLock = !game.settings.missionProgressLock;
  };

  $scope.finish = function() {
    $rootScope.modalInstance.close();
    return $timeout(function () {
      $state.go('courses', {}, { reload: true });
    }, 100);
  };

  $scope.createCourse = function (course) {
    CoursesService.create(course)
      .success(function(data, status, headers, config) {
        $scope.createdCourse = data;
        $scope.formProgress.errors = [];
        $scope.formProgress.goToNextStep();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
        $scope.formProgress.errors.push(data.error);
      });
  };

  $scope.reset();


})

.controller( 'UpdateCourseModalCtrl', 
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, CoursesService) {

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  } else {
    gradesFromString = course.grade.split(', ');
    gradeNumbersArray = [];
    angular.forEach(gradesFromString, function(gradeString) {
      gradeNumbersArray.push(parseInt(gradeString));
    });
    course.grade = angular.copy(gradeNumbersArray);
    $log.info(course);
    $scope.course = course;

  }

  var finishSuccessfulAction = function() {
    $rootScope.modalInstance.close();
    return $timeout(function () {
      $state.go('courses', {}, { reload: true });
    }, 100);
  };

  $scope.archiveCourse = function (courseData) {
    CoursesService.archive(courseData)
      .success(function(data, status, headers, config) {
        finishSuccessfulAction();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.lockCourse = function (courseData) {
    CoursesService.lock(courseData)
      .success(function(data, status, headers, config) {
        finishSuccessfulAction();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.updateCourse = function (courseData) {
    CoursesService.update(courseData)
      .success(function(data, status, headers, config) {
        finishSuccessfulAction();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

})
.controller( 'AssignGamesModalCtrl', 
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, games, CoursesService) {
  /* TODO: Clean this up. */

  _gamesById = {};
  angular.forEach(games, function(game) {
    _gamesById[game.gameId] = game;
  });
  $scope.games = games;

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  } else {
    _tempGames = angular.copy(course.games);
    course.games = [];
    angular.forEach(_tempGames, function(game) {
      gameToAdd = _gamesById[game.id];
      gameToAdd.settings = angular.copy(game.settings);
      course.games.push(gameToAdd);
    });
    $scope.course = course;
  }

  $scope.toggleGameLock = function ($event, game) {
    $event.preventDefault();
    $event.stopPropagation();
    game.settings.missionProgressLock = !game.settings.missionProgressLock;
  };

  $scope.updateCourse = function (courseData) {
    CoursesService.updateGames(courseData)
      .success(function(data, status, headers, config) {
        $rootScope.modalInstance.close();
        return $timeout(function () {
          $state.go('courses', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

});


