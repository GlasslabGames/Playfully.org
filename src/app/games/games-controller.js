angular.module( 'playfully.games', [
  'ngOrderObjectBy',
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
      },
      myGames: function(GamesService) {
        return GamesService.getMyGames();
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
  .state('games.detail.check', {
    url: '/check',
    templateUrl: 'games/game-detail-check-spec.html'
  })
  .state('games.detail.reviews', {
    url: '/reviews',
    templateUrl: 'games/game-detail-reviews.html'
  })
  .state('games.detail.lessonPlans', {
    url: '/lesson-plans',
    templateUrl: 'games/game-detail-lesson-plans.html',
    data: { authorizedRoles: ['instructor','admin'] }
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
  .state( 'games.play-page', {
    url: '/:gameId/play-page',
    data: {
      authorizedRoles: ['student', 'instructor','admin']
    },
    controller: 'GamePlayPageCtrl',
    templateUrl: 'games/game-play-page.html',
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    }
  })
  .state( 'games.missions', {
    parent: 'games.detail.product',
    url: '/play-missions',
    data: {
      authorizedRoles: ['student', 'instructor','admin']
    },
    onEnter: function($stateParams, $state, $modal) {
      var gameId = $stateParams.gameId;
      $modal.open({
        size: 'lg',
        keyboard: false,
        resolve: {
          gameMissions: function(GamesService) {
            return GamesService.getGameMissions(gameId);
          },
          gameId: function(){
            return gameId;
          }
        },
        templateUrl: 'games/game-play-missions.html',
        controller: 'GameMissionsModalCtrl'

      });
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
  function($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService) {
    // angular.forEach(games, function(game) {
    //   if (game.gameId == $stateParams.gameId) {
    //     $scope.game = game;
    //   }
    // });
    $scope.currentPage = null;
    $scope.gameId = $stateParams.gameId;
    $scope.gameDetails = gameDetails;
    $scope.navItems = gameDetails.pages;

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

    $scope.isAuthenticated = function() {
      return AuthService.isAuthenticated();
    };

    $scope.hasPermsToPlayGame = function() {
      // find game in mygames
      for(var i = 0; i < myGames.length; i++){
        if(myGames[i].gameId === $scope.gameId) {
          return true;
        }
      }
      // default
      return false;
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

    $scope.goToPlayGame = function(gameId) {
      $window.location = "/games/"+gameId+"/play-"+gameDetails.play.type;
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
.controller( 'GameMissionsModalCtrl', function ($scope, $state, $rootScope, $window, $log, $timeout, $stateParams, AuthService, gameMissions, gameId) {
  $scope.gameMissions = gameMissions;
  $scope.gameId = gameId;

  $scope.goTo = function(path, target) {
    if(target) {
      $window.open(path, target);
    } else {
      $window.location = path;
    }
  };

  $scope.isAuthorized = function(type) {
    return (AuthService.isAuthenticated() && AuthService.isAuthorized(type));
  };

  $scope.closeModal = function(){
    $scope.$close(true);
    return $timeout(function () {
      // TODO: update route to parent if need to
      //$state.go($state.current.name, {}, { reload: true });
    }, 100);
  };
})
.controller( 'GamePlayPageCtrl', function ($scope, $sce, $sceDelegate, $state, $rootScope, $log, $timeout, gameDetails) {
  $scope.gamePlayInfo = {};

  if(gameDetails &&
     gameDetails.play &&
     gameDetails.play.page ) {
    $scope.gamePlayInfo = gameDetails.play.page;

    //$scope.gamePlayInfo.embed = $sceDelegate.trustAs($sce.RESOURCE_URL, $scope.gamePlayInfo.embed);

    setTimeout( function() {
      var flashOutput = '' +
        '<object name=\"flashObj\" type=\"application\/x-shockwave-flash\" data=\"' + $scope.gamePlayInfo.embed+ '\" width=\"' + $scope.gamePlayInfo.size.width + '\" height=\"' + $scope.gamePlayInfo.size.height + '\" id=\"Sample\" style=\"float: none; vertical-align:middle\">' +
          '<param name=\"movie\" value=\"' + $scope.gamePlayInfo.embed + '\" />' +
          '<param name=\"quality\" value=\"high\" />' +
          '<param name=\"bgcolor\" value=\"#ffffff\" />' +
          '<param name=\"play\" value=\"true\" />' +
          '<param name=\"loop\" value=\"true\" />' +
          '<param name=\"wmode\" value=\"window\" />' +
          '<param name=\"scale\" value=\"showall\" />' +
          '<param name=\"menu\" value=\"true\" />' +
          '<param name=\"devicefont\" value=\"false\" />' +
          '<param name=\"salign\" value=\"\" />' +
          '<param name=\"allowScriptAccess\" value=\"always\" />' +
          '<a href=\"http://www.adobe.com/go/getflash\">' +
            '<img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" />' +
          '</a>' +
          '<embed name="flashObj\" src=\"' + $scope.gamePlayInfo.embed+ '\" width=\"' + $scope.gamePlayInfo.size.width + '\" height=\"' + $scope.gamePlayInfo.size.height + '\"' +
            'type=\"application/x-shockwave-flash\" allowScriptAccess=\"always\">' +
          '</embed>' +
        '</object>';
      $( ".gl-gamePlay-embedded" ).html( flashOutput );
    }, 100);
  }
});
