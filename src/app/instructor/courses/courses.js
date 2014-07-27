angular.module( 'instructor.courses', [
  'playfully.config',
  'ui.router',
  'courses',
  'checklist-model'
])

.filter('archived', function () {
  return function (courses) {
    var filtered = [];
    for (var i = 0; i < courses.length; i++) {
      var item = items[i];
      if (item.archived) {
        filtered.push(item);
      }
    }
    return filtered;
  };
})

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
  .state('archivedCourses', {
    parent: 'courses',
    url: '/archived',
    views: {
      'main': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'CoursesCtrl'
      }
    },
    data: {
      pageTitle: 'Archived Classes',
      authorizedRoles: ['instructor']
    },
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
  .state( 'studentModal', {
    abstract: true,
    parent: 'courses',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'sm'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('courses');
      });
  }})
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
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    }
  })
  .state( 'unarchiveCourse', {
    parent: 'courseModal',
    url: '/:id/unarchive',
    views: {
      'modal@': {
        controller: 'UpdateCourseModalCtrl',
        templateUrl: 'instructor/courses/archive-course.html'
      }
    },
    data: {
      pageTitle: 'Unarchive Class',
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
  })
  .state( 'unenrollStudent', {
    parent: 'studentModal',
    url: '/:id/students/:studentId/unenroll',
    views: {
      'modal@': {
        controller: 'UnenrollStudentModalCtrl',
        templateUrl: 'instructor/courses/student-unenroll.html'
      }
    },
    data: {
      pageTitle: 'Unenroll Student',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      },
      student: function($stateParams, UserService) {
        return UserService.getById($stateParams.studentId)
          .then(function(response) {
            if (response.status < 300) {
              return response.data;
            } else {
              return response;
            }
          });
      }
    }
  })
  .state( 'editStudent', {
    parent: 'studentModal',
    url: '/:id/students/:studentId/edit',
    views: {
      'modal@': {
        controller: 'EditStudentModalCtrl',
        templateUrl: 'instructor/courses/student-edit.html'
      }
    },
    data: {
      pageTitle: 'Edit Student Information',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id)
          .then(function(response) {
            if (response.status < 300) {
              return response.data;
            } else {
              return response;
            }
          });
      },
      student: function($stateParams, UserService) {
        return UserService.getById($stateParams.studentId)
          .then(function(response) {
            if (response.status < 300) {
              return response.data;
            } else {
              return response;
            }
          });
      }
    }
  })
  .state('lockMissions', {
    parent: 'courseModal',
    url: '/:courseId/games/:gameId/lock', // course and game?
    views: {
      'modal@': {
        controller: 'LockMissionsModalCtrl',
        templateUrl: 'instructor/courses/lock-missions.html'
      }
    },
    data: {
      pageTitle: 'Lock Missions',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.courseId);
      }
    }
  })
  .state('unlockMissions', {
    parent: 'courseModal',
    url: '/:courseId/games/:gameId/unlock', // course and game?
    views: {
      'modal@': {
        controller: 'LockMissionsModalCtrl',
        templateUrl: 'instructor/courses/lock-missions.html'
      }
    },
    data: {
      pageTitle: 'Unlock Missions',
      authorizedRoles: ['instructor']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.courseId);
      }
    }
  });
})

.controller( 'CoursesCtrl',
  function ( $scope, $http, $log, $state, $timeout, courses, games, CoursesService) {
    $scope.courses = courses;
    $scope.showArchived = ($state.current.name == 'archivedCourses');

    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });
    $log.info($scope.courses);


    $scope.unarchiveCourse = function (course) {
      CoursesService.unarchive(course)
        .success(function(data, status, headers, config) {
          return $timeout(function () {
            $state.go('archivedCourses', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };
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
    $scope.course = course;
  }

  if ($state.current.name.indexOf('unarchive') > -1) {
    $scope.updateType = 'unarchive';
  } else if ($state.current.name.indexOf('archive') > -1) {
    $scope.updateType = 'archive';
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

  $scope.unarchiveCourse = function (courseData) {
    CoursesService.unarchive(courseData)
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
        $log.info(data);
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

})

.controller('UnenrollStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, course, student, CoursesService) {
    if (course.status < 300) {
      $scope.course = course.data;
    }
    $scope.course = course;
    $scope.student = student;

    $scope.unenroll = function(course, student) {
      CoursesService.unenrollUser(course.id, student.id)
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

})

.controller('EditStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, course, student, UserService) {
    $scope.course = course;
    $scope.student = student;

    $scope.editInfo = function(student) {
      UserService.update(student)
        .success(function(data, status, headers, config) {
          $log.info(data);
          $rootScope.modalInstance.close();
          return $timeout(function () {
            $state.go('courses', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

})

.controller('LockMissionsModalCtrl',
  function($scope, $state, $stateParams, $rootScope, $timeout, $log, course, CoursesService) {

    if($state.current.name.indexOf('unlock') > -1) {
      $scope.actionType = 'unlock';
    } else if ($state.current.name.indexOf('lock') > -1) {
      $scope.actionType = 'lock';
    }

    $scope.course = course;
    $scope.gameId = $stateParams.gameId;

    $scope.toggleMissionsLock = function (course) {
      angular.forEach(course.games, function(game) {
        if (game.id == $scope.gameId) {
          if ($scope.actionType == 'lock') {
            game.settings.missionProgressLock = true;
          } else if ($scope.actionType == 'unlock') {
            game.settings.missionProgressLock = false;
          }
        }
      });

      CoursesService.updateGames(course)
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


