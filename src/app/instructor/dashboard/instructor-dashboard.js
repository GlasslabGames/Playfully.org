angular.module( 'instructor.dashboard', [
  'ui.router',
  'gl-err-src'
])

.config(function config( $stateProvider ) {
  $stateProvider.state('root.instructorDashboard', {
    abstract: true,
    url: 'dashboard',
    data: {
      authorizedRoles: ['instructor','manager','admin'],
      pageTitle: 'Dashboard'
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
      coursesInfo: function (activeCourses, ReportsService) {
        return ReportsService.getCourseInfo(activeCourses);
      },
      myGames: function (coursesInfo,activeCourses) {
        if (activeCourses[0]) {
          return coursesInfo[activeCourses[0].id].games;
        }
        return {};
      },
      messages: function (DashService) {
        return DashService.getMessages('message', 10, false).then(function (messages) {
          var modifiedMessages = [];
          for (var key in messages) {
            var message = messages[key].value;
            if (message &&
                message.timestamp) {
              message.timeAgo = moment(new Date(message.timestamp)).fromNow();
            }
            modifiedMessages.push(message);
          }
          return modifiedMessages;
        });
      },
      currentUser: function (UserService) {
        return UserService.retrieveCurrentUser();
      }
    },
    views: {
      'main@': {
        templateUrl: 'instructor/dashboard/_instructor-dashboard.html',
        controller: function ($scope, $rootScope, $state, $timeout, $log, myGames,currentUser, UserService, CHECKLIST) {
          $scope.ftue = parseInt(currentUser.data.ftue);
          $scope.isCheckListComplete = $scope.ftue >= 3;
          $scope.checkList = function (order) {
            if ($scope.ftue == order ||
                $scope.ftue > 0 &&
                order <= $scope.ftue) {
              return true;
            }
            return false;
          };
          $scope.closeFTUE = function () {
            $scope.introContainer.isCollapsed = !$scope.introContainer.isCollapsed;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            UserService.updateUserFTUE(CHECKLIST.closeFTUE);
          };
          $scope.introContainer = {
            isCollapsed: false
          };

        }
      }
    }
  })

  .state('root.instructorDashboard.default', {
    url: '',
    controller: function($scope, $rootScope, $state, $log, myGames, activeCourses, currentUser, CHECKLIST, UserService) {

      // Decide which state to send the instructor to, based on whether they've completed the checklist.
      if (!$scope.$parent.isCheckListComplete) {
        var hasStudents = _.any(activeCourses, function (course) {
          return course.studentCount > 0;
        });
        if (hasStudents) {
          UserService.updateUserFTUE(CHECKLIST.inviteStudents);
          $scope.$parent.ftue = 3;
          $scope.$parent.isCheckListComplete = true;
          $state.go('root.instructorDashboard.reports',
              {gameId: myGames[0].gameId, courseId: activeCourses[0].id});
          return;
        }
        $state.go('root.instructorDashboard.intro');
      }
      else if( myGames.length === 0 ) {
        $state.go('root.instructorDashboard.intro');
      }
      else {
        $state.go('root.instructorDashboard.reports',
            {gameId: myGames[0].gameId, courseId: activeCourses[0].id});
      }
    }
  })

  .state('root.instructorDashboard.intro', {
    url: '/intro',
    templateUrl: 'instructor/dashboard/_dashboard-example.html',
    controller: function($scope,currentUser,messages) {
      $scope.messages = messages;
      $scope.status = {
        showMessages: true
      };
    }
  })

  .state('root.instructorDashboard.reports', {
    url: '/game/:gameId/course/:courseId',
    resolve: {
      myGames: function ($stateParams, coursesInfo) {
        // all available games for this course
        return coursesInfo[$stateParams.courseId].games;
      },
      defaultGameId: function ($stateParams, myGames) {
        var defaultGameId = myGames[0].gameId;
        // check if current game is in course, if not, set default as first available game.
        angular.forEach(myGames, function (game) {
          if (game.gameId === $stateParams.gameId) {
            defaultGameId = game.gameId;
          }
        });
        return defaultGameId;
      }
    },
    templateUrl: 'instructor/dashboard/_dashboard-reports.html',
    controller: 'InstructorDashboardCtrl'
  });
})



