angular.module( 'instructor.games', [
  'playfully.config',
  'ui.router',
  'games',
])

.config(function ( $stateProvider, USER_ROLES) {
  $stateProvider.state( 'games', {
    url: '/games',
    onEnter: function($state) {
      $state.transitionTo('gameDetail', { gameId: 'AA-1' });
    }
  })
  .state('gameDetail', {
    url: '/games/:gameId',
    views: {
      main: {
        templateUrl: 'instructor/games/game-detail.html',
        controller: 'GameDetailCtrl'
      }
    },
    resolve: {
      games: function(GamesService) {
        return GamesService.all();
      },
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    },
    data: {
      authorizedRoles: ['instructor']
    }

  });
})


.controller( 'GameDetailCtrl',
  function($scope, $stateParams, $log, games, gameDetails) {
    angular.forEach(games, function(game) {
      if (game.gameId == $stateParams.gameId) {
        $scope.game = game;
      }
    });
    $scope.gameDetails = gameDetails;

    $scope.navItems = [
      { title: 'Product Description' },
      { title: 'Standards Alignment' },
      { title: 'Lesson Plans & Videos' },
      { title: 'Research' },
      { title: 'Reviews' }
    ];
});
