angular.module('developer.games', [
    'gl-editable-text',
    'gl-editable-text-popover',
    'gl-angular-json-editor',
    'ui.ace'
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
                    disable_edit_json: true,
                    disable_properties: true,
                    no_additional_properties: true

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
                authorizedRoles: ['admin', 'developer'],
                pageTitle: 'Game Editor'
            }
        })



        .state('root.developerGames.advanced-editor', {
            url: '/:gameId/editor/advanced',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-editor-advanced.html',
                    controller: 'DevGameAdvancedEditorCtrl'
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
                authorizedRoles: ['admin', 'developer'],
                pageTitle: 'Advanced Game Editor'
            }
        })

        .state('root.developerGames.raw-editor', {
            url: '/:gameId/editor/raw',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-editor-raw.html',
                    controller: 'DevGameAdvancedEditorCtrl'
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
                authorizedRoles: ['admin', 'developer'],
                pageTitle: 'Advanced Game Editor'
            }
        })


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
                authorizedRoles: ['admin', 'developer'],
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

    .controller('DevGamesCtrl', function ($scope, $state, $modal, myGames, GamesService) {

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
        $scope.createNewGame = function() {
            $modal.open({
                templateUrl: 'developer/games/developer-create-game.html',
                controller: function($scope, $log, GamesService) {
                    $scope.request = {
                        isRegCompleted: false,
                        gameId: null,
                        errors: []
                    };
                    $scope.createGame = function (request) {
                        request.isSubmitting = true;
                        GamesService.createGame(request.gameId)
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
            }).result.then(function (result) {
                $state.reload();
                $state.go('root.developerGames.editor', {gameId: result});
            }, function (reason) {//This will be triggered on dismiss/Esc/backdrop click
                $state.reload();
            });
        };
        $scope.submitGame = function(gameId) {
            //console.log("submitGameForApproval", gameId);
            $modal.open({
                templateUrl: 'developer/games/developer-submit-game-modal.html',
                controller: function($scope, $log, GamesService) {
                    $scope.request = {
                        isCompleted: false,
                        gameId: gameId,
                        errors: []
                    };
                    $scope.submitGame = function (request) {
                        request.isSubmitting = true;
                        GamesService.submitGameForApproval(gameId)
                            .then(function (response) {
                                    $scope.request.errors = [];
                                    $scope.request.isSubmitting = false;
                                    $scope.request.isCompleted = true;
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
            }).result.then(function (result) {
                $state.reload();
            }, function (reason) {//This will be triggered on dismiss/Esc/backdrop click
                $state.reload();
            });
        };
    })






























    .controller('DevGameEditorCtrl',
    function ($scope, $state, $stateParams, myGames, gameInfo, infoSchema, GamesService) {

        var max_shouts = 15;
        var max_watches = 15;

        var i;
        var newidx;
        var newrule = {};
        var soworules = {};
        var soworuleskeys = [];

        var solen;
        var wolen;

        // setup

        $scope.gameId = $stateParams.gameId;
        $scope.fullData = gameInfo;

        //  $scope.fullSchema = infoSchema;

        //  $scope.tabs = ["basic", "details", "assessment", "reports"];

        //  $scope.tabSchema = _.reduce($scope.tabs, function(target, tab) {
        //      target[tab] = _.extend({}, $scope.fullSchema, {$ref: "#/definitions/" + tab});
        //      return target;
        //  }, {});

        $scope.giBasic = gameInfo.basic;
        $scope.fullName = gameInfo.basic.shortName;
        $scope.shortName = gameInfo.basic.shortName;

        $scope.playlink = "";

        $scope.dbgdmp = gameInfo;

        if (gameInfo && gameInfo.basic && gameInfo.basic.play) {
            if ("page" == gameInfo.basic.play.type) {
                $scope.playlink = gameInfo.basic.play.page.embed;
            }
        }

        // SOWO setup

        $scope.soitems = [];
        $scope.woitems = [];

        if(!gameInfo.hasOwnProperty('assessment')) {
            gameInfo.assessment = [];
        }

        if(gameInfo.assessment.length < 1) {
            gameInfo.assessment[0] = {};
        }

        // id: 'sowo' must be in first assessment object .. ?
        if(!gameInfo.assessment[0].hasOwnProperty('id')) {
            gameInfo.assessment[0].id = 'sowo';
        }

        if(!gameInfo.assessment[0].hasOwnProperty('rules')) {
            gameInfo.assessment[0].rules = {};
        }

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

        solen = $scope.soitems.length;
        wolen = $scope.woitems.length;

        // Basic functions

        $scope.onChange = function(data, tabName) {
            console.log('    onChange() ...');
            $scope.fullData[tabName] = data;
        };

        $scope.saveBasicInfo = function() {
            console.log('        calling saveBasicInfo() ... ');
        //  console.log('        passing $scope.fullData =', $scope.fullData);
            return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.fullData);
        };

        //  $scope.RefreshIcon = function() {
        //      // giBasic.platform.icon.large
        //  };

        //  $scope.RefreshSettingsIcon = function() {
        //      // giBasic.platform.icon.large
        //  };

        // Sowo functions

        $scope.deleteShoutRule = function(idx) {
            $scope.soitems.splice(idx, 1);
            solen = $scope.soitems.length;
        };

        $scope.moreShout = function() {
            if(solen < max_shouts) {
                newidx =1;
                for(i = 0; i < solen; ++ i) {
                    if($scope.soitems[i].id != ('so'+newidx)) {
                        break;
                    }
                    ++ newidx;
                }
                newrule = {"id": ("so" + newidx), "name": "new shout out name", "description": "new rule description"};
                $scope.soitems.splice((newidx - 1), 0, newrule);
                solen = $scope.soitems.length;
            }
        };

        $scope.deleteWatchRule = function(idx) {
            $scope.woitems.splice(idx, 1);
            wolen = $scope.woitems.length;
        };

        $scope.moreWatch = function() {
            if(wolen < max_watches) {
                newidx = 1;
                for(i = 0; i < wolen; ++i) {
                    if($scope.woitems[i].id != ('wo'+newidx)) {
                        break;
                    }
                    ++ newidx;
                }
                newrule = {"id": ("wo" + newidx), "name": "new watch out name", "description": "new rule description"};
                $scope.woitems.splice((newidx - 1), 0, newrule);
                wolen = $scope.woitems.length;
            }
        };

        $scope.saveSowoInfo = function() {

            gameInfo.assessment[0].rules = {};

            solen = $scope.soitems.length;
            for(i = 0; i < solen; ++i) {
                gameInfo.assessment[0].rules[$scope.soitems[i].id] = {
                    "name": $scope.soitems[i].name,
                    "description": $scope.soitems[i].description
                };
            }

            wolen = $scope.woitems.length;
            for(i = 0; i < wolen; ++i) {
                gameInfo.assessment[0].rules[$scope.woitems[i].id] = {
                    "name": $scope.woitems[i].name,
                    "description": $scope.woitems[i].description
                };
            }

            return GamesService.updateDeveloperGameInfo($scope.gameId, gameInfo);
        };

    })




























    .controller('DevGameAdvancedEditorCtrl',
    function ($scope, $state, $stateParams, myGames, gameInfo, infoSchema, GamesService, API_BASE) {
        $scope.gameId = $stateParams.gameId;
        $scope.fullData = gameInfo;
        $scope.fullDataAsStr = JSON.stringify(gameInfo, null, 2);
        $scope.fullSchema = infoSchema;
        $scope.tabs = ["basic", "details", "assessment", "reports"];
        if (gameInfo["missions"]) {
            $scope.tabs.push("missions");
        }
        $scope.saveInfo = function() {
            return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.fullData, true);
        };

        $scope.tabSchema = _.reduce($scope.tabs, function(target, tab) {
            target[tab] = _.extend({}, $scope.fullSchema, {$ref: "#/definitions/" + tab});
            return target;
        }, {});

        $scope.onChange = function(data, tabName) {
            $scope.tabName = tabName;
            $scope.fullData[tabName] = data;
        };

        $scope.JSONEditorOptions = {
            upload: function(type, file, cbs) {
                var formData = new FormData();
                formData.append($scope.tabName + '.' + type.split('.').slice(1).join('.'), file, file.name);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', API_BASE + '/dash/developer/info/game/'+$scope.gameId+'/image', true);
                xhr.upload.onprogress = function(evt) {
                    var percentComplete = (evt.loaded / evt.total)*100;
                    cbs.updateProgress(percentComplete);
                };
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            var response = JSON.parse(xhr.response);
                            cbs.success(response.path);
                        } catch(err) {
                            cbs.failure('Upload failed');
                            console.error(status, xhr.response);
                        }
                    } else {
                        cbs.failure('Upload failed');
                        console.error(status, xhr.response);
                    }
                };
                xhr.send(formData);
            }
        };

        $scope.aceLoaded = function(_editor) {
            $scope.aceEditor = _editor;
        };

        $scope.aceChanged = function(evt) {
            try {
                $scope.fullData = JSON.parse($scope.aceEditor.getValue());
            } catch(err) {

            }
        };
    })




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

        var i;
        var newidx;
        var newrule = {};
        var soworules = {};
        var soworuleskeys = [];

        if(!gameInfo.hasOwnProperty('assessment')) {
            gameInfo.assessment = [];
        }

        if(gameInfo.assessment.length < 1) {
            gameInfo.assessment[0] = {};
        }

        if(!gameInfo.assessment[0].hasOwnProperty('id')) {
            gameInfo.assessment[0].id = 'sowo';
        }

        if(!gameInfo.assessment[0].hasOwnProperty('rules')) {
            gameInfo.assessment[0].rules = {};
        }

        // do we need these ?

        // if(!gameInfo.assessment[0].hasOwnProperty('enabled')) {
        //     gameInfo.assessment[0].enabled = true;
        // }

        // if(!gameInfo.assessment[0].hasOwnProperty('dataProcessScope')) {
        //     gameInfo.assessment[0].dataProcessScope = 'gameSession';
        // }

        // if(!gameInfo.assessment[0].hasOwnProperty('engine')) {
        //     gameInfo.assessment[0].engine = 'javascript';
        // }

        // if(!gameInfo.assessment[0].hasOwnProperty('trigger')) {
        //     gameInfo.assessment[0].trigger = 'endSession';
        // }

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

        var solen = $scope.soitems.length;
        $scope.deleteShoutRule = function(idx) {
            $scope.soitems.splice(idx, 1);
            solen = $scope.soitems.length;
        };

        var wolen = $scope.woitems.length;
        $scope.deleteWatchRule = function(idx) {
            $scope.woitems.splice(idx, 1);
            wolen = $scope.woitems.length;
        };

        solen = $scope.soitems.length;
        $scope.moreShout = function() {
            if(solen < max_shouts) {
                newidx =1;
                for(i = 0; i < solen; ++ i) {
                    if($scope.soitems[i].id != ('so'+newidx)) {
                        break;
                    }
                    ++ newidx;
                }
                newrule = {"id": ("so" + newidx), "name": "new shout out name", "description": "new rule description"};
                $scope.soitems.splice((newidx - 1), 0, newrule);
                solen = $scope.soitems.length;
            }
        };

        wolen = $scope.woitems.length;
        $scope.moreWatch = function() {
            if(wolen < max_watches) {
                newidx = 1;
                for(i = 0; i < wolen; ++i) {
                    if($scope.woitems[i].id != ('wo'+newidx)) {
                        break;
                    }
                    ++ newidx;
                }
                newrule = {"id": ("wo" + newidx), "name": "new watch out name", "description": "new rule description"};
                $scope.woitems.splice((newidx - 1), 0, newrule);
                wolen = $scope.woitems.length;
            }
        };

        $scope.saveInfo = function() {

            gameInfo.assessment[0].rules = {};

            solen = $scope.soitems.length;
            for(i = 0; i < solen; ++i) {
                gameInfo.assessment[0].rules[$scope.soitems[i].id] = {
                    "name": $scope.soitems[i].name,
                    "description": $scope.soitems[i].description
                };
            }

            wolen = $scope.woitems.length;
            for(i = 0; i < wolen; ++i) {
                gameInfo.assessment[0].rules[$scope.woitems[i].id] = {
                    "name": $scope.woitems[i].name,
                    "description": $scope.woitems[i].description
                };
            }

            return GamesService.updateDeveloperGameInfo($scope.gameId, gameInfo);
        };
    })

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
