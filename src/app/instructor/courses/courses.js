angular.module( 'instructor.courses', [
  'playfully.config',
  'ui.router',
  'courses'
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
  });
})

.controller( 'CoursesCtrl', function ( $scope, $http, $log, courses) {

  $scope.courses = courses;
  $scope.titleLimit = 60;


});


