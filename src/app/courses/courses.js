angular.module( 'playfully.courses', [
  'playfully.config',
  'ui.router'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'courses', {
    url: '/classes',
    parent: 'site',
    views: {
      "main@": {
        controller: 'CoursesCtrl',
        templateUrl: 'courses/courses.html'
      }
    },
    data:{
      pageTitle: 'Classes',
      authorizedRoles: ['instructor']
    },
    resolve: {
      courses: function(CoursesService) {
        return CoursesService.getEnrollments();
      }
    }
  });
})

.controller( 'CoursesCtrl', function ( $scope, $http, $log, courses) {

  $scope.courses = courses;
  $scope.titleLimit = 60;


});


