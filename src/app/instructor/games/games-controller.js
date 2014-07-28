angular.module( 'instructor.games', [
  'playfully.config',
  'ui.router',
  'games',
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'games', {
    url: '/games',
    views: {
      'main': {
        templateUrl: 'instructor/games/games.html',
        controller: 'GamesCtrl'
      }
    },
    data: {
      pageTitle: 'Games',
      authorizedRoles: ['instructor']
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      }
    }
  });
});
