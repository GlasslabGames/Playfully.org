angular.module( 'playfully.games', [
  'ngOrderObjectBy',
  'ui.router',
  'games'
], function($compileProvider){
  // allow custom url
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|simcityedu):/);
})

.config(function ( $stateProvider) {
  $stateProvider.state( 'root.games', {
    abstract: true,
    url: 'games'
  })
  .state('root.games.default', {
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
  .state('root.games.catalog', {
    url: '/catalog',
    onEnter: function($rootScope, CHECKLIST) {

    },
    views: {
      'main@': {
        templateUrl: 'games/game-catalog.html',
        controller: 'GameCatalogCtrl'
      }
    },
    resolve: {
      allGamesInfo: function(GamesService) {
        return GamesService.all();
      },
      freeGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, { 'price': 'Free' });
      },
      premiumGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, { 'price': 'Premium Subscription' });
      },
      comingSoonGames: function (allGamesInfo) {
        return _.filter(allGamesInfo, { 'price': 'Coming Soon' });
      }
    },
    data: {
      pageTitle: 'Game Catalog'
    }
  })
  .state('root.games.detail', {
    abstract: true,
    url: '/:gameId?scrollTo',
    views: {
      'main@': {
        templateUrl: 'games/game-detail.html',
        controller: 'GameDetailCtrl'
      }
    },
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      },
      myGames: function(GamesService) {
        return GamesService.getMyGames();
      }
    },
    onEnter: function($stateParams, $state, $location, $anchorScroll, $log) {
      // GH: Added in a last-minute fashion prior to a Friday release to
      // support in-page targeting for the Download button.
      if ($stateParams.scrollTo) {
        $location.hash($stateParams.scrollTo);
        $anchorScroll();
      }
    },
    data: {
      pageTitle: 'Game Detail'
    }
  })
  .state('modal-lg.developer', {
    url: '/games/:gameId/developer',
    data: {
      pageTitle: 'Developer Info'
    },
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    },
    views: {
      'modal@': {
        templateUrl: 'games/developer.html',
        controller: function($scope, $log, gameDetails) { 
          $scope.developer = gameDetails.developer;
        }
      }
    }
  })
  .state('root.games.detail.product', {
    url: '',
    templateUrl: 'games/game-detail-product.html'
  })
  .state('root.games.detail.standards', {
    url: '/standards',
    templateUrl: 'games/game-detail-standards.html'
  })
  .state('root.games.detail.research', {
    url: '/research',
    templateUrl: 'games/game-detail-research.html'
  })
  .state('root.games.detail.check', {
    url: '/check',
    templateUrl: 'games/game-detail-check-spec.html'
  })
  .state('root.games.detail.reviews', {
    url: '/reviews',
    templateUrl: 'games/game-detail-reviews.html'
  })
  .state('root.games.detail.lessonPlans', {
    url: '/lesson-plans',
    templateUrl: 'games/game-detail-lesson-plans.html',
    data: { authorizedRoles: ['instructor','manager','developer','admin'] }
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
  .state( 'root.games.play-page', {
    url: '/:gameId/play-page',
    data: {
      authorizedRoles: ['student','instructor','manager','developer','admin'],
      pageTitle: 'Play'
    },
    views: {
      'main@': {
        templateUrl: 'games/game-play-page.html',
        controller: 'GamePlayPageCtrl'
      }
    },
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      }
    }
  })
  .state( 'modal-lg.missions', {
    url: '/:gameId/play-missions',
    data: {
      authorizedRoles: ['student','instructor','manager','developer','admin']
    },
    resolve: {
      gameMissions: function($stateParams, GamesService) {
        return GamesService.getGameMissions($stateParams.gameId);
      },
      gameId: function($stateParams){
        return $stateParams.gameId;
      }
    },
    views: {
      'modal@': {
        templateUrl: 'games/game-play-missions.html',
        controller: 'GameMissionsModalCtrl'
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
.controller('GameCatalogCtrl',
    function($scope, $rootScope, $stateParams, $log, allGamesInfo, freeGames, premiumGames, comingSoonGames, $state, CHECKLIST, UserService) {
      $scope.allGamesInfo = _.reject(allGamesInfo, function (game) {
        return game.price === 'TBD' || game.gameId === 'TEST';
      });

      if ($scope.currentUser) {
          if (!$scope.currentUser.ftue || $scope.currentUser.ftue < 3) {
            UserService.updateUserFTUE(CHECKLIST.visitGameCatalog);
          }
          if ($scope.currentUser.role === 'developer') {
            $scope.allGamesInfo = allGamesInfo;
          }
      }

      $scope.freeGames = {name:'Free Games', games: freeGames};
      $scope.premiumGames = {name: 'Premium Games', games: premiumGames};
      $scope.comingSoonGames = {name: 'Coming Soon', games: comingSoonGames};

      $scope.sections = [
        $scope.premiumGames,
        $scope.freeGames,
        $scope.comingSoonGames
      ];

      $scope.goToGameDetail = function(price,gameId) {
        if (price!=='Coming Soon') {
          $state.go('root.games.detail.product', {gameId: gameId});
        }
      };

      $scope.truncateText = function (text,limit) {
        if (text.length > limit) {
          var truncated = text.substring(0, limit);
          return truncated + '…';
        } else {
          return text;
        }
      };
    }
)
.controller( 'GameDetailCtrl',
  function($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService, UserService) {
    document.body.scrollTop = 0;
    $scope.currentPage = null;
    $scope.gameId = $stateParams.gameId.toUpperCase();
    $scope.gameDetails = gameDetails;
    $scope.navItems = gameDetails.pages;

    // Get the default standard from the user
    $scope.defaultStandards = "CCSS";
    if( $scope.currentUser &&
        $scope.currentUser.defaultStandards &&
        $scope.gameDetails &&
        $scope.gameDetails.pages &&
        $scope.gameDetails.pages.standards &&
        $scope.gameDetails.pages.standards[$scope.currentUser.defaultStandards] ) {
      $scope.defaultStandards = $scope.currentUser.defaultStandards;
    }

    if (_.has(gameDetails, 'error')) {
      $scope.error = true;
    }

    
    $scope.isAuthorized = function() {
      return AuthService.isAuthenticatedButNot('student');
    };

    $scope.isAuthenticated = function() {
      return AuthService.isAuthenticated();
    };

    $scope.hasPermsToPlayGame = function() {
      return _.any(myGames, { 'gameId': $scope.gameId });
    };

    $scope.goToGameSubpage = function(dest) {
      if (!dest.authRequired || AuthService.isAuthenticatedButNot('student')) {
        $state.go('games.detail.' + dest.id);
      }
    };
    $scope.isValidLinkType = function (button) {
      return ((button.type == 'play' || button.type == 'download') &&
      button.links && ($scope.isSingleLinkType(button) || $scope.isMultiLinkType(button)));
    };

    $scope.isSingleLinkType = function (button) {
      return (button.links && button.links.length == 1);
    };

    $scope.isMultiLinkType = function (button) {
      return (button.links && button.links.length > 1);
    };
    $scope.goToLink = function(path, target) {
        if(target) {
            $window.open(path, target);
        } else {
            $window.location = path;
        }
    };

    $scope.goToPlayGame = function(gameId) {
      if (gameDetails.play.type==='missions') {
        $state.go('modal-lg.missions',{gameId: gameId});
      } else {
        $window.location = "/games/" + gameId + "/play-" + gameDetails.play.type;
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

    $scope.showDeveloperModal = function (gameId) {
      /**
       * We're using a dedicated method instead of ui-sref in the view
       * in order to not count the modal view in the browser history
       * (location: false) below, so the Back button doesn't re-summon
       * the modal after you close it.
       **/
      $state.go('modal-lg.developer', {'gameId': gameId}, {location: false});
    };
})
.controller( 'GameMissionsModalCtrl', function ($scope, $state, $rootScope, $window, $log, $timeout, $stateParams, AuthService, gameMissions, gameId) {
  $scope.gameMissions = gameMissions;
  $scope.gameId = gameId;
  $scope.goToLink = function (path, target) {
    if (target) {
      $window.open(path, target);
    } else {
      $window.location = path;
    }
  };
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
    if( $scope.gamePlayInfo.format == "swf" ) {
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
            '<param name=\"wmode\" value=\"direct\" />' +
            '<a href=\"http://www.adobe.com/go/getflash\">' +
              '<img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" />' +
            '</a>' +
            '<embed name="flashObj\" src=\"' + $scope.gamePlayInfo.embed+ '\" width=\"' + $scope.gamePlayInfo.size.width + '\" height=\"' + $scope.gamePlayInfo.size.height + '\"' +
              'type=\"application/x-shockwave-flash\" allowScriptAccess=\"always\">' +
            '</embed>' +
          '</object>';
        $( ".gl-gamePlay-embedded" ).html( flashOutput );
      }, 100 );
    }
    else if( $scope.gamePlayInfo.format == "html" ) {
      setTimeout( function() {
        var htmlOutput = '' +
          '<object name=\"htmlObj\" data=\"' + $scope.gamePlayInfo.embed + '\" width=\"' + $scope.gamePlayInfo.size.width + '\" height=\"' + $scope.gamePlayInfo.size.height + '\" id=\"Sample\" style=\"float: none; vertical-align:middle\">' +
          '</object>';
        $( ".gl-gamePlay-embedded" ).html( htmlOutput );
      }, 100 );
    }
  }
});
