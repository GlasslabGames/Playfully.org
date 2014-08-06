angular.module( 'instructor.reports', [
  'playfully.config',
  'ui.router'
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'reports', {
    url: '/reports',
    views: {
      main: {
        templateUrl: 'instructor/reports/reports.html',
        controller: 'ReportsCtrl'
      }
    },
    resolve: {
      // games: function(GamesService) {
      //   return GamesService.all();
      // },
      // gameDetails: function($stateParams, GamesService) {
      //   return GamesService.getDetail($stateParams.gameId);
      // }
    },
    data: {
      authorizedRoles: ['instructor'],
      pageTitle: 'Reports'
    }
  });
})


.controller( 'ReportsCtrl',
  function($scope, $state, $stateParams, $log) {

    $scope.courses = [
      { name: 'Period 1',
        students: [
          { firstName: 'Anika', lastName: 'Q' },
          { firstName: 'Ben', lastName: 'D' },
          { firstName: 'Carlos', lastName: 'E' },
          { firstName: 'Cynthia', lastName: 'P' }
        ]},
      { name: 'Period 2' },
      { name: 'Period 3' },
      { name: 'Period 4' }
    ];

});
