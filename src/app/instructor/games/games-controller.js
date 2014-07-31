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
      authorizedRoles: ['instructor'],
      pageTitle: 'Game Detail'
    }

  });
})


.controller( 'GameDetailCtrl',
  function($scope, $state, $stateParams, $log, games, gameDetails) {
    angular.forEach(games, function(game) {
      if (game.gameId == $stateParams.gameId) {
        $scope.game = game;
      }
    });
    $state.current.data.pageTitle = $scope.game.longName;
    $scope.gameDetails = gameDetails;

    $scope.navItems = [
      { id: 'product', title: 'Product Description', isActive: true },
      { id: 'standards', title: 'Standards Alignment' },
      { id: 'lessonPlans', title: 'Lesson Plans & Videos' },
      { id: 'research', title: 'Research' },
      { id: 'reviews', title: 'Reviews' }
    ];

    $scope.goToGameSubpage = function(dest) {
      $log.info(dest);
    };
});
