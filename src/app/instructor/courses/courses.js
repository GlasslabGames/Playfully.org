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
        templateUrl: 'instructor/courses/courses.html'
      }
    },
    data: {
      pageTitle: 'Classes',
      authorizedRoles: ['instructor']
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  })
  .state( 'createCourseModal', {
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
    parent: 'createCourseModal',
    url: '/courses/new',
    views: {
      'modal@': {
        controller: 'NewCourseModalCtrl',
        templateUrl: 'instructor/courses/new.html'
      }
    },
    data:{
      pageTitle: 'New Course',
      authorizedRoles: ['instructor']
    }
  });
})

.controller( 'CoursesCtrl', function ( $scope, $http, $log, courses) {

  $scope.courses = courses;
  $scope.titleLimit = 60;


})
.controller( 'NewCourseModalCtrl', function ( $scope, $http, $log) {

  $scope.course = {
    title: '',
    grade: []
  };

  $scope.gradeLevels = [5, 6, 7, 8, 9, 10, 11, 12];

  $scope.someSelected = function (object) {
    return Object.keys(object).some(function (key) {
      return object[key];
    });
  };

  $scope.logIt = function() {
    $log.info($scope.course);
  };

});


