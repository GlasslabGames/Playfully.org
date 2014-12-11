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
          $scope.myGames = myGames;
          $scope.showNotification = false;

          $scope.alert = {
            type: 'gl-notify',
            msg: "<strong>SimCityEDU Game Update:</strong> Be sure your students update to the latest version of the game! <a href=\"/games/SC?scrollTo=content\">Download here</a>"
          };

          $timeout(function() { $scope.showNotification = true; }, 1000);

          $scope.hideNotification = function() {
            $scope.showNotification = false;
          };
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
    templateUrl: 'instructor/dashboard/_new-dashboard-reports.html',
    controller: 'InstructorDashboardCtrl'
  });
})



.controller('InstructorDashboardCtrl', function($scope, $rootScope, $state, $stateParams, $log, $timeout, activeCourses, games, myGames, GamesService, ReportsService) {

  $scope.students = {};
  $scope.courses = {};
  $scope.games = games;
  $scope.myGames = myGames;
  $scope.watchOuts = null;


  $scope.status = {
    selectedGameId: $stateParams.gameId,
    selectedGame: null,
    nextGameId: null,
    prevGameId: null,
    selectedReport: null
  };

  // Courses - Setup course options and select course ///////////
  $scope.courses.isOpen = false;
  $scope.courses.selectedCourseId = $stateParams.courseId;
  $scope.courses.options = {};

  angular.forEach(activeCourses, function (course) {
    $scope.courses.options[course.id] = course;
  });

  $scope.courses.selected = $scope.courses.options[$stateParams.courseId];


  var _setSelectedGameById = function(gameId) {
    var selectedIndex = _.findIndex($scope.games, {'gameId': gameId});
    $scope.status.selectedGame = $scope.games[selectedIndex];

    var prevIndex = _getPrevIndex($scope.games, selectedIndex);
    $scope.status.prevGameId = $scope.games[prevIndex].gameId;

    var nextIndex = _getNextIndex($scope.games, selectedIndex);
    $scope.status.nextGameId = $scope.games[nextIndex].gameId;
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

  // gets all reports info for this game, finds sowo, and sets as selected report
  var _getReports = function() {
    GamesService.getAllReports($stateParams.gameId).then(function(data) {
      if (data.list && data.list.length) {
        $scope.status.selectedReport = _.find(data.list, {'id': 'sowo'}) || null;
        // gets report data for current game and course
        if ($scope.status.selectedReport) {
          ReportsService.get($scope.status.selectedReport.id, $stateParams.gameId, $stateParams.courseId)
            .then(function(data) { _populateWo(data); },
              function(data) { $log.error(data); });
        }
      }
    });
  };

  var _initDashboard = function() {
    // populates student list
    _populateStudentsListFromCourses(activeCourses);
    // set current game
    _setSelectedGameById($stateParams.gameId);

    $scope.$watch('courses.selectedCourseId', function(newValue, oldValue) {
      if (newValue) {
        $state.go('root.instructorDashboard.gameplay', {
          gameId: $scope.status.selectedGameId,
          courseId: newValue
        });
      }
    });
    // retrieve all reports for game
    _getReports();
  };

  var _populateWo = function(data) {
    var watchOuts = {};

    _.each(data, function(obj) {
      _.each(obj.results.watchout, function(wo) {
        if (!watchOuts.hasOwnProperty(wo.id)) {
          watchOuts[wo.id] = {
            name: wo.name,
            description: wo.description,
            students: []
          };
        }
        var studentObj = _compileNameOfStudent($scope.students[obj.userId]);
        watchOuts[wo.id].students.push(studentObj);
      });
    });
    $scope.watchOuts = watchOuts;
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

  _initDashboard();
});

