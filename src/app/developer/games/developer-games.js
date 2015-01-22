angular.module('developer.games', [
    'gl-editable-text'
])

.config(function ($stateProvider) {
        $stateProvider.state('root.developerGames', {
            abstract: true,
            url: 'developer/games'
        })
        .state('root.developerGames.default', {
            url: '',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-games.html',
                    controller: 'DevGamesCtrl'
                }
            },
            resolve: {
                myGames: function (GamesService) {
                    return GamesService.getMyDeveloperGames();
                }
            },
                data: {
                    authorizedRoles: ['developer']
                }
        })
        .state('root.developerGames.detail', {
            abstract: true,
            url: '/:gameId?scrollTo',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-detail.html',
                    controller: 'DevGameDetailCtrl'
                }
            },
            resolve: {
                gameDetails: function ($stateParams, GamesService) {
                    return GamesService.getDetail($stateParams.gameId);
                },
                myGames: function (GamesService) {
                    return GamesService.getMyGames();
                }
            },
            onEnter: function ($stateParams, $state, $location, $anchorScroll, $log) {
                // GH: Added in a last-minute fashion prior to a Friday release to
                // support in-page targeting for the Download button.
                if ($stateParams.scrollTo) {
                    $location.hash($stateParams.scrollTo);
                    $anchorScroll();
                }
            },
            data: {
                authorizedRoles: ['developer'],
                pageTitle: 'Game Detail'
            }
        })
        .state('root.developerGames.detail.product', {
            url: '',
            templateUrl: 'developer/games/developer-game-detail-product.html'
        })
        .state('root.developerGames.detail.standards', {
            url: '/standards',
            templateUrl: 'developer/games/developer-game-detail-standards.html'
        })
        .state('root.developerGames.detail.research', {
            url: '/research',
            templateUrl: 'developer/games/developer-game-detail-research.html'
        })
        .state('root.developerGames.detail.check', {
            url: '/check',
            templateUrl: 'developer/games/developer-game-detail-check-spec.html'
        })
        .state('root.developerGames.detail.reviews', {
            url: '/reviews',
            templateUrl: 'developer/games/developer-game-detail-reviews.html'
        })
        .state('root.developerGames.detail.lessonPlans', {
            url: '/lesson-plans',
            templateUrl: 'developer/games/developer-game-detail-lesson-plans.html',
            data: {authorizedRoles: ['instructor', 'manager', 'developer', 'admin']}
        })
        .state('modal-lg.developerRequestGame', {
            url: '/developer/request-game',
            data: {
                authorizedRoles: ['developer']
            },
            views: {
                'modal@': {
                    templateUrl: 'developer/games/developer-request-game.html'
                }
            },
            controller: function($scope) {
                $scope.account = {
                    isRegCompleted: false,
                    gameId: null,
                    errors: []
                };
                //$scope.register = function (account) {
                //    $scope.regForm.isSubmitting = true;
                //    UserService.register(account)
                //        .success(function (data, status, headers, config) {
                //            user = data;
                //            Session.create(user.id, user.role, data.loginType);
                //            $scope.regForm.isSubmitting = false;
                //            $scope.account.isRegCompleted = true;
                //        })
                //        .error(function (data, status, headers, config) {
                //            $log.error(data);
                //            $scope.regForm.isSubmitting = false;
                //            $scope.account.isRegCompleted = false;
                //            if (data.error) {
                //                $scope.account.errors.push(data.error);
                //            } else {
                //                $scope.account.errors.push(ERRORS['general']);
                //            }
                //        });
                //}
            }
        });
    })
    .controller('DevGamesCtrl', function ($scope, $state, myGames) {
        $scope.sections = [
            {name:'Live', release: 'live'},
            {name:'In development', release: 'dev'},
            {name:'Pending', release: 'pending'},
            {name:'Incomplete', release: 'incomplete'}
        ];
        var sectionsDict = {
            'live': [],
            'dev': [],
            'pending': [],
            'incomplete': []
        };
        _.each(myGames, function(gameBasicInfo) {
            sectionsDict[gameBasicInfo.release].push(gameBasicInfo);
        });
        _.each($scope.sections, function(section) {
           section.games = sectionsDict[section.release];
        });
        $scope.goToGameDetail = function(gameId, release) {
            if (release === 'live') {
                $state.go('root.developerGames.detail.product', {gameId: gameId});
            }
        };
        $scope.truncateText = function (text, limit) {
            if (text.length > limit) {
                var truncated = text.substring(0, limit);
                return truncated + '…';
            } else {
                return text;
            }
        };
    })
    .controller('DevGameDetailCtrl',
    function ($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService, GamesService) {
        console.log('gameDetails',gameDetails);
        document.body.scrollTop = 0;
        $scope.currentPage = null;
        $scope.gameId = $stateParams.gameId;
        $scope.gameDetails = gameDetails;
        $scope.navItems = gameDetails.pages;
        $scope.saveForm = function() {
            console.log('scope.gameDetails', $scope.gameDetails);
            return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.gameDetails);
        };

        if (_.has(gameDetails, 'error')) {
            $scope.error = true;
        }


        $scope.isAuthorized = function () {
            return AuthService.isAuthenticatedButNot('student');
        };

        $scope.isAuthenticated = function () {
            return AuthService.isAuthenticated();
        };

        $scope.hasPermsToPlayGame = function () {
            return _.any(myGames, {'gameId': $scope.gameId});
        };

        $scope.goToGameSubpage = function (dest) {
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
        $scope.goToLink = function (path, target) {
            if (target) {
                $window.open(path, target);
            } else {
                $window.location = path;
            }
        };

        $scope.goToPlayGame = function (gameId) {
            if (gameDetails.play.type === 'missions') {
                $state.go('modal-lg.missions', {gameId: gameId});
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

        $scope.toggleDropdown = function ($event, btn) {
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
    });



