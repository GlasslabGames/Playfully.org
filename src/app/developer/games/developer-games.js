angular.module('developer.games', [])

.config(function ($stateProvider) {
        $stateProvider.state('root.developerGames', {
            abstract: true,
            url: 'developer/games',
            views: {
                'main@root': {
                    template: '<div ui-view></div>'
                }
            }
        })
        .state('root.developerGames.detail', {
            abstract: true,
            url: '/:gameId?scrollTo',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-detail.html',
                    controller: 'GameDetailCtrl'
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
        });
    })
    .controller('GameDetailCtrl',
    function ($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService) {
        document.body.scrollTop = 0;
        $scope.currentPage = null;
        $scope.gameId = $stateParams.gameId;
        $scope.gameDetails = gameDetails;
        $scope.navItems = gameDetails.pages;

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



