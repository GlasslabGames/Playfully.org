angular.module( 'playfully.games', [
  'ngOrderObjectBy',
  'ui.router',
  'games'
], function($compileProvider){
  // allow custom url
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|simcityedu):/);
})

.config(function ( $stateProvider) {
        
$stateProvider.state( 'modal.game-user-mismatch', {
    url: '/games/game-user-mismatch',
    parent: 'modal',
    data: {
               modalSize: 'lg'
    },
    views: {
            'modal@': {
               templateUrl: 'games/game-play-usermismatch.html',
                controller: function($scope, $window) {
                        console.log("inside GameUserMismatchCtrl");
                        $scope.goToRoot = function() {
                            $window.location = "/";
                        };
                     }
            }
    }
});

  $stateProvider.state( 'root.games', {
    abstract: true,
    url: 'games'
  })
  .state('root.games.default', {
    url: '',
    onEnter: function($state, $log, AuthService) {
      // GLAS-155: redirect /games to /games/catalog
      $state.go('root.games.catalog');
    }
  })
  .state('root.games.catalog', {
    url: '/catalog?:gamePlatform',
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
        return GamesService.active('basic');
      },
      gamesAvailableForLicense: function(LicenseService) {
         return LicenseService.getGamesAvailableForLicense();
      },
      currentPlan: function(LicenseService) {
         return LicenseService.getCurrentPlan();
      },
      startPlatform: function($stateParams) {
         return $stateParams.gamePlatform;
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
      },
      gamesAvailableForLicense: function(LicenseService) {
          return LicenseService.getGamesAvailableForLicense();
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
      // Search through allgames for the short name to put in the title
      pageTitle: 'Game Details'
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
  .state('root.games.detail.badges', {
    url: '/badges',
    templateUrl: 'games/game-detail-badges.html'
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
    data: { authorizedRoles: ['instructor','developer','admin'] }
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
    url: '/:gameId/play-page?:courseId',
    data: {
      authorizedRoles: ['student','instructor','developer','admin'],
      pageTitle: 'Play'
    },
    views: {
      'main@': {
        templateUrl: 'games/game-play-page.html',
        controller: 'GamePlayPageCtrl'
      }
    },
    onEnter: function($state, $interval, $timeout, UserService){
         $state.checkLogin = null;
         
         UserService.retrieveCurrentUser()
         .success(function(data) {
            $state.activeUserId = data.id;
            $state.checkLogin = $interval(function () {
                UserService.retrieveCurrentUser()
                .success(function(data) {
                     if ($state.activeUserId != data.id) {
                         if ($state.checkLogin) {
                            $interval.cancel($state.checkLogin);
                            $state.checkLogin = null;
                         }
                         $state.go('modal.game-user-mismatch', { }, {location: false});
                     }
                })
                .error(function() {
                    if ($state.checkLogin) {
                       $interval.cancel($state.checkLogin);
                       $state.checkLogin = null;
                    }
                    $state.go('modal.game-user-mismatch', { }, {location: false});
                });
            }, 5000); // poll every 5 seconds to see if user changed/logged-out
         })
         .error(function() {
            // failed -- abort game load
            $state.go('modal.game-user-mismatch', { }, {location: false});
         });
    },
    onExit: function($state, $interval){
         if ($state.checkLogin) {
            $interval.cancel($state.checkLogin);
            $state.checkLogin = null;
         }
    },
    resolve: {
      gameDetails: function($stateParams, GamesService) {
        return GamesService.getDetail($stateParams.gameId);
      },
      validAccess: function($state, $stateParams, GamesService) {
        return GamesService.hasAccessToGameInCourse($stateParams.gameId, $stateParams.courseId)
            .then(function (response) {
                return response.data;
            }, function (response) {
                $state.go('root.home.default');
                return response;
            });
      }
    }
  })
  .state( 'modal.game-not-available', {
    url: '/games/game-not-available',
    views: {
      'modal@': {
        templateUrl: 'games/game-not-available-modal.html',
        controller: function($scope,$state, $previousState) {
            $scope.goToState = function(state) {
                $previousState.forget('modalInvoker');
                $state.go(state);
            };
        }
      }
    }
  })
  .state( 'modal-lg.missions', {
    url: '/:gameId/play-missions?:courseId&:userType',
    data: {
      authorizedRoles: ['student','instructor','developer','admin']
    },
    resolve: {
      gameMissions: function($stateParams, GamesService) {
        return GamesService.getGameMissions($stateParams.gameId);
      },
      gameId: function($stateParams){
        return $stateParams.gameId;
      },
      validAccess: function($state, $stateParams, GamesService) {
        return GamesService.hasAccessToGameInCourse($stateParams.gameId, $stateParams.courseId)
            .then(function (response) {
                return response.data;
            }, function (response) {
                $state.go('root.home.default');
                return response;
            });
      },
      extraQuery: function($stateParams) {
         return $stateParams.userType !== undefined ?
            ($stateParams.courseId !== undefined ? '&userType=' + $stateParams.userType :
             '?userType=' + $stateParams.userType) : '';
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
    function($scope, $rootScope, $window, $stateParams, $log, allGamesInfo, gamesAvailableForLicense, startPlatform, currentPlan, $state, CHECKLIST, UserService) {
      $scope.allGamesInfo = _.reject(allGamesInfo, function (game) {
        return game.price === 'TBD' || game.gameId === 'TEST' || game.gameId === 'GEM';
      });

$scope.agi = allGamesInfo;

      if ($scope.currentUser) {
          if (!$scope.currentUser.ftue || $scope.currentUser.ftue < 3) {
            UserService.updateUserFTUE(CHECKLIST.visitGameCatalog);
          }
          if ($scope.currentUser.role === 'developer') {
            $scope.allGamesInfo = allGamesInfo;
          }
      }
      $scope.gamesAvailableForLicense = gamesAvailableForLicense;

      // completely relaod page if the UI top is a role mismatch
      $scope.$on('$viewContentLoaded',
        function(event) {
            var elem = document.getElementById('teacher-info-bar');
            if (elem) {
                 UserService.retrieveCurrentUser()
                 .success(function(data) {
                    if (data.role == 'student') {
                        $window.location = "/";
                    }
                  })
                 .error(function() {
                    $window.location = "/";
                  });
            }
            elem = document.getElementById('student-info-bar');
            if (elem) {
                 UserService.retrieveCurrentUser()
                 .success(function(data) {
                      if (data.role != 'student') {
                          $window.location = "/";
                      }
                 })
                 .error(function() {
                    $window.location = "/";
                 });
            }
      });
            
      $scope.platform = {
          isOpen: false,
          options: ['All Games', 'iPad', 'Chromebook', 'PC/Mac'],
          query: ['all', 'ipad', 'chromebook', 'pcMac'],
          package: ['', 'iPad', 'Chromebook/Web', 'PC/MAC'],
          selected: 'All Games'
      };
      
      if (startPlatform === $scope.platform.query[1]) {
        $scope.platform.selected = $scope.platform.options[1];
      } else if (startPlatform === $scope.platform.query[2]) {
        $scope.platform.selected = $scope.platform.options[2];
      } else if (startPlatform === $scope.platform.query[3]) {
        $scope.platform.selected = $scope.platform.options[3];
      } else if (startPlatform !== $scope.platform.query[0]) {
        if (currentPlan !== undefined && currentPlan.packageDetails !== undefined) {
            if (currentPlan.packageDetails.name == $scope.platform.package[1]) {
                $scope.platform.selected = $scope.platform.options[1];
            } else if (currentPlan.packageDetails.name == $scope.platform.package[2]) {
                $scope.platform.selected = $scope.platform.options[2];
            } else if (currentPlan.packageDetails.name == $scope.platform.package[3]) {
                $scope.platform.selected = $scope.platform.options[3];
            }
        }
      }
            
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

      $scope.platformFilter = function() {
         return function(game) {
             if ($scope.platform.selected === 'All Games') {
                 return true;
             }
             if ($scope.platform.selected === 'Chromebook') {
                 return game.platform.type.indexOf('Browser') !== -1;
             }
             if ($scope.platform.selected === 'PC/Mac') {
                 return game.platform.type.indexOf('Browser') !== -1 || game.platform.type === 'PC & Mac';
             }

             return game.platform.type === $scope.platform.selected;
         };
      };
      $scope.toggleDropdown = function ($event, collection) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope[collection].isOpen = !$scope[collection].isOpen;
      };
      $scope.alterSelection = function(type) {
            $scope.platform.selected = type;
            if ($window.ga) {
                for (var i=0;i<4;i++) {
                    if ($scope.platform.options[i] == type) {
                        $window.ga('set', 'page', '/games/catalog?gamePlatform=' + $scope.platform.query[i]);
                        $window.ga('send', 'pageview');
                        break;
                    }
                }
            }
      };
    }
)
.controller( 'GameDetailCtrl',
  function($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService, gamesAvailableForLicense, GamesService) {
    document.body.scrollTop = 0;
    $scope.currentPage = null;
    $scope.gameId = $stateParams.gameId.toUpperCase();
    $scope.gameDetails = gameDetails;
    $scope.navItems = gameDetails.pages;
    if (gameDetails.shortName !== undefined) {
    	$state.$current.data.pageTitle = gameDetails.shortName;
    }

    // Get the default standard from the user
    $scope.defaultStandards = "CCSS";
    if( $scope.currentUser &&
        $scope.currentUser.standards &&
        $scope.gameDetails &&
        $scope.gameDetails.pages &&
        $scope.gameDetails.pages.standards &&
        $scope.gameDetails.pages.standards[$scope.currentUser.standards] ) {
      $scope.defaultStandards = $scope.currentUser.standards;
    }
    
    $scope.standardsTabs = _.map(['CCSS', 'TEKS'], function(val) {
      var enabled = _.has(gameDetails.pages.standards, val);
      return {name: val, active: enabled && val == $scope.defaultStandards, disabled: !enabled};
    });

    if (_.has(gameDetails, 'error')) {
      $scope.error = true;
    }
    if (gamesAvailableForLicense) {
        $scope.isGameAvailableForLicense = gamesAvailableForLicense[$scope.gameId];
    }

    // Query LRNG's API for relevant badges (if any)
    $scope.badges = [];
    if ( $scope.gameDetails.pages.badges ) {
        angular.forEach( $scope.gameDetails.pages.badges.list, function( badge ) {
            console.log("LRNG Query for ", badge.id);
            GamesService.getBadgeDetailsFromLRNG( badge.id )
              .then(function(response) {
                if ( response.data ) {
                  $scope.badges.push( response.data.data[0] );
                }
              }, function (response) {
                console.log("ERROR from LRNG", response);
              });
          } );
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
        $state.go('modal-lg.missions',{gameId: gameId, userType: 'instructor'});
      } else {
        $window.location = "/games/" + gameId + "/play-" + gameDetails.play.type + "?userType=instructor";
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
.controller( 'GameMissionsModalCtrl', function ($scope, $state, $rootScope, $window, $log, $timeout, $stateParams, AuthService, gameMissions, gameId, extraQuery, ENV) {
  $scope.gameMissions = gameMissions;
  $scope.gameId = gameId;
  $scope.goToLink = function (path, target) {
    path = path + extraQuery;
    if (ENV.game_sdkURI) {
        path = path + (path.indexOf('?') === -1 ? "?" : "&") + "sdkURI=" + ENV.game_sdkURI;
    }
    if (target) {
      $window.open(path, target);
    } else {
      $window.location = path;
    }
  };
  $scope.goTo = function(path, target) {
    if (ENV.game_sdkURI) {
        path = path + (path.indexOf('?') === -1 ? "?" : "&") + "sdkURI=" + ENV.game_sdkURI;
    }
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
.controller( 'GamePlayPageCtrl', function ($scope, $sce, $sceDelegate, $state, $location, $rootScope, $log, $timeout, gameDetails, ENV) {
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
            '<a href=\"https://www.adobe.com/go/getflash\">' +
              '<img src=\"https://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" />' +
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
        var embed = $location.protocol() == 'https' ? $scope.gamePlayInfo.embedSecure : $scope.gamePlayInfo.embed;
        if (ENV.game_sdkURI) {
        	embed = embed + (embed.indexOf('?') === -1 ? "?" : "&") + "sdkURI=" + ENV.game_sdkURI;
        }
        console.log(embed);
        var htmlOutput = '' +
          '<object name=\"htmlObj\" data=\"' + embed + '\" width=\"' + $scope.gamePlayInfo.size.width + '\" height=\"' + $scope.gamePlayInfo.size.height + '\" id=\"Sample\" style=\"float: none; vertical-align:middle\">' +
          '</object>';
        $( ".gl-gamePlay-embedded" ).html( htmlOutput );
      }, 100 );
    }
  }
});
