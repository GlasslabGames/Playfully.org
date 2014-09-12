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
    abstract: true,
    views: {
      'main': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'CoursesCtrl'
      }
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
  .state('courses.active', {
    url: '',
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor']
    },
    views: {
      'coursesList': {
        templateUrl: 'instructor/courses/courses-list.html'
      }
    }
  })
  .state('courses.archived', {
    url: '/archived',
    data: {
      pageTitle: 'Archived Classes',
      showArchived: true,
      authorizedRoles: ['instructor']
    },
    views: {
      'coursesList': {
        templateUrl: 'instructor/courses/courses-list.html'
      }
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
    parent: 'courses.active',
    url: '/new',
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          games: function(GamesService) {
            return GamesService.all();
          }
        },
        templateUrl: 'instructor/courses/new-course.html',
        controller: 'NewCourseModalCtrl'
      }).result.then(function(result) {
          if (result) {
            return $state.transitionTo('courses.active');
          }
      });
    }
  })

  .state( 'archiveCourse', {
    parent: 'courses.active',
    url: '/:id/archive',
    data: {
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('courses.active');
        }
      });
    }
  })

  .state( 'unarchiveCourse', {
    parent: 'courses.archived',
    url: '/:id/unarchive',
    data: {
      pageTitle: 'Unarchive Class',
      authorizedRoles: ['instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('courses.archived');
        }
      });
    }
  })

  .state( 'lockCourse', {
    parent: 'courses.active',
    url: '/:id/lock',
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor'],
      actionType: 'lock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'

      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('courses.active');
        }
      });
    }
  })

  .state( 'unlockCourse', {
    parent: 'courses.active',
    url: '/:id/unlock',
    data: {
      pageTitle: 'Unlock Course',
      authorizedRoles: ['instructor'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'

      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('courses.active');
        }
      });
    }
  })

  .state( 'editCourse', {
    parent: 'courses.active',
    url: '/:id/edit',
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/edit-course.html',
        controller: 'UpdateCourseModalCtrl'
      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('courses.active');
        }
      });
    }
  })

  .state( 'assignGamesToCourse', {
    parent: 'courses.active',
    url: '/:id/games',
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get(courseId);
          },
          games: function(GamesService) {
            return GamesService.all();
          }
        },
        templateUrl: 'instructor/courses/assign-games.html',
        controller: 'AssignGamesModalCtrl'

      });
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
    parent: 'courses.active',
    url: '/:courseId/games/:gameId/lock', // course and game?
    data: {
      pageTitle: 'Lock Missions',
      authorizedRoles: ['instructor'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get($stateParams.courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-missions.html',
        controller: 'LockMissionsModalCtrl'
      });
    }
  })

  .state('unlockMissions', {
    parent: 'courses.active',
    url: '/:courseId/games/:gameId/unlock', // course and game?
    data: {
      pageTitle: 'Unlock Missions',
      authorizedRoles: ['instructor'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get($stateParams.courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-missions.html',
        controller: 'LockMissionsModalCtrl'
      });
    }
  });
})

.controller( 'CoursesCtrl',
  function ( $scope, $http, $log, $state, $filter, $timeout, courses, games, CoursesService) {

    $scope.courses = courses;
    $scope.activeCourses = $filter('filter')($scope.courses, { archived: false });
    $scope.archivedCourses = $filter('filter')($scope.courses, { archived: true });
    $scope.showArchived = $state.current.data.showArchived;
    $scope.courseKey = -1;

    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });

    $scope.showCourseEdit = function(_course){
      if( _course &&
          ( !_course.archived &&
            (_course.lmsType === "glasslab" ) )
        ) {
        return true;
      } else {
        return false;
      }
    };

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

.controller( 'NewCourseModalCtrl',
  function ( $scope, $rootScope, $state, $http, $log, $timeout, games, CoursesService) {

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
    $event.preventDefault();
    $event.stopPropagation();
    game.settings.missionProgressLock = !game.settings.missionProgressLock;
  };

  $scope.finish = function() {
    $scope.$close(true);
    return $timeout(function () {
      $state.go('courses.active', {}, { reload: true });
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
  $scope.dismiss = function() {
    $scope.$dismiss();
  };

  $scope.closeModal = function() {
    $scope.$close(true);
    return $timeout(function () {
      $state.go('courses.active', {}, { reload: true });
    }, 100);
  };

  $scope.reset();
})

.controller( 'UpdateCourseModalCtrl', 
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, CoursesService) {

  if ($state.current.data.hasOwnProperty('actionType')) {
    $scope.actionType = $state.current.data.actionType;
  }

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  } else {
    var gradeNumbersArray = [];
    angular.forEach(course.grade, function(gradeString) {
      gradeNumbersArray.push(parseInt(gradeString));
    });
    course.grade = angular.copy(gradeNumbersArray);
    $scope.course = course;
  }

  if ($state.includes('unarchiveCourse')) {
    $scope.updateType = 'unarchive';
  } else if ($state.current.name.indexOf('archive') > -1) {
    $scope.updateType = 'archive';
  }


  var finishSuccessfulAction = function(destState) {
    if (typeof(destState) === 'undefined') {
      destState = 'courses.active';
    }
    $scope.$close(true);
    return $timeout(function() { $state.go(destState, {}, {reload: true}); }, 100);
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
        finishSuccessfulAction();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.unlockCourse = function (courseData) {
    CoursesService.unlock(courseData)
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
        $scope.error = data.error;
      });
  };

  $scope.closeModal = function() {
    if ($state.includes('unarchiveCourse')) {
      finishSuccessfulAction('courses.archived');
    } else {
      finishSuccessfulAction();
    }
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
        $scope.$close(true);
        return $timeout(function () {
          $state.go('courses.active', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.closeModal = function() {
    $scope.$close(true);
    return $timeout(function () {
      $state.go('courses.active', {}, { reload: true });
    }, 100);
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
            $state.go('courses.active', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

  $scope.closeModal = function() {
    $scope.close();
    return $timeout(function () {
      $state.go('courses.active', {}, { reload: true });
    }, 100);
  };

})

.controller('EditStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, course, student, UserService) {
    $scope.course = course;
    $scope.student = student;

    $scope.editInfo = function(student) {
      UserService.update(student, false)
        .success(function(data, status, headers, config) {
          $rootScope.modalInstance.close();
          return $timeout(function () {
            $state.go('courses.active', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

    $scope.closeModal = function() {
      $rootScope.modalInstance.close();
      return $timeout(function () {
        $state.go('courses.active', {}, { reload: true });
      }, 100);
    };

})

.controller('LockMissionsModalCtrl',
  function($scope, $state, $stateParams, $rootScope, $timeout, $log, course, CoursesService) {

    $scope.actionType = $state.current.data.actionType;
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
          $scope.$close(true);
          return $timeout(function () {
            $state.go('courses.active', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

    $scope.closeModal = function() {
      $scope.$close(true);
      return $timeout(function () {
        $state.go('courses.active', {}, { reload: true });
      }, 100);
    };

});


