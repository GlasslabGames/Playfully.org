angular.module('developer.games', [
    'gl-editable-text',
    'gl-editable-text-popover',
    'angular-json-editor'
])

.config(function ($stateProvider, JSONEditorProvider) {
        JSONEditorProvider.configure({
            //plugins: {
            //    sceditor: {
            //        style: 'sce/development/jquery.sceditor.default.css'
            //    }
            //},
            defaults: {
                options: {
                    iconlib: 'fontawesome4',
                    theme: 'bootstrap3',
                    disable_edit_json: true,
                    disable_properties: true,
                    no_additional_properties: true,
                    ajax: true
                }
            }
        });
        $stateProvider.state('root.developerGames', {
            abstract: true,
            url: 'developer/games',
            resolve: {
                myGames: function (GamesService) {
                    return GamesService.getMyDeveloperGames();
                }
            }
        })
        .state('root.developerGames.default', {
            url: '',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-games.html',
                    controller: 'DevGamesCtrl'
                }
            },
                data: {
                    authorizedRoles: ['developer']
                }
        })
        .state('root.developerGames.editor', {
            url: '/:gameId/editor',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-editor.html',
                    controller: 'DevGameEditorCtrl'
                }
            },
            resolve: {
                gameInfo: function ($stateParams, GamesService) {
                    return GamesService.getDeveloperGameInfo($stateParams.gameId);
                },
                infoSchema: function(GamesService) {
                    return GamesService.getDeveloperGamesInfoSchema();
                }
            },
            data: {
                authorizedRoles: ['developer'],
                pageTitle: 'Game Editor'
            }
        })




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




        .state('root.developerGames.sowo-editor', {
            url: '/:gameId/sowo-editor',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-sowo-editor.html',
                    controller: 'DevGameSoWoEditorCtrl'
                }
            },
            resolve: {
                gameInfo: function ($stateParams, GamesService) {
                    return GamesService.getDeveloperGameInfo($stateParams.gameId);
                },
                infoSchema: function(GamesService) {
                    return GamesService.getDeveloperGamesInfoSchema();
                }
            },
            data: {
                authorizedRoles: ['developer', 'admin'],
                pageTitle: 'Game Shout Out Watch Out Editor'
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
            data: {authorizedRoles: ['instructor', 'developer', 'admin']}
        })
        .state('modal-lg.developer-edit', {
            url: '/games/:gameId/developer',
            data: {
                pageTitle: 'Developer Info'
            },
            resolve: {
                gameDetails: function ($stateParams, GamesService) {
                    return GamesService.getDetail($stateParams.gameId);
                }
            },
            views: {
                'modal@': {
                    templateUrl: 'developer/games/developer-game-detail-company.html',
                    controller: function ($scope, $log, gameDetails, $stateParams, GamesService) {
                        $scope.gameDetails = gameDetails;
                        $scope.editCompany = function () {
                        };
                        $scope.saveForm = function () {
                            return GamesService.updateDeveloperGameInfo($stateParams.gameId, $scope.gameDetails);
                        };

                    }
                }
            }
        })
        .state('modal-lg.developerRequestGame', {
            url: '/developer/request-game',
            data: {
                authorizedRoles: ['developer']
            },
            views: {
                'modal@': {
                    templateUrl: 'developer/games/developer-request-game.html',
                    controller: function($scope, $log, GamesService) {
                        $scope.request = {
                            isRegCompleted: false,
                            gameId: null,
                            errors: []
                        };
                        $scope.requestAccess = function (request) {
                            request.isSubmitting = true;
                            GamesService.requestGameAccess(request.gameId)
                                .then(function (response) {
                                    $scope.request.errors = [];
                                    $scope.request.isSubmitting = false;
                                    $scope.request.isRegCompleted = true;
                                },
                                function (response) {
                                    $log.error(response.data);
                                    $scope.request.isSubmitting = false;
                                    $scope.request.errors = [];
                                    $scope.request.errors.push( response.data.error );
                                });
                        };
                        $scope.finish = function() {

                        };
                    }
                }
            }
        });
    })
    .controller('DevGamesCtrl', function ($scope, $state, myGames) {
        $scope.sections = [
            {name:'Live', release: 'live'},
            {name:'In development', release: 'dev'}/*,
            {name:'Pending', release: 'pending'},
            {name:'Incomplete', release: 'incomplete'}*/
        ];
        var sectionsDict = {
            'live': [],
            'dev': []/*,
            'pending': [],
            'incomplete': []*/
        };
        _.each(myGames, function(gameBasicInfo) {
            sectionsDict[gameBasicInfo.release].push(gameBasicInfo);
        });
        _.each($scope.sections, function(section) {
           section.games = sectionsDict[section.release];
        });
        $scope.goToGameDetail = function(gameId, release) {
            /*if (release === 'live') {
                $state.go('root.developerGames.detail.product', {gameId: gameId});
            }*/
            $state.go('root.developerGames.editor', {gameId: gameId});
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
    .controller('DevGameEditorCtrl',
    function ($scope, $state, $stateParams, myGames, gameInfo, infoSchema, GamesService) {
        $scope.gameId = $stateParams.gameId;
        $scope.fullData = gameInfo;
        $scope.fullSchema = infoSchema;
        $scope.tabs = ["basic", "details", "assessment", "reports"];
        $scope.saveInfo = function() {
            return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.fullData);
        };

        $scope.tabSchema = _.reduce($scope.tabs, function(target, tab) {
            target[tab] = _.extend({}, $scope.fullSchema, {$ref: "#/definitions/" + tab});
            return target;
        }, {});

        $scope.onChange = function(data, tabName) {
            $scope.fullData[tabName] = data;
        };
    })




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




    .controller('DevGameSoWoEditorCtrl',
    function ($scope, $state, $stateParams, myGames, gameInfo, infoSchema, GamesService) {
        $scope.gameId = $stateParams.gameId;

// $scope.dump = $state;
// $scope.dump2 = myGames;
// $scope.dump3 = gameInfo;
// $scope.dump4 = infoSchema;
// $scope.dump5 = GamesService;

        $scope.soitems = [];
        $scope.woitems = [];

        var max_shouts = 15;
        var max_watches = 15;

        var newrule = {};
        var soworules = {};
        var soworuleskeys = [];

        if(gameInfo.hasOwnProperty('assessment') &&
            gameInfo.assessment[0].hasOwnProperty('id') &&
            gameInfo.assessment[0].hasOwnProperty('rules') &&
            (gameInfo.assessment[0].id == 'sowo')) {

            soworules = gameInfo.assessment[0].rules;
            soworuleskeys = Object.keys(soworules);

            soworuleskeys.forEach( function(rule) {

                if(0 <= rule.indexOf('so')) {
                    newrule = {"id": "", "name": "", "description": ""};
                    newrule.id = rule;
                    newrule.name = soworules[rule].name;
                    newrule.description = soworules[rule].description;

                    $scope.soitems.push(newrule);
                }

                if(0 <= rule.indexOf('wo')) {
                    newrule = {"id": "", "name": "", "description": ""};
                    newrule.id = rule;
                    newrule.name = soworules[rule].name;
                    newrule.description = soworules[rule].description;

                    $scope.woitems.push(newrule);
                }
            });
        }

        var solen = $scope.soitems.length;
        $scope.moreShout = function() {
            if(solen < max_shouts) {
                newrule = {"id": ("so"+ (1 + solen)), "name": "new shout out name", "description": "new rule description"};
                $scope.soitems.push(newrule);
                solen = $scope.soitems.length;
            }
        };

        var wolen = $scope.woitems.length;
        $scope.moreWatch = function() {
            if(wolen < max_watches) {
                newrule = {"id": ("wo"+ (1 + wolen)), "name": "new watch out name", "description": "new rule description"};
                $scope.woitems.push(newrule);
                wolen = $scope.woitems.length;
            }
        };

    })




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////
////////////////  ////////////////  ////////////////  ////////////////




    .controller('DevGameDetailCtrl',
    function ($scope, $state, $stateParams, $log, $window, gameDetails, myGames, AuthService, GamesService) {
        document.body.scrollTop = 0;
        $scope.currentPage = null;
        $scope.game = {hover: false};
        $scope.gameId = $stateParams.gameId;
        $scope.gameDetails = gameDetails;
        $scope.navItems = gameDetails.pages;

        $scope.typeOptions = ['Browser', 'App', 'Client Download'];
        $scope.platformOptions = ['iPad', 'PC & Mac', 'Flash/Browser'];

        $scope.editAbout = function() {};
        $scope.editDescription = function() {};
        $scope.editPrice = function() {};
        $scope.editType = function() {};
        $scope.editGrades = function() {};
        $scope.editPlatform = function() {};

        $scope.saveForm = function() {
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
                $state.go('modal-lg.missions', {gameId: gameId, userType: 'developer'});
            } else {
                $window.location = "/games/" + gameId + "/play-" + gameDetails.play.type + "?userType=developer";
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
            $state.go('modal-lg.developer-edit', {'gameId': gameId}, {location: false});
        };
    });



