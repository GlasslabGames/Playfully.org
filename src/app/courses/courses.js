angular.module( 'playfully.courses', [
  'playfully.config',
  'ui.router'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'courses', {
    url: '/classes',
    parent: 'site',
    views: {
      "main": {
        controller: 'CoursesCtrl',
        templateUrl: 'courses/courses.html'
      }
    },
    data:{
      pageTitle: 'Classes',
      authorizedRoles: [USER_ROLES.instructor]
    }
  });
})


.controller( 'CoursesCtrl', function CoursesController( $scope, $http, $log, USER_ROLES ) {

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


