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
  $stateProvider.state('newcourses', {
    url: '/courses{courseStatus:(?:/[^/]+)?}',
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor','manager','developer','admin']
    },
    views: {
      'main': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'NewCoursesCtrl'
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





/*  .state('courses', {
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
      authorizedRoles: ['instructor','manager','developer','admin']
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
      authorizedRoles: ['instructor','manager','admin']
    },
    views: {
      'coursesList': {
        templateUrl: 'instructor/courses/courses-list.html'
      }
    }
  })
  */

  .state( 'newCourse', {
    /* parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/new',
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor','manager','admin']
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
            return $state.transitionTo('newcourses');
          }
      });
    }
  })

  .state( 'archiveCourse', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/:id/archive',
    data: {
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor','manager','admin']
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
          return $state.transitionTo('newcourses');
        }
      });
    }
  })

  .state( 'unarchiveCourse', {
    /*parent: 'courses.archived',*/
    parent: 'newcourses',
    url: '/:id/unarchive',
    data: {
      pageTitle: 'Unarchive Class',
      authorizedRoles: ['instructor','manager','developer','admin']
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
          return $state.transitionTo('newcourses', {courseStatus:'/archived'});
        }
      });
    }
  })

  .state( 'lockCourse', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/:id/lock',
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor','manager','admin'],
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
          return $state.transitionTo('newcourses');
        }
      });
    }
  })

  .state( 'unlockCourse', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/:id/unlock',
    data: {
      pageTitle: 'Unlock Course',
      authorizedRoles: ['instructor','manager','admin'],
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
          return $state.transitionTo('newcourses');
        }
      });
    }
  })

  .state( 'editCourse', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/:id/edit',
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor','manager','admin']
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
          return $state.transitionTo('newcourses');
        }
      });
    }
  })

  .state( 'assignGamesToCourse', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
    url: '/:id/games',
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor','manager','admin']
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
      }).result.then(function(result) {
        if (result) {
          return $state.transitionTo('newcourses');
        }
      });
    }
  })

  .state( 'showStudentList', {
    /*parent: 'courses.active',*/
    parent: 'newcourses',
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
      $modal.open({
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
      $modal.open({
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
    }
  })

  .state('lockMissions', {
    parent: 'courses.active',
    url: '/:courseId/games/:gameId/lock',
    data: {
      pageTitle: 'Lock Missions',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      $modal.open({
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
    }
  })

  .state('unlockMissions', {
    parent: 'courses.active',
    url: '/:courseId/games/:gameId/unlock', // course and game?
    data: {
      pageTitle: 'Unlock Missions',
      authorizedRoles: ['instructor','manager','admin'],
      actionType: 'unlock'
    },
    onEnter: function($stateParams, $state, $modal) {
      var courseId = $stateParams.courseId;
      var gameId = $stateParams.gameId;
      $modal.open({
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
    }
  });
})





.controller( 'NewCoursesCtrl',
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

/*.controller( 'CoursesCtrl',
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
})*/

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
      $state.go('newcourses', {}, { reload: true });
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
      $state.go('newcourses', {}, { reload: true });
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
    $log.info('finishSuccessfulAction');
    if (typeof(destState) === 'undefined') {
      destState = 'newcourses';
    }
    $scope.$close(true);
    // return $timeout(function() { $state.go(destState, {}, {reload: true}); }, 100);
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
    $scope.$close(true);
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
          $state.go('newcourses', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.closeModal = function() {
    $scope.$close(true);
    return $timeout(function () {
      $state.go('newcourses', {}, { reload: true });
    }, 100);
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
      if (toState.name === 'newcourses') {
        $timeout(function() {
          angular.forEach(activeCourses, function (course) {
            course.isOpen = false;
          });
        }, 100);
      }
    });
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
          $scope.$close(true);
          return $timeout(function () {
            $state.go('showStudentList', {id:course.id}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

  $scope.closeModal = function() {
    $scope.$close(true);
    return $timeout(function () {
      $state.go('showStudentList', {id:course.id});
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
          $scope.$close(true);
          return $timeout(function () {
            $state.go('showStudentList', {id:course.id}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

    $scope.closeModal = function() {
      $scope.$close(true);
      return $timeout(function () {
        $state.go('showStudentList', {id:course.id});
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
            $state.go('newcourses', {}, { reload: true });
          }, 100);
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
        });
    };

    $scope.closeModal = function() {
      $scope.$close(true);
      return $timeout(function () {
        $state.go('newcourses', {}, { reload: true });
      }, 100);
    };

});


