angular.module( 'playfully.games', [
  'ui.router',
  'games'
])

.config(function ( $stateProvider) {
  $stateProvider.state( 'games', {
    url: '/games',
    onEnter: function($state, $log) {
      $log.info("GOT HERE");
      $state.transitionTo('gameDetail', { gameId: 'AA-1' });
    }
  })
  .state('gameDetail', {
    url: '/games/:gameId',
    views: {
      main: {
        templateUrl: 'games/game-detail.html',
        controller: 'GameDetailCtrl'
      }
    },
    resolve: {
      // games: function(GamesService) {
      //   return GamesService.all();
      // },
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    },
    data: {
      pageTitle: 'Game Detail'
    }

  })
  .state('gameDetail.product', { url: '' })
  .state('gameDetail.standards', { url: '/standards' })
  .state('gameDetail.research', { url: '/research' })
  .state('gameDetail.reviews', { url: '/reviews' })
  .state('gameDetail.lessonPlans', { url: '/lesson-plans' });
})


.controller( 'GameDetailCtrl',
  function($scope, $state, $stateParams, $log, $window, gameDetails, AuthService) {
    // angular.forEach(games, function(game) {
    //   if (game.gameId == $stateParams.gameId) {
    //     $scope.game = game;
    //   }
    // });
    $scope.currentPage = null;
    $scope.gameId = $stateParams.gameId;
    $scope.gameDetails = gameDetails;
    $log.info(gameDetails);

    $scope.navItems = [
      { id: 'product', title: 'Product Description' },
      { id: 'standards', title: 'Standards Alignment' },
      { id: 'lessonPlans', title: 'Lesson Plans & Videos', authRequired: true },
      { id: 'research', title: 'Research' },
      { id: 'reviews', title: 'Reviews' }
    ];

    $scope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        var toPageId = toState.name.split('.')[1] || 'product';
        angular.forEach($scope.navItems, function(navItem) {
          if (navItem.id == toPageId) {
            navItem.isActive = true;
            $scope.currentPage = navItem;
            $state.current.data.pageTitle = navItem.title;
          } else {
            navItem.isActive = false;
          }
        });
    });

    $scope.isAuthorized = function() {
      return (AuthService.isAuthenticated() && AuthService.isAuthorized('instructor'));
    };

    $scope.goToGameSubpage = function(dest) {
      if (dest.authRequired && !AuthService.isAuthorized('instructor')) {
      } else {
        $state.go('gameDetail.' + dest.id);
      }
    };

    $scope.goTo = function(path, target) {
        if(target) {
            $window.open(path, target);
        } else {
            $window.location = path;
        }
    };

    $scope.toggleDropdown = function($event, btn) {
      $event.preventDefault();
      $event.stopPropagation();
      btn.isOpen = !btn.isOpen;
    };
});
