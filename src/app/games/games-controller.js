angular.module( 'playfully.games', [
  'ngOrderObjectBy',
  'ui.router',
  'hc.marked',
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
        return GamesService.active('basic');
      },
      gamesAvailableForLicense: function(LicenseService) {
         return LicenseService.getGamesAvailableForLicense();
      },
      currentPlan: function(LicenseService) {
         return LicenseService.getCurrentPlan();
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
      activeCourses: function(CoursesService, $filter) {
        return CoursesService.getEnrollments()
            .then(function(response) {
              var filtered = $filter('filter')(response, {archived: false});
                return filtered;
            });
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
    function($scope, $rootScope, $window, $timeout, $stateParams, $log, allGamesInfo, gamesAvailableForLicense, currentPlan, $state, CHECKLIST, UserService) {
      $scope.allGamesInfo = _.reject(allGamesInfo, function (game) {
        return game.price === 'TBD' || game.gameId === 'TEST';
      });

    // $scope.agi = allGamesInfo;

      if ($scope.currentUser) {
          if (!$scope.currentUser.ftue || $scope.currentUser.ftue < 3) {
            UserService.updateUserFTUE(CHECKLIST.visitGameCatalog);
          }
          if ($scope.currentUser.role === 'developer') {
            $scope.allGamesInfo = allGamesInfo;
          }
      }
      $scope.gamesAvailableForLicense = gamesAvailableForLicense;

      $scope.academicSkills = [
        { name: "English Language Arts", state: 0, mask: 0x0001, icon: "icon_englanguagearts.jpg" },
        { name: "Mathematics", state: 0, mask: 0x0002, icon: "icon_math.jpg" },
        { name: "Social Studies", state: 0, mask: 0x0004, icon: "icon_socialstudies.jpg"  },
        { name: "Science", state: 0, mask: 0x0008, icon: "icon_science.jpg"  },
        { name: "Foreign Language", state: 0, mask: 0x0010, icon: "icon_foreignlanguage.jpg"  },
        { name: "Arts", state: 0, mask: 0x0020, icon: "icon_arts.jpg"  },
        { name: "Health and Phys Ed", state: 0, mask: 0x0040, icon: "icon_healthphysed.jpg"  }
      ];
      $scope._21stCenturySkills = [
        { name: "Collaboration", state: 0, mask: 0x0001, icon: "icon_collaboration.jpg"  },
        { name: "Problem Solving", state: 0, mask: 0x0002, icon: "icon_problemsolving.jpg"  },
        { name: "System Thinking", state: 0, mask: 0x0004, icon: "icon_systemsthinking.jpg"  },
        { name: "Creativity", state: 0, mask: 0x0008, icon: "icon_creativity.jpg"  },
        { name: "Communication", state: 0, mask: 0x0010, icon: "icon_communication.jpg"  }
      ];
      $scope._21stCenturyReadiness = [
        { name: "Financial Literacy", state: 0, mask: 0x0001, icon: "icon_financialliteracy.jpg"  },
        { name: "Life Skills", state: 0, mask: 0x0002, icon: "icon_lifeskills.jpg"  },
        { name: "Career Skills", state: 0, mask: 0x0004, icon: "icon_career.jpg"  },
        { name: "Technology", state: 0, mask: 0x0008, icon: "icon_technology.jpg"  },
        { name: "Leadership", state: 0, mask: 0x0010, icon: "icon_leadership.jpg"  }
      ];
      $scope.gradeLevels = [
        { name: "K-2", state: 0, mask: 0x0007 },
        { name: "3-4", state: 0, mask: 0x0018 },
        { name: "5-6", state: 0, mask: 0x0060 },
        { name: "7-8", state: 0, mask: 0x0180 },
        { name: "9-10", state: 0, mask: 0x0600 },
        { name: "11-12", state: 0, mask: 0x1800 }
      ];
      $scope.platformList = [
        { name: "PC/Mac", state: 0, mask: 0x0001, event: "pcMac" },
        { name: "iOS", state: 0, mask: 0x0002, event: "iPad" },
        { name: "Android", state: 0, mask: 0x0004, event: "android", disable: 1 },
        { name: "Browser", state: 0, mask: 0x0008, event: "chromebook" }
      ];
      $scope.platformListMap = { "PC/Mac": 0, "iOS": 1, "Andriod": 2, "Browser": 3 };
      
      $scope.allGames = true;
      $scope.selectedAcademicSkillsMask = 0;
      $scope.selected21stCenturySkillsMask = 0;
      $scope.selected21stCenturyReadinessMask = 0;
      $scope.selectedGradeMask = 0;
      $scope.selectedPlatformMask = 0;
      
      $scope.gradesPreMask = [ 0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f,
        0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff ];
        
      $scope.gradesToMask = function(s) {
        var limits = s.split(/[^\d\w]+/);
        limits[0] = (limits[0] === "K" ? 0 : parseInt(limits[0], 10));
        if (limits.length === 1) {
            return $scope.gradesPreMask[limits[0] + 1]  - $scope.gradesPreMask[limits[0]];
        }
        limits[1] = parseInt(limits[1], 10);
        return $scope.gradesPreMask[limits[1] + 1]  - $scope.gradesPreMask[limits[0]];
      };

      $scope.platformToMask = function(p) {
        if (p === 'PC/Mac') {
            return $scope.platformList[$scope.platformListMap["PC/Mac"]].mask;
        }
        if (p.indexOf('Browser') !== -1) {
            return $scope.platformList[$scope.platformListMap["Browser"]].mask
                | $scope.platformList[$scope.platformListMap["PC/Mac"]].mask;
        }
        if (p === 'iPad') {
            return $scope.platformList[$scope.platformListMap["iOS"]].mask;
        }
      };

      $scope.skillsToMask = function(assigned, known) {
        var mask = 0;
        for (var i=0;i<assigned.length;i++) {
            for (var j=0;j<known.length;j++) {
                if (assigned[i] === known[j].name) {
                    mask |= known[j].mask;
                    break;
                }
            }
        }
        return mask;
      };

      $scope.makeTitleColorSelector = function(skills) {
        if (skills !== undefined && skills.primary !== undefined) {
            var i;
            for (i=0;i<$scope.academicSkills.length;i++) {
                if ($scope.academicSkills[i].name === skills.primary) {
                    return "red";
                }
            }
            for (i=0;i<$scope._21stCenturySkills.length;i++) {
                if ($scope._21stCenturySkills[i].name === skills.primary) {
                    return 'green';
                }
            }
            for (i=0;i<$scope._21stCenturyReadiness.length;i++) {
                if ($scope._21stCenturyReadiness[i].name === skills.primary) {
                    return 'blue';
                }
            }
        }
        return 'red';
      };

      $scope.makeSkillIconName = function(skills) {
        if (skills !== undefined && skills.primary !== undefined) {
            var i;
            for (i=0;i<$scope.academicSkills.length;i++) {
                if ($scope.academicSkills[i].name === skills.primary) {
                    return "/assets/skill-icons/" + $scope.academicSkills[i].icon;
                }
            }
            for (i=0;i<$scope._21stCenturySkills.length;i++) {
                if ($scope._21stCenturySkills[i].name === skills.primary) {
                    return "/assets/skill-icons/" + $scope._21stCenturySkills[i].icon;
                }
            }
            for (i=0;i<$scope._21stCenturyReadiness.length;i++) {
                if ($scope._21stCenturyReadiness[i].name === skills.primary) {
                    return "/assets/skill-icons/" + $scope._21stCenturyReadiness[i].icon;
                }
            }
        }
        return "/assets/dev-logo-placeholder.jpg";
      };
      
      $scope.allGamesFilterData = { };
      $scope.allGamesInfo.forEach(function(game) {
        $scope.allGamesFilterData[game.shortName] = {
            gradesMask: $scope.gradesToMask(game.grades),
            platformMask: $scope.platformToMask(game.platform.type),
            academicSkillMask: (game.skills !== undefined ? $scope.skillsToMask(game.skills.academicSkills, $scope.academicSkills) : 0),
            _21stCenturySkillsMask: (game.skills !== undefined ? $scope.skillsToMask(game.skills._21stCenturySkills, $scope._21stCenturySkills) : 0),
            _21stCenturyReadinessMask: (game.skills !== undefined ? $scope.skillsToMask(game.skills._21stCenturyReadiness, $scope._21stCenturyReadiness) : 0),
            titleColorSelector: $scope.makeTitleColorSelector(game.skills),
            skillIconName: $scope.makeSkillIconName(game.skills)
        };
      });
      
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
      
      $scope.gameTitleColorSelctor = function(game) {
        return $scope.allGamesFilterData[game.shortName].titleColorSelector;
      };
      
      $scope.gameSkillIcon = function(game) {
        return $scope.allGamesFilterData[game.shortName].skillIconName;
      };

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

      $scope.allGamesClicked = function () {
        if ($scope.allGames) {
            $scope.selectedAcademicSkillsMask = 0;
            $scope.selected21stCenturySkillsMask = 0;
            $scope.selected21stCenturyReadinessMask = 0;
            $scope.selectedGradeMask = 0;
            $scope.selectedPlatformMask = 0;

            for (i = 0; i < $scope.academicSkills.length; i++) {
                $scope.academicSkills[i].state = false;
            }
            for (i = 0; i < $scope._21stCenturySkills.length; i++) {
                $scope._21stCenturySkills[i].state = false;
            }
            for (i = 0; i < $scope._21stCenturyReadiness.length; i++) {
                $scope._21stCenturyReadiness[i].state = false;
            }
            for (i = 0; i < $scope.gradeLevels.length; i++) {
                $scope.gradeLevels[i].state = false;
            }
            for (i = 0; i < $scope.platformList.length; i++) {
                $scope.platformList[i].state = false;
            }
        } else {
            $scope.allGames = true;
        }
      };

      $scope.onCatalogFilterChange = function (item) {
        if (item && item.event && item.state) {
            $scope.analyticEvent(item.event, item.state);
        }

        // timeout needed to allow manipulating $scope.allGames
        $timeout(function () {
            var i, anyChecked = false;
            $scope.selectedAcademicSkillsMask = 0;
            $scope.selected21stCenturySkillsMask = 0;
            $scope.selected21stCenturyReadinessMask = 0;
            $scope.selectedGradeMask = 0;
            $scope.selectedPlatformMask = 0;

            for (i = 0; i < $scope.academicSkills.length; i++) {
                if ($scope.academicSkills[i].state) {
                    $scope.selectedAcademicSkillsMask |= $scope.academicSkills[i].mask;
                    anyChecked = true;
                }
            }
            for (i = 0; i < $scope._21stCenturySkills.length; i++) {
                if ($scope._21stCenturySkills[i].state) {
                    $scope.selected21stCenturySkillsMask |= $scope._21stCenturySkills[i].mask;
                    anyChecked = true;
                }
            }
            for (i = 0; i < $scope._21stCenturyReadiness.length; i++) {
                if ($scope._21stCenturyReadiness[i].state) {
                    $scope.selected21stCenturyReadinessMask |= $scope._21stCenturyReadiness[i].mask;
                    anyChecked = true;
                }
            }
            for (i = 0; i < $scope.gradeLevels.length; i++) {
                if ($scope.gradeLevels[i].state) {
                    $scope.selectedGradeMask |= $scope.gradeLevels[i].mask;
                    anyChecked = true;
                }
            }
            for (i = 0; i < $scope.platformList.length; i++) {
                if ($scope.platformList[i].state) {
                    $scope.selectedPlatformMask |= $scope.platformList[i].mask;
                    anyChecked = true;
                }
            }
            $scope.allGames = !anyChecked;
        }, 0);
      };

      $scope.gameFilter = function () {
        return function (game) {
            var mask = $scope.allGamesFilterData[game.shortName].gradesMask;
            if ($scope.selectedGradeMask && ($scope.selectedGradeMask & mask) === 0) {
                return false;
            }
            mask = $scope.allGamesFilterData[game.shortName].platformMask;
            if ($scope.selectedPlatformMask && ($scope.selectedPlatformMask & mask) === 0) {
                return false;
            }
            mask = $scope.allGamesFilterData[game.shortName].academicSkillMask;
            if ($scope.selectedAcademicSkillsMask && ($scope.selectedAcademicSkillsMask & mask) === 0) {
                return false;
            }
            mask = $scope.allGamesFilterData[game.shortName]._21stCenturySkillsMask;
            if ($scope.selected21stCenturySkillsMask && ($scope.selected21stCenturySkillsMask & mask) === 0) {
                return false;
            }
            mask = $scope.allGamesFilterData[game.shortName]._21stCenturyReadinessMask;
            if ($scope.selected21stCenturyReadinessMask && ($scope.selected21stCenturyReadinessMask & mask) === 0) {
                return false;
            }
            return true;
        };
      };
      
      $scope.analyticEvent = function(value, oldState) {
        var action = 'catalog-' + value + '-' + (oldState ? 'off' : 'on');
        $window.ga('send', 'event', 'button', 'click', action);
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
.controller( 'GamePlayPageCtrl', function ($scope, $state, gameDetails, activeCourses, ENV) {
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
        var embed = $scope.gamePlayInfo.embedSecure ? $scope.gamePlayInfo.embedSecure : $scope.gamePlayInfo.embed;
        if (ENV.game_sdkURI) {
        	embed = embed + (embed.indexOf('?') === -1 ? "?" : "&") + "sdkURI=" + ENV.game_sdkURI;
        }
        if (gameDetails.gameId.toUpperCase() === "GEM" || gameDetails.gameId.toUpperCase() === "GEMAUDIO" || gameDetails.gameId.toUpperCase() === "TEACHABLEAGENTSPR" || gameDetails.gameId.toUpperCase() === "TEACHABLEAGENTSPRTEST") {
            var foundCourse = _.find(activeCourses, function(course) { return course.id == $state.params.courseId; });
            if (foundCourse && foundCourse.code) {
                embed = embed + (embed.indexOf('?') === -1 ? "?" : "&") + "classCode=" + foundCourse.code;
            }
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
