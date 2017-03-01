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
      authorizedRoles: ['instructor','developer','admin']
    },
    views: {
      'main@': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'CoursesCtrl'
      }
    },
    resolve: {
      allGames: function (GamesService) {
            return GamesService.active('basic');
      },
      courses: function(CoursesService, $filter) {
        return CoursesService.getEnrollments()
          .then(function(response) {
            var filtered = $filter('filter')(response, {archived: false});
            return filtered;
          });
      },
      availableGamesForLicense: function(LicenseService) {
          return LicenseService.getGamesAvailableForLicense();
      },
      currentPlan: function(LicenseService) {
        return LicenseService.getCurrentPlan();
      },
      availableSeats: function(LicenseService) {
        return LicenseService.getRemainingStudentSeats();
      }
    }
  })
  .state('root.courses.archived', {
    url: '/archived',
    data: {
      pageTitle: 'Archived Classes',
      authorizedRoles: ['instructor','developer','admin']
    },
    views: {
      'main@': {
        templateUrl: 'instructor/courses/courses.html',
        controller: 'CoursesCtrl'
      }
    },
    resolve: {
      courses: function(CoursesService, $filter) {
        return CoursesService.getEnrollments()
          .then(function(response) {
            return $filter('filter')(response, { archived: true });
          });
      }
    }

  })

  .state('modal-lg.newCourse', {
    url: '/classes/new',
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor','admin']
    },
    resolve: {
      gamesInPlan: function (GamesService) {
          return GamesService.getGamesForPlan();
      },
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/new-course-modal.html',
        controller: 'NewCourseModalCtrl'
      }
    }
  })
  .state('modal-lg.archiveCourse', {
    url: '/courses/:id/archive',
    data: {
      pageTitle: 'Archive Class',
      authorizedRoles: ['instructor','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/archive-course-modal.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.unarchiveCourse', {
    url: '/classes/:id/unarchive',
    data: {
      pageTitle: 'Unarchive Class',
      authorizedRoles: ['instructor','developer','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/archive-course-modal.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.lockCourse', {
    url: '/classes/:id/lock',
    data: {
      pageTitle: 'Lock Course',
      authorizedRoles: ['instructor','admin'],
      actionType: 'lock'
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/lock-course-modal.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.unlockCourse', {
    url: '/classes/:id/unlock',
    data: {
      pageTitle: 'Unlock Course',
      authorizedRoles: ['instructor','admin'],
      actionType: 'unlock'
    },
    resolve: {
      course: function($stateParams,CoursesService) {
        return CoursesService.get($stateParams.id);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/lock-course-modal.html',
        controller: 'UpdateCourseModalCtrl'
      }
    }
  })

  .state( 'modal-lg.editCourse', {
    url: '/classes/:id/edit',
    data: {
      pageTitle: 'Edit Class Info',
      authorizedRoles: ['instructor','admin']
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
        templateUrl: 'instructor/courses/edit-course-modal.html',
        controller: 'EditCourseModalCtrl'
      }
    }
  })

  .state('modal-lg.assignGamesToCourse', {
    url: '/classes/:id/games',
    data: {
      pageTitle: 'Assign Games',
      authorizedRoles: ['instructor','admin']
    },
    resolve: {
      course: function($stateParams, CoursesService) {
        return CoursesService.get($stateParams.id);
      },
      gamesInPlan: function(GamesService) {
        return GamesService.getGamesForPlan();
      },
      allGames: function(GamesService) {
          return GamesService.active('basic');
      }
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/assign-games-modal.html',
        controller: 'AssignGamesModalCtrl'
      }
    }
  })

  .state('modal-lg.removeInvalidGame', {
      url: '/classes/:id/remove/:gameId',
      data: {
          pageTitle: 'Remove Game Not in Plan',
          authorizedRoles: ['instructor','admin'],
          reloadNextState: false
      },
      resolve: {
          allGames: function(GamesService) {
            return GamesService.active('basic');
          },
          course: function ($stateParams, CoursesService) {
              return CoursesService.get($stateParams.id);
          }
      },
      views: {
          'modal@': {
              templateUrl: 'instructor/courses/remove-invalid-game.html',
              controller: function($scope, course, allGames, $stateParams, $rootScope, $timeout, $window, CoursesService, UtilService) {
                    $scope.gameId = $stateParams.gameId;
                    $scope.course = course;
                    $scope.request = {success: false};
         
                    allGames.some(function(game) {
                        if (game.gameId == $scope.gameId) {
                            $scope.game = game;
                            return true;
                        }
                        return false;
                    });

                    $scope.removeGame = function(courseData, game) {
                        courseData.games = courseData.games.filter(function (el) {
                            return el.id !== game.gameId;
                        });
         
                        CoursesService.updateGames(courseData)
                        .success(function(data, status, headers, config) {
                            $rootScope.$broadcast('courses:updated');
                            $scope.closeAndReload();
                        })
                        .error(function(data, status, headers, config) {
                            $log.error(data);
                            $scope.errors.push(data.error);
                        });
                    };
                    $scope.closeAndReload = function() {
                        $scope.close();
                        $timeout(function() {
                            $window.location.reload();
                        }, 100);
                    };
              }
          }
      }
  })

  .state('modal-lg.enableAllPremiumGamesToCourse', {
      url: '/classes/:id/assigned/:premiumGamesAssigned',
      data: {
          pageTitle: 'Enable/Disable Premium Games',
          authorizedRoles: ['instructor','admin'],
          reloadNextState: false
      },
      resolve: {
          course: function ($stateParams, CoursesService) {
              return CoursesService.get($stateParams.id);
          }
      },
      views: {
          'modal@': {
              templateUrl: 'instructor/courses/enable-all-premium-games-modal.html',
              controller: function($scope, course, $stateParams, $timeout, $window, CoursesService, UtilService) {
                $scope.premiumGamesAssigned = $stateParams.premiumGamesAssigned === 'true';
                $scope.course = course;
                $scope.request = {success: false};
                $scope.unassignAllPremiumGames = function(course) {
                    UtilService.submitFormRequest($scope.request, function() {
                        return CoursesService.unassignAllPremiumGamesFromCourse(course);
                    });
                };
                $scope.assignAllPremiumGames = function(course) {
                    UtilService.submitFormRequest($scope.request, function () {
                        return CoursesService.assignAllPremiumGamesFromCourse(course);
                    });
                };
                $scope.closeAndReload = function() {
                    $scope.close();
                    $timeout(function() {
                        $window.location.reload();
                    }, 100);
                };
              }
          }
      }
  })

  .state( 'root.courses.showStudentList', {
    url: '/:id/students',
    data: {
      pageTitle: 'View Student List',
      authorizedRoles: ['instructor','admin']
    },
    resolve: {
      students: function(CoursesService, $stateParams) {
        return CoursesService.getWithStudents($stateParams.id)
          .then(function(response) { return response.users; });
      }
    },
    views: {
      'studentList': {
        templateUrl: 'instructor/courses/student-list.html',
        controller: 'StudentListCtrl'
      }
    }
  })

  .state( 'root.courses.archived.showStudentList', {
    url: '/:id/students',
    data: {
      pageTitle: 'View Student List',
      authorizedRoles: ['instructor','admin']
    },
    resolve: {
      students: function(CoursesService, $stateParams) {
        return CoursesService.getWithStudents($stateParams.id)
          .then(function(response) { return response.users; });
      }
    },
    views: {
      'studentList': {
        templateUrl: 'instructor/courses/student-list.html',
        controller: 'StudentListCtrl'
      }
    }
  })


  .state( 'modal-lg.unenrollStudent', {
    url: '/classes/:id/students/:studentId/unenroll',
    data:{
      pageTitle: 'Unenroll Student',
      authorizedRoles: ['instructor','admin']
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/student-unenroll-modal.html',
        controller: 'UnenrollStudentModalCtrl'
      }
    },
    resolve: {
      course: function(CoursesService, $stateParams) {
        return CoursesService.get($stateParams.id);
      },
      student: function(UserService, $stateParams) {
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

  .state( 'modal-lg.editStudent', {
    url: '/classes/:id/students/:studentId/edit',
    data:{
      pageTitle: 'Edit Student Information',
      authorizedRoles: ['instructor','admin']
    },
    views: {
      'modal@': {
        templateUrl: 'instructor/courses/student-edit-modal.html',
        controller: 'EditStudentModalCtrl'
      }
    },
    resolve: {
      course: function(CoursesService, $stateParams) {
        return CoursesService.get($stateParams.id)
          .then(function(response) {
            if (response.status < 300) {
              return response.data;
            } else {
              return response;
            }
          });
      },
      student: function(UserService, $stateParams) {
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

  .state( 'modal-lg.addStudents', {
      url: '/classes/:id/students/add',
      data:{
          pageTitle: 'Import Students',
          authorizedRoles: ['instructor','admin']
      },
      views: {
          'modal@': {
              templateUrl: 'instructor/courses/add-students-modal.html',
              controller: 'AddStudentsModalCtrl'
          }
      },
      resolve: {
          course: function(CoursesService, $stateParams) {
              return CoursesService.get($stateParams.id)
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

  .state( 'modal-lg.addStudentsHelp', {
      url: '/classes/:id/students/add',
      data:{
          pageTitle: 'FAQs',
          authorizedRoles: ['instructor','admin']
      },
      views: {
          'modal@': {
              templateUrl: 'instructor/courses/add-students-help-modal.html',
              controller: 'AddStudentsHelpModalCtrl'
          }
      },
      resolve: {
	      course: function(CoursesService, $stateParams) {
		      return CoursesService.get($stateParams.id)
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
    parent: 'courses',
    url: '/:courseId/games/:gameId/lock',
    data: {
      pageTitle: 'Lock Missions',
      authorizedRoles: ['instructor','admin'],
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
        templateUrl: 'instructor/courses/lock-missions-modal.html',
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
      authorizedRoles: ['instructor','admin'],
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
        templateUrl: 'instructor/courses/lock-missions-modal.html',
        controller: 'LockMissionsModalCtrl'
      });

      modalInstance.result.finally(function(result) {
        return $state.transitionTo('courses', null, {reload: true});
      });
    }
  });
})

.controller( 'CoursesCtrl',
  function ($scope, $rootScope, $http, $log, $state, $filter, $timeout, courses, allGames, CoursesService, availableGamesForLicense, currentPlan, availableSeats) {
    $scope.courses = courses;
    $scope.MAX_GAMES_COUNT = allGames.length;
    $scope.currentPlan = currentPlan;
	$scope.availableSeats = availableSeats;

    // Decide whether to show active or archived courses
    $scope.showArchived = !!$state.includes('root.courses.archived');
    $scope.courseKey = -1;
    $scope.gamesInfo = {};
    angular.forEach(allGames, function(game) {
      if (availableGamesForLicense[game.gameId]) {
        game.availableForLicense = true;
      }
      $scope.gamesInfo[game.gameId] = game;
    });

    $scope.showCourseEdit = function(course) {
      return (course && !course.archived && (course.lmsType == 'glasslab'));
    };

    $scope.collapseList = function() {
      $timeout(function() {
        angular.forEach($scope.courses, function (course) {
          course.isOpen = false;
        });
      }, 100).then(function() {
        // We need this timeout to give the list enough time to collapse
        // before transitioning back to the main courses state.
        $timeout(function() {
          if ($scope.showArchived) {
            $state.go('root.courses.archived');
          } else {
            $state.go('root.courses');
          }
        }, 600);
      });
    };

    $rootScope.$on('courses:updated', function(event, data) {
      CoursesService.getEnrollments()
        .then(function(response) {
              $timeout(function() {
                  $state.go($state.current, {}, {reload: true});
              }, 100);
        });
    });

})

.controller( 'NewCourseModalCtrl',
  function ( $scope, $rootScope, $state, $http, $log, $timeout, courses, CoursesService, UserService, CHECKLIST, gamesInPlan) {
  $scope.gamesInPlan = gamesInPlan;
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
        if (!$scope.currentUser.ftue ||
            $rootScope.currentUser.ftue < 4) {
          UserService.updateUserFTUE(CHECKLIST.createCourse);
        }
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
        $scope.formProgress.errors.push(data.error);
      });
  };

  $scope.finish = function() {
    $rootScope.$broadcast('courses:updated');
    $scope.close();
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
    courseData.premiumGamesAssigned = false;
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
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, allGames, gamesInPlan, CoursesService) {

  /* TODO: Clean this up. */
  var _gamesById = {};
  $scope.gamesInPlan = [];
  $scope.errors = [];
  angular.forEach(allGames, function(game) {
    _gamesById[game.gameId] = game;
  });
  /*  Done so that check-list model array maps to the same value as check-list value */
  angular.forEach(gamesInPlan, function(game) {
      var gameToAdd = _gamesById[game.gameId];
      $scope.gamesInPlan.push(gameToAdd);
  });

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  } else {

    /* Augments course games (course specific info) with basic info  */
    var gamesToAdd = [];
    angular.forEach(course.games, function(game) {
      var gameToAdd = _gamesById[game.id];
      if (gameToAdd) {
          gameToAdd.settings = angular.copy(game.settings);
          gameToAdd.assigned = angular.copy(game.assigned);
      }
        gamesToAdd.push(gameToAdd);
    });
    course.games = gamesToAdd;
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
        $scope.errors.push(data.error);
      });
  };

})

.controller('StudentListCtrl',
  function ($scope, $rootScope, $state, $stateParams, $timeout, $log, students, CoursesService) {
    $scope.students = students;
    var activeCourses = $scope.$parent.courses;
    var hasOpenCourse = function(courses) {
      return _.any(courses, function(course) { return _.has(course, 'isOpen'); });
    };

    var getOpenCourseId = function(courses) {
      var openCourseId = null;
      angular.forEach(courses, function (course) {
        if (course.isOpen) { openCourseId = course.id; }
      });
      return openCourseId;
    };

    $rootScope.$on('student:updated', function(event, args) {
      CoursesService.getWithStudents($stateParams.id)
        .then(function(response) {
          $scope.students = response.users;
        });
    });

    if (!hasOpenCourse(activeCourses)) {
      angular.forEach(activeCourses, function (course) {
        $timeout(function() {
          course.isOpen = (course.id == $stateParams.id);
        }, 10);
      });
    } else if (getOpenCourseId(activeCourses) != $stateParams.id) {
      angular.forEach(activeCourses, function (course) {
        $timeout(function() {
          course.isOpen = (course.id == $stateParams.id);
        }, 10);
      });
    }

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
          $rootScope.$broadcast('student:updated');
          $rootScope.$broadcast('courses:updated');
          $scope.close();
        })
        .error(function(data, status, headers, config) {
          $scope.error = data.error;
          $log.error(data);
        });
    };

})

.controller('EditStudentModalCtrl',
  function($scope, $rootScope, $state, $log, $timeout, course, student, UserService, AuthService) {
    $scope.course = course;
    $scope.student = student;

    $scope.validatePassword = AuthService.validatePassword;
    $scope.validatePasswordMessage = AuthService.validatePasswordMessage;
    $scope.passwordMinLength = AuthService.passwordMinLength;
            
    $scope.editInfo = function(student) {
      UserService.update(student, false)
        .success(function(data, status, headers, config) {
          $rootScope.$broadcast('student:updated');
          $scope.close();
        })
        .error(function(data, status, headers, config) {
          $log.error(data);
          $scope.error = data.error;
        });
    };

})

.controller('AddStudentsModalCtrl',
    function($scope, $rootScope, $state, $log, $timeout, course, UserService, AuthService) {
        $scope.course = course;

	    $scope.studentsUpload = {};
	    $scope.studentsUpload.src = "";

	    $scope.eula = false;

	    $scope.students = [];

	    $scope.studentErrors = null;
	    $scope.notEnoughSpace = false;

	    $scope.stages = {
	        upload: "upload",
		    preview: "preview",
		    success: "success",
		    error: "error"
        };
        $scope.stage = $scope.stages.upload;

        $scope.uploadInProgress = false;
        $scope.invalidInput = false;

        $scope.downloadTemplate = function() {
            var filename = 'bulk-upload-template.csv';
            var contents = "Last Initial,First Name,Screen Name,Password\n";

            // IE does not support downloading files except with Blobs.
	        if (/MSIE 10/i.test(navigator.userAgent) ||
                (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) ||
		        /Edge\/\d./i.test(navigator.userAgent)) {
	            window.navigator.msSaveOrOpenBlob(new Blob([contents]), filename);
            } else {
	            var link = document.createElement('a');
	            link.setAttribute('href', encodeURI("data:text/csv;base64," + btoa(contents)));
	            link.setAttribute('download', filename);
	            link.click();
            }
        };

	    $scope.importStudents = function() {
		    if (!String.prototype.startsWith) {
			    String.prototype.startsWith = function(searchString, position){
				    position = position || 0;
				    return this.substr(position, searchString.length) === searchString;
			    };
		    }

		    var input = $scope.studentsUpload.src;
		    if (!input.startsWith("data:text/csv;base64,") &&
                !input.startsWith("data:text/plain;base64,") &&
			    !input.startsWith("data:;base64,")) {
			    $scope.invalidInput = true;
                return;
		    }

		    // TODO: throw error for invalid format?
		    var obj = [];
		    try {
			    var csvData = atob(input.split("base64,")[1]);
			    var rows = csvData.split('\n').slice(1); // Remove header row
			    angular.forEach(rows, function (val) {
				    var row = val.split(',');
				    if (row.length === 4) {
					    obj.push({
						    lastName: row[0].replace(/^"(.+)"$/,'$1'),
						    firstName: row[1].replace(/^"(.+)"$/,'$1'),
						    username: row[2].replace(/^"(.+)"$/,'$1'),
						    password: row[3].replace(/^"(.+)"$/,'$1')
					    });
				    }
			    });
		    } catch (err) {
			    $scope.invalidInput = true;
			    return;
            }

		    $scope.invalidInput = false;
            $scope.students = obj;
		    $scope.stage = $scope.stages.preview;
	    };

	    $scope.uploadStudents = function() {
		    $scope.uploadInProgress = true;
	        try {
		        UserService.bulkRegister({students: $scope.students, courseId: $scope.course.id})
			        .success(function (data, status, headers, config) {
				        if (!data.error) {
					        $scope.stage = $scope.stages.success;
				        } else {
					        if (data.error.studentErrors) {
						        $scope.studentErrors = data.error.studentErrors;
					        } else if (data.error.notEnoughSpace) {
						        $scope.notEnoughSpace = data.error.notEnoughSpace;
					        }
					        $scope.stage = $scope.stages.error;
				        }
				        $scope.uploadInProgress = false;
			        })
			        .error(function (data, status, headers, config) {
				        $scope.stage = $scope.stages.error;
				        $scope.uploadInProgress = false;
			        });
	        } catch(err) {
		        $scope.stage = $scope.stages.error;
		        $scope.uploadInProgress = false;
            }
	    };

	    $scope.nonuniqueError = function() {
		    for(var key in $scope.studentErrors) {
			    if ($scope.studentErrors[key].indexOf('username') >= 0) {
				    return true;
			    }
		    }
        };

	    $scope.passwordError = function() {
		    for(var key in $scope.studentErrors) {
			    if ($scope.studentErrors[key].indexOf('password') >= 0) {
				    return true;
			    }
		    }
	    };

	    $scope.initialError = function() {
		    for(var key in $scope.studentErrors) {
			    if ($scope.studentErrors[key].indexOf('initial') >= 0) {
				    return true;
			    }
		    }
	    };

	    $scope.unknownError = function() {
		    for(var key in $scope.studentErrors) {
			    if ($scope.studentErrors[key].indexOf('unknown') >= 0) {
				    return true;
			    }
		    }
	    };

	    $scope.upgradeAccount = function() {
		    $scope.close();
	    };

	    $scope.done = function() {
		    $rootScope.$broadcast('courses:updated');
		    $scope.close();
        };

	    $scope.resetState = function() {
		    $scope.stage = $scope.stages.upload;
		    $scope.studentsUpload = {};
		    $scope.studentsUpload.src = "";
		    angular.element("input[type='file']").val(null);
		    $scope.invalidInput = false;
		    $scope.eula = false;
		    $scope.students = [];
		    $scope.studentErrors = null;
		    $scope.notEnoughSpace = false;
		    $scope.uploadInProgress = false;
        };
    }
)

.controller('AddStudentsHelpModalCtrl',
    function($scope, $rootScope, $state, $log, $timeout, course, UserService, AuthService) {
	    $scope.course = course;
    }
)

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

})

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);