.controller('InstructorDashboardCtrl', function($scope, $window, $rootScope, $state, $stateParams, $log, $timeout, activeCourses, coursesInfo, myGames, defaultGameId, messages, GamesService, ReportsService) {

  $scope.students = {};
  $scope.courses = {};
  $scope.myGames = myGames;
  $scope.shoutOuts = [];
  $scope.watchOuts = [];
  $scope.messages = messages;
  $scope.status = {
    selectedGameId: defaultGameId,
    selectedGame: null,
    nextGameId: null,
    prevGameId: null,
    averageMissionProgress: null,
    avgTotalTimePlayed: null,
    showMessages: true,
    hasStudents: true
  };

  // Courses - Setup course options and select course ///////////
  $scope.courses.isOpen = false;
  $scope.courses.selectedCourseId = $stateParams.courseId;
  $scope.courses.options = {};

  angular.forEach(activeCourses, function (course) {
    $scope.courses.options[course.id] = course;
  });
  $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

  // Controls for Average Mission Progress

  $scope.progressArc = {
    size: 120,
    progress: 0,
    strokeWidth: 20,
    stroke: '#00a79d',
    counterClockwise: '',
    background: '#cccccc'
  };


  // Trigger to open dropdown from main body, not just arrow
  $scope.toggleDropdown = function ($event, collection) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[collection].isOpen = !$scope[collection].isOpen;
      console.log('YEAHHH', $scope[collection].isOpen);
  };

  $scope.goToReport = function (reportId, courseId, gameId, groupId) {
    if (reportId === 'achievements' && gameId === 'SC') {
      $state.go('root.reports.details.' + 'mission-progress', {
        courseId: courseId,
        gameId: gameId,
        groupId: groupId
      });
    } else {
      $state.go('root.reports.details.' + reportId, {courseId: courseId, gameId: gameId, groupId: groupId});
    }
  };

  var _setSelectedGameById = function(gameId) {
    var selectedIndex = _.findIndex($scope.myGames, {'gameId': gameId});
    $scope.status.selectedGame = $scope.myGames[selectedIndex];

    var prevIndex = _getPrevIndex($scope.myGames, selectedIndex);
    $scope.status.prevGameId = $scope.myGames[prevIndex].gameId;

    var nextIndex = _getNextIndex($scope.myGames, selectedIndex);
    $scope.status.nextGameId = $scope.myGames[nextIndex].gameId;
  };

  /* Given an array and current index, find the previous index */
  var _getPrevIndex = function(ary, idx) {
    var prevIndex = idx - 1;
    if (prevIndex < 0) { prevIndex = ary.length - 1; }
    return prevIndex;
  };

  /* Given an array and current index, find the next index */
  var _getNextIndex = function(ary, idx) {
    var nextIndex = idx + 1;
    if (nextIndex > ary.length - 1) { nextIndex = 0; }
    return nextIndex;
  };

  /* Create an object whose keys are student.id and value is student */
  // All students from all courses
  var _populateStudentsListFromCourses = function(courseList) {
    _.each(courseList, function(course) {
      _.each(course.users, function(student) {
        if (!_.has($scope.students, student.id)) {
          $scope.students[student.id] = student;
        }
      });
    });
  };

  var _initDashboard = function() {
    // populates student list
    _populateStudentsListFromCourses(activeCourses);
    // set current game
    _setSelectedGameById($stateParams.gameId);

    $scope.$watch('courses.selectedCourseId', function(newValue, oldValue) {
      if (newValue) {
        $state.go('root.instructorDashboard.reports', {
          gameId: $scope.status.selectedGameId,
          courseId: newValue
        });
      }
      });
      $scope.$watch('status.selectedGameId', function (newValue, oldValue) {
        if (newValue) {
          $state.go('root.instructorDashboard.reports', {
            gameId: newValue,
            courseId: $scope.courses.selectedCourseId
          });
        }
      });

    if ($scope.status.hasStudents && $scope.status.selectedGame.assigned) {
      _calculateTotalTimePlayed($scope.courses.selectedCourseId, $scope.status.selectedGameId, $scope.students);
      _getReports();
    }
  };

  var _getReports = function () {
    GamesService.getAllReports($stateParams.gameId).then(function (data) {
      if (data.list && data.list.length) {
        var hasSOWO = _.some(data.list, {'id': 'sowo'});
        var hasMissionProgress = _.some(data.list, {'id': 'mission-progress'});

        if (hasSOWO) {
          ReportsService.get('sowo', $stateParams.gameId, $stateParams.courseId)
              .then(function (data) {
                _populateSOWO(data);
              },
              function (data) {
                $log.error(data);
              });
        }
        if (hasMissionProgress) {
          ReportsService.get('mission-progress', $stateParams.gameId, $stateParams.courseId)
              .then(function (data) {
                _calculateMissionProgress(data);
              },
              function (data) {
                $log.error(data);
              });
        }
      }
    });
  };

  var _calculateMissionProgress = function(students) {
    var numOfStudents = students.length;
    var totalAverage = 0;
    if (students.length) {
      _.each(students, function (student) {
        var totalCompleted = 0;
        _.each(student.missions, function (mission) {
          if (mission.completed) {
            totalCompleted++;
          }
        });
        var average = totalCompleted / student.missions.length;
        totalAverage += average;
      });
      var avgMissionProgress = (totalAverage / numOfStudents) || 0;
      $scope.status.averageMissionProgress = Math.ceil(avgMissionProgress*100);
      $scope.progressArc.progress = avgMissionProgress;
    }
  };

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {hours = "0" + hours;}
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    var time = {'hours':hours,'minutes':minutes,'seconds':seconds};
    return time;
  };

  var _calculateTotalTimePlayed = function(courseId, gameId) {
    // find students in this course that played this game
    var students = $scope.courses.options[courseId].users;
    var sum = 0;
    var numOfStudents = 0;
    var studentIds = [];
    _.each(students, function(student) {
      studentIds.push(student.id);
    });
    GamesService.getTotalTimePlayed(gameId,studentIds).then(function(students) {
      var studentsList = students.data;
      numOfStudents = Object.keys(studentsList).length;
      for (var studentId in studentsList) {
        sum += studentsList[studentId];
      }
      if (!!numOfStudents) {
        $scope.status.avgTotalTimePlayed = String(sum / numOfStudents).toHHMMSS();
      } else {
        $scope.status.avgTotalTimePlayed = {hours:0,minutes:0,seconds:0};
      }
    }, function() {
      console.error('could not retrieve total time played');
    });
  };

  var _populateSOWO = function(data) {
    var watchOuts = [];
    var shoutOuts = [];

    _.each(data, function(obj) {
       var studentObj = _compileNameOfStudent($scope.students[obj.userId]);
      _.each(obj.results.watchout, function(wo) {
        wo.user = studentObj;
        wo.timeAgo = moment(new Date(wo.timestamp)).fromNow();
        watchOuts.push(wo);
      });
      _.each(obj.results.shoutout, function (so) {
        so.user = studentObj;
        so.timestamp = moment(new Date(so.timestamp)).fromNow();
        shoutOuts.push(so);
      });
    });

    $scope.watchOuts = watchOuts;
    $scope.shoutOuts = shoutOuts;
  };

  var _compileNameOfStudent = function(student) {
    if (!student) { return ''; }
    var name = student.firstName;
    if(student.lastName) {
      name += ' ' + student.lastName + '.';
    }

    student.name = name;
    return student;
  };

  $scope.goToLink = function (path) {
      $window.open(path, '_blank');
  };

  $scope.goToPlayGame = function (gameId,type) {
    if (type === 'missions') {
      $state.go('modal-lg.missions', {gameId: gameId});
    } else {
      $window.location = "/games/" + gameId + "/play-" + type;
    }
  };

  _initDashboard();
});

