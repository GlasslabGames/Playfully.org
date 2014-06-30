angular.module( 'playfully.dashboard-instructor', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'dashboard-instructor', {
    parent: 'site',
    url: '/dashboard',
    views: {
      'main@': {
        controller: 'DashboardInstructorCtrl',
        templateUrl: 'dashboard-instructor/dashboard-instructor.html'
      }
    },
    data:{
      pageTitle: 'Dashboard',
      authorizedRoles: ['instructor']
    }
  });
})

.controller( 'DashboardInstructorCtrl', function ( $scope, $log, GamesService) {

  $scope.games = GamesService.all();
  $log.info($scope.games);

});


