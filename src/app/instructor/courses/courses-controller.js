angular.module( 'instructor.courses', [
  'playfully.config',
  'ui.router',
  'courses',
  'checklist-model',
  'gl-unique-in-group'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state('root.courses', {
    /* Use regex to capture optional courseStatus (archived vs other) */
    url: 'classes',
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
    views: {
      'main@': {
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
  .state('root.courses.archived', {
    url: '/archived',
    data: {
      pageTitle: 'Archived Classes',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
    views: {
      'main@': {
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

  .state('modal-lg.newCourse', {
    url: '/classes/new',
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor','manager','admin']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/new-course.html',
        controller: 'NewCourseModalCtrl'
      }
    }
  })
  .state('modal-lg.archiveCourse', {
    url: '/courses/:id/archive',
    data: {
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor','manager','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.unarchiveCourse', {
    url: '/classes/:id/unarchive',
    data: {
      pageTitle: 'Unarchive Class',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/archive-course.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.lockCourse', {
    url: '/classes/:id/lock',
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'lock'
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.unlockCourse', {
    url: '/classes/:id/unlock',
    data: {
      pageTitle: 'Unlock Course',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    resolve: {
      course: function($stateParams,CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/lock-course.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.editCourse', {
    url: '/classes/:id/edit',
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor','manager','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/edit-course.html',
        controller: 'EditCourseModalCtrl'
      }
    }
  })

  .state('modal-lg.assignGamesToCourse', {
    url: '/classes/:id/games',
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor','manager','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      },
      games: function(GamesService) {
        return GamesService.all();
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/assign-games.html',
        controller: 'AssignGamesModalCtrl'
      }
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
        return $state.transitionTo('showStudentList', { id: courseId});
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
        return $state.transitionTo('showStudentList', { id: courseId});
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
        return $state.transitionTo('courses');
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
        return $state.transitionTo('courses');
      });
    }
  });
})





.controller( 'CoursesCtrl',
  function ($scope, $rootScope, $http, $log, $state, $filter, $timeout, courses, games, CoursesService) {
    var setUpCourses = function(courseList) {
      $scope.courses = courseList;
      $scope.activeCourses = $filter('filter')($scope.courses, { archived: false });
      $scope.archivedCourses = $filter('filter')($scope.courses, { archived: true });
    };
    setUpCourses(courses);
    // Decide whether to show active or archived courses
    $scope.showArchived = !!$state.includes('root.courses.archived');
    $scope.courseKey = -1;

    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });

    $scope.showCourseEdit = function(course) {
      return (course && !course.archived && (course.lmsType == 'glasslab'));
    };

    $rootScope.$on('courses:updated', function(event, data) {
      CoursesService.getEnrollmentsWithStudents()
        .then(function(response) {
          setUpCourses(response); 
        });
    });

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

  $scope.reset();
})

.controller( 'EditCourseModalCtrl',
  function ($scope, $rootScope, $state, $log, $timeout, course, courses, CoursesService) {

    $scope.course = course; 
    $scope.course.grade = _.map(course.grade, function(gradeStr) { return parseInt(gradeStr); });
    // Extract a list of course titles to check against for duplicates
    $scope.existingCourseTitles = _.map(courses, 'title');
    // Don't include the current course title, since user should be able to
    // return to previous title state while editing
    _.remove($scope.existingCourseTitles, function(title) { return title == $scope.course.title; });

    $scope.updateCourse = function (courseData) {
      CoursesService.update(courseData)
        .success(function(data, status, headers, config) {
          $rootScope.$broadcast('courses:updated');
          $scope.close();
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
          $scope.error = data.error;
        });
    };

})

.controller( 'UpdateCourseModalCtrl',
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, CoursesService) {

  $scope.course = course;

  if ($state.current.data.hasOwnProperty('actionType')) {
    $scope.actionType = $state.current.data.actionType;
  }

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  }

  if ($state.includes('modal-lg.unarchiveCourse')) {
    $scope.updateType = 'unarchive';
  } else if ($state.includes('modal-lg.archiveCourse')) {
    $scope.updateType = 'archive';
  }

  $scope.archiveCourse = function (courseData) {
    CoursesService.archive(courseData)
      .success(function(data, status, headers, config) {
        $rootScope.$broadcast('courses:updated');
        $scope.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.unarchiveCourse = function (courseData) {
    CoursesService.unarchive(courseData)
      .success(function(data, status, headers, config) {
        $rootScope.$broadcast('courses:updated');
        $scope.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.lockCourse = function (courseData) {
    CoursesService.lock(courseData)
      .success(function(data, status, headers, config) {
        $rootScope.$broadcast('courses:updated');
        $scope.close();
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.unlockCourse = function (courseData) {
    CoursesService.unlock(courseData)
      .success(function(data, status, headers, config) {
        $rootScope.$broadcast('courses:updated');
        $scope.close();
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
        $rootScope.$broadcast('courses:updated');
        $scope.close();
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


