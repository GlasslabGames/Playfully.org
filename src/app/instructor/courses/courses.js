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
        return CoursesService.getEnrollments();
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
        controller: 'ArchiveCourseModalCtrl',
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
  .state('transition', {
    url: 'transition?destination',
    controller: function ($state, $stateParams) {
      $state.go($stateParams.destination);
    },
    data: { authorizedRoles: ['all'] }
  });
})

.controller( 'CoursesCtrl',
  function ( $scope, $http, $log, courses, games, CoursesService) {
    $scope.courses = courses;
    $scope.showArchived = false;
    $scope.gamesInfo = {};
    angular.forEach(games, function(game) {
      $scope.gamesInfo[game.gameId] = game;
    });

})

.controller( 'NewCourseModalCtrl', function ( $scope, $http, $log, games, CoursesService) {

  $scope.games = games;
  $scope.course = null;
  $scope.createdCourse = null;
  $scope.gradeLevels = [5, 6, 7, 8, 9, 10, 11, 12];
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

.controller( 'ArchiveCourseModalCtrl', 
  function ( $scope, $rootScope, $state, $stateParams, $log, $timeout, course, CoursesService) {

  if (course.hasOwnProperty('status')) {
    $scope.error = course.data.error;
  } else {
    $scope.course = course;
  }


  $scope.archiveCourse = function (thisCourse) {
    $log.info("Attempting to archive " + thisCourse.title);
    CoursesService.archive(thisCourse)
      .success(function(data, status, headers, config) {
        $rootScope.modalInstance.close();
        // $state.go('transition', {destination: 'courses'});
        return $timeout(function () {
          $state.go('courses', {}, { reload: true });
        }, 100);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

});


