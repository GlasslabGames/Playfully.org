angular.module( 'playfully.games', [
  'ui.router',
  'games'
])

.config(function ( $stateProvider) {
  $stateProvider.state( 'games', {
    url: '/games',
    onEnter: function($state, $log) {
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
  .state('gameDetail.lessonPlans', {
    url: '/lesson-plans',
    data: { authorizedRoles: ['instructor'] }
  })
  .state('sdkGameAppLink', {
    url: '/sdk/game/:gameId/applink',
    data: { hideWrapper: true },
    views: {
        main: {
            controller: 'sdkGameAppLinkCtrl'
        }
    },
    resolve: {
      gameDetails: function($stateParams, GamesService) {
          return GamesService.getDetail($stateParams.gameId);
      }
    }
  });
})

.controller( 'sdkGameAppLinkCtrl',
    function($scope, $state, $stateParams, $log, $window, gameDetails) {
        if(gameDetails.applink) {
            $window.location = gameDetails.applink;
        } else {
            $window.location = "/";
        }
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
    
    /**
     * The API is providing a relative path, causing the image to break if
     * we're not at the top level. In the event that we switch to a CDN we
     * want to be able to handle full URLs, so this function won't add the
     * root slash if we have a URL or path we can trust.
     **/
    $scope.normalizeImgUrl = function (path) {
      if (path.indexOf('/') === 0 || path.indexOf('http') === 0) {
        return path;
      } else {
        return '/' + path;
      }
    };

    $scope.toggleDropdown = function($event, btn) {
      $event.preventDefault();
      $event.stopPropagation();
      btn.isOpen = !btn.isOpen;
    };
})
.controller( 'GameMissionsCtrl', function ($scope, $rootScope, $log) {

});
