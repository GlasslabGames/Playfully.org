angular.module( 'instructor.courses', [
  'playfully.config',
  'ui.router',
  'courses',
  'checklist-model',
  'gl-unique-in-group'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state('courses', {
    /* Use regex to capture optional courseStatus (archived vs other) */
    url: '/classes{courseStatus:(?:/[^/]+)?}',
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
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

  .state( 'newCourse', {
    parent: 'courses',
    url: '/new',
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          games: function(GamesService) {
            return GamesService.all();
          },
          courses: function(CoursesService) {
            return CoursesService.getEnrollments();
          }
        },
        templateUrl: 'instructor/courses/new-course.html',
        controller: 'NewCourseModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'archiveCourse', {
    parent: 'courses',
    url: '/:id/archive',
    data: {
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'unarchiveCourse', {
    parent: 'courses',
    url: '/:id/unarchive',
    data: {
      pageTitle: 'Unarchive Class',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.go('courses', {courseStatus:'/archived'},{ reload: true });
      });
    }
  })

  .state( 'lockCourse', {
    parent: 'courses',
    url: '/:id/lock',
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'lock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'

      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'unlockCourse', {
    parent: 'courses',
    url: '/:id/unlock',
    data: {
      pageTitle: 'Unlock Course',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'editCourse', {
    parent: 'courses',
    url: '/:id/edit',
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function($stateParams, CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/edit-course.html',
        controller: 'UpdateCourseModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'assignGamesToCourse', {
    parent: 'courses',
    url: '/:id/games',
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var modalInstance = $modal.open({
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

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state( 'showStudentList', {
    parent: 'courses',
    url: '/:id/students',
    data: {
      pageTitle: 'View Student List',
      authorizedRoles: ['instructor','manager','admin']
    },
    views: {
      'studentList': {
        templateUrl: 'instructor/courses/student-list.html',
        controller: 'StudentListCtrl'
      }
    }
  })

  .state( 'unenrollStudent', {
    parent: 'showStudentList',
    url: '/:studentId/unenroll',
    data:{
      pageTitle: 'Unenroll Student',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var studentId = $stateParams.studentId;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          },
          student: function(UserService) {
            return UserService.getById($stateParams.studentId)
              .then(function(response) {
                if (response.status < 300) {
                  return response.data;
                } else {
                  return response;
                }
              });
          }
        },
        templateUrl: 'instructor/courses/student-unenroll.html',
        controller: 'UnenrollStudentModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('showStudentList', null, {reload: true});
      });
    }
  })

  .state( 'editStudent', {
    parent: 'showStudentList',
    url: '/:studentId/edit',
    data:{
      pageTitle: 'Edit Student Information',
      authorizedRoles: ['instructor','manager','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.id;
      var studentId = $stateParams.studentId;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId)
              .then(function(response) {
                if (response.status < 300) {
                  return response.data;
                } else {
                  return response;
                }
              });
          },
          student: function(UserService) {
            return UserService.getById(studentId)
              .then(function(response) {
                if (response.status < 300) {
                  return response.data;
                } else {
                  return response;
                }
              });
          }
        },
        templateUrl: 'instructor/courses/student-edit.html',
        controller: 'EditStudentModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('showStudentList', null, {reload: true});
      });
    }
  })

  .state('lockMissions', {
    parent: 'courses',
    url: '/:courseId/games/:gameId/lock',
    data: {
      pageTitle: 'Lock Missions',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-missions.html',
        controller: 'LockMissionsModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  })

  .state('unlockMissions', {
    parent: 'courses',
    url: '/:courseId/games/:gameId/unlock', // course and game?
    data: {
      pageTitle: 'Unlock Missions',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      var modalInstance = $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          course: function(CoursesService) {
            return CoursesService.get(courseId);
          }
        },
        templateUrl: 'instructor/courses/lock-missions.html',
        controller: 'LockMissionsModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  });
})





.controller( 'CoursesCtrl',
  function ($scope, $http, $log, $state, $filter, $timeout, courses, games, CoursesService) {
    $scope.courses = courses;
    $scope.activeCourses = $filter('filter')($scope.courses, { archived: false });
    $scope.archivedCourses = $filter('filter')($scope.courses, { archived: true });
    $scope.showArchived = ($state.params.courseStatus == '/archived');
    $scope.courseKey = -1;
    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });

    $scope.showCourseEdit = function(course) {
      return (course && !course.archived && (course.lmsType == 'glasslab'));
    };

})

.controller( 'NewCourseModalCtrl',
  function ( $scope, $rootScope, $state, $http, $log, $timeout, games, courses, CoursesService) {
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

  $scope.existingCourseTitles = _.map(courses, 'title'); 

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

    var _updateCourseCtrl = function () {
      $scope.courses = courses;
    };

  $scope.reset();
})

.controller( 'UpdateCourseModalCtrl',
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, $modalInstance, course, CoursesService) {

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

  $scope.archiveCourse = function (courseData) {
    CoursesService.archive(courseData)
      .success(function(data, status, headers, config) {
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.unarchiveCourse = function (courseData) {
    CoursesService.unarchive(courseData)
      .success(function(data, status, headers, config) {
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.lockCourse = function (courseData) {
    CoursesService.lock(courseData)
      .success(function(data, status, headers, config) {
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.unlockCourse = function (courseData) {
    CoursesService.unlock(courseData)
      .success(function(data, status, headers, config) {
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.updateCourse = function (courseData) {
    CoursesService.update(courseData)
      .success(function(data, status, headers, config) {
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
        $scope.error = data.error;
      });
  };

})

.controller( 'AssignGamesModalCtrl',
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, $modalInstance, course, games, CoursesService) {
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
        $modalInstance.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

})

.controller('StudentListCtrl',
  function ($scope, $rootScope, $state, $stateParams, $timeout, $log) {
    var activeCourses = $scope.$parent.courses;

    var hasOpenCourse = function(courses) {
      var result = false;
      angular.forEach(courses, function (course) {
        if (course.isOpen) { result = true; }
      });
      return result;
    };

    var getOpenCourseId = function(courses) {
      var openCourseId = null;
      angular.forEach(courses, function (course) {
        if (course.isOpen) { openCourseId = course.id; }
      });
      return openCourseId;
    };

    if (!hasOpenCourse(activeCourses)) {
      angular.forEach(activeCourses, function (course) {
        $timeout(function() {
          course.isOpen = (course.id == $stateParams.id);
        }, 100);
      });
    } else if (getOpenCourseId(activeCourses) != $stateParams.id) {
      angular.forEach(activeCourses, function (course) {
        $timeout(function() {
          course.isOpen = (course.id == $stateParams.id);
        }, 100);
      });
    }

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      if (toState.name === 'courses') {
        $timeout(function() {
          angular.forEach(activeCourses, function (course) {
            course.isOpen = false;
          });
        }, 100);
      }
    });
  })

.controller('UnenrollStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, $modalInstance, course, student, CoursesService) {
    if (course.status < 300) {
      $scope.course = course.data;
    }
    $scope.course = course;
    $scope.student = student;

    $scope.unenroll = function(course, student) {
      CoursesService.unenrollUser(course.id, student.id)
        .success(function(data, status, headers, config) {
          $modalInstance.close();
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

})

.controller('EditStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, $modalInstance, course, student, UserService) {
    $scope.course = course;
    $scope.student = student;

    $scope.editInfo = function(student) {
      UserService.update(student, false)
        .success(function(data, status, headers, config) {
          $modalInstance.close();
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

})

.controller('LockMissionsModalCtrl',
  function($scope, $state, $stateParams, $rootScope, $timeout, $log, $modalInstance, course, CoursesService) {

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
          $modalInstance.close();
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

});


