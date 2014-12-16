angular.module( 'instructor.dashboard', [
  'ui.router'
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
      }
    },
    views: {
      'main@': {
        templateUrl: 'instructor/dashboard/instructor-dashboard.html',
        controller: function ($scope, $timeout, $log, myGames) {
          //$scope.myGames = myGames;
          //$scope.showNotification = false;
          //
          //$scope.alert = {
          //  type: 'gl-notify',
          //  msg: "<strong>SimCityEDU Game Update:</strong> Be sure your students update to the latest version of the game! <a href=\"/games/SC?scrollTo=content\">Download here</a>"
          //};
          //
          //$timeout(function() { $scope.showNotification = true; }, 1000);
          //
          //$scope.hideNotification = function() {
          //  $scope.showNotification = false;
          //};
        }
      }
    }
  })

  .state('root.instructorDashboard.default', {
    url: '',
    controller: function($scope, $state, $log, myGames, activeCourses) {
      // Decide which state to send the instructor to, based on whether
      // they have courses set up.
      if (!myGames.length) {
        $state.go('root.instructorDashboard.intro');
      } else {
        $state.go('root.instructorDashboard.gameplay',
          { gameId: myGames[0].gameId, courseId: activeCourses[0].id });
      }
    }
  })

  .state('root.instructorDashboard.intro', {
    url: '/intro',
    templateUrl: 'instructor/dashboard/_dashboard-intro.html'
  })

  .state('root.instructorDashboard.gameplay', {
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
    templateUrl: 'instructor/dashboard/_new-dashboard-reports.html',
    controller: 'InstructorDashboardCtrl'
  });
})



.controller('InstructorDashboardCtrl', function($scope, $window, $rootScope, $state, $stateParams, $log, $timeout, activeCourses, coursesInfo, myGames, defaultGameId, GamesService, ReportsService, DashService) {

  $scope.students = {};
  $scope.courses = {};
  $scope.myGames = myGames;
  $scope.shoutOuts = [];
  $scope.watchOuts = [];
  $scope.messages = [];

  $scope.status = {
    selectedGameId: defaultGameId,
    selectedGame: null,
    nextGameId: null,
    prevGameId: null,
    averageMissionProgress: null,
    avgTotalTimePlayed: null
  };

  // Courses - Setup course options and select course ///////////
  $scope.courses.isOpen = false;
  $scope.courses.selectedCourseId = $stateParams.courseId;
  $scope.courses.options = {};

  angular.forEach(activeCourses, function (course) {
    $scope.courses.options[course.id] = course;
  });

  $scope.courses.selected = $scope.courses.options[$stateParams.courseId];

  // Mission Progress directive

  $scope.progressArc = {
    size: 120,
    progress: 0,
    strokeWidth: 20,
    stroke: 'darkcyan',
    counterClockwise: '',
    background: '#cccccc'
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

  var _getReports = function() {
    GamesService.getAllReports($stateParams.gameId).then(function(data) {
      if (data.list && data.list.length) {
        var hasSOWO = _.some(data.list, {'id': 'sowo'});
        var hasMissionProgress = _.some(data.list, {'id': 'mission-progress'});

        if (hasSOWO) {
          ReportsService.get('sowo', $stateParams.gameId, $stateParams.courseId)
            .then(function(data) {
                _populateSOWO(data); },
              function(data) { $log.error(data); });
        }
        if (hasMissionProgress) {
          ReportsService.get('mission-progress',$stateParams.gameId, $stateParams.courseId)
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

  var _initDashboard = function() {
    // populates student list
    _populateStudentsListFromCourses(activeCourses);
    // set current game
    _setSelectedGameById($stateParams.gameId);
    _calculateTotalTimePlayed($scope.courses.selectedCourseId,$scope.status.selectedGameId, $scope.students);
    _retrieveMessages();


    $scope.$watch('courses.selectedCourseId', function(newValue, oldValue) {
      if (newValue) {
        $state.go('root.instructorDashboard.gameplay', {
          gameId: $scope.status.selectedGameId,
          courseId: newValue
        });
      }
      });
      $scope.$watch('status.selectedGameId', function (newValue, oldValue) {
        if (newValue) {
          $state.go('root.instructorDashboard.gameplay', {
            gameId: newValue,
            courseId: $scope.courses.selectedCourseId
          });
        }
      });
    // retrieve all reports for game
    _getReports();
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
        $scope.status.avgTotalTimePlayed = sum / numOfStudents;
      } else {
        return 0;
      }
    });
  };
  var _populateSOWO = function(data) {
    var watchOuts = [];
    var shoutOuts = [];

    _.each(data, function(obj) {
       var studentObj = _compileNameOfStudent($scope.students[obj.userId]);
      _.each(obj.results.watchout, function(wo) {
        wo.user = studentObj;
        wo.timestamp = moment(new Date(wo.timestamp)).fromNow();
        watchOuts.push(wo);
        watchOuts.push(angular.copy(wo));
        watchOuts.push(angular.copy(wo));
        watchOuts.push(angular.copy(wo));
        watchOuts.push(angular.copy(wo));
        watchOuts.push(angular.copy(wo));
      });
      _.each(obj.results.shoutout, function (so) {
        so.user = studentObj;
        so.timestamp = moment(new Date(so.timestamp)).fromNow();
        shoutOuts.push(so);
        shoutOuts.push(angular.copy(so));
        shoutOuts.push(angular.copy(so));
        shoutOuts.push(angular.copy(so));
      });
    });

    $scope.watchOuts = watchOuts;
    $scope.shoutOuts = shoutOuts;
  };

  var _retrieveMessages = function () {
    var messageList = [];
    DashService.getMessages('message', 10, 'asc').then(function(messages) {
      for (var key in messages) {
        var message = messages[key].value;
        if (message &&
            message.timestamp) {
          message.timestamp = moment(new Date(message.timestamp)).fromNow();
        }
        messageList.push(message);
      }
      $scope.messages = messageList;
    });
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
  console.log('$scope.status.averageMissionProgress)',$scope.status);
});

