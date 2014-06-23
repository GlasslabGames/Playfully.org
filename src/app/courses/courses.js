angular.module( 'playfully.courses', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'classes', {
    url: '/classes',
    views: {
      "main": {
        controller: 'CoursesCtrl',
        templateUrl: 'courses/courses.html'
      }
    },
    data:{ pageTitle: 'Classes' }
  });
})

.controller( 'CoursesCtrl', function CoursesController( $scope, $http, $log ) {

  $scope.classes = null;
  $scope.titleLimit = 60;

  $http.get('/api/v2/lms/courses')
    .success(function(data, status, headers, config) {
      $scope.classes = data;
      $log.info(data);
    })
    .error(function(data, status, headers, config) {
      $log.error(data);
    });

});


