angular.module( 'playfully.games', [
  'ui.router',
  'games'
], function($compileProvider){
  // allow custom url
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|simcityedu):/);
})

.config(function ( $stateProvider) {
  $stateProvider.state( 'games', {
    abstract: true,
    url: '/games',
    views: {
      'main': {
        template: '<div ui-view></div>'
      }
    }
  })
  .state('games.default', {
    url: '',
    onEnter: function($state, $log, AuthService) {
      if(AuthService.isLoginType('clever')){
        $state.transitionTo('games.detail.product', { gameId: 'SC' });
      }
      else if(AuthService.isLoginType('icivics')){
        $state.transitionTo('games.detail.product', { gameId: 'AW-1' });
      } else {
        $state.transitionTo('games.detail.product', { gameId: 'AA-1' });
      }
    }
  })
  .state('games.detail', {
    abstract: true,
    url: '/:gameId',
    templateUrl: 'games/game-detail.html',
    controller: 'GameDetailCtrl',
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    },
    data: {
      pageTitle: 'Game Detail'
    }

  })
  .state('games.detail.product', {
    url: '',
    templateUrl: 'games/game-detail-product.html'
  })
  .state('games.detail.standards', {
    url: '/standards',
    templateUrl: 'games/game-detail-standards.html'
  })
  .state('games.detail.research', {
    url: '/research',
    templateUrl: 'games/game-detail-research.html'
  })
  .state('games.detail.reviews', {
    url: '/reviews',
    templateUrl: 'games/game-detail-reviews.html'
  })
  .state('games.detail.lessonPlans', {
    url: '/lesson-plans',
    templateUrl: 'games/game-detail-lesson-plans.html',
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
  })

  .state( 'games.missions', {
    parent: 'games.detail',
    url: '/missions',
    data: {
      pageTitle: 'Missions',
      authorizedRoles: ['student', 'instructor']
    },
    onEnter: function($stateParams, $state, $modal) {
      var gameId = $stateParams.gameId;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          gameDetails: function(GamesService) {
            if(gameId) {
              return GamesService.getDetail(gameId);
            }
          },
          gameMissions: function(GamesService) {
            if(gameId) {
              return GamesService.getMissions(0, gameId);
            }
          }
        },
        templateUrl: 'games/game-missions.html',
        controller: 'GameMissionsModalCtrl'

      }).result.then(function(result) {
          if (result) {
            return $state.transitionTo('games.detail');
          }
      });
    }
  })
  ;
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

    // $scope.$on('$stateChangeSuccess',
    //   function(event, toState, toParams, fromState, fromParams) {
        // $log.info(toState);
        // var toPageId = toState.name.split('.')[1] || 'product';
        // angular.forEach($scope.navItems, function(navItem) {
        //   if (navItem.id == toPageId) {
        //     navItem.isActive = true;
        //     $scope.currentPage = navItem;
        //     $state.current.data.pageTitle = navItem.title;
        //   } else {
        //     navItem.isActive = false;
        //   }
    //     });
    // });

    $scope.isAuthorized = function() {
      return (AuthService.isAuthenticated() && AuthService.isAuthorized('instructor'));
    };

    $scope.goToGameSubpage = function(dest) {
      if (dest.authRequired && !AuthService.isAuthorized('instructor')) {
      } else {
        $state.go('games.detail.' + dest.id);
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
.controller( 'GameMissionsModalCtrl', function ($scope, $rootScope, $log, gameDetails, gameMissions) {
  $scope.gameDetails = gameDetails;
  $scope.gameMissions = gameMissions;
});

