angular.module('developer.games', [
    'gl-editable-text',
    'gl-editable-text-popover',
    'gl-json-editor',
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

        .state('root.developerGames.editor-old', {
            url: '/:gameId/editor/old',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-editor-old.html',
                    controller: 'DevGameOldEditorCtrl'
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
                pageTitle: 'Game Editor (Old)'
            }
        })


        .state('root.developerGames.editor', {
            url: '/:gameId/editor',
            views: {
                'main@': {
                    templateUrl: 'developer/games/developer-game-editor-new.html',
                    controller: 'DevGameEditorCtrl'
                }
            },
            resolve: {
                gameInfo: function ($stateParams, GamesService) {
                    return GamesService.getDeveloperGameInfo($stateParams.gameId);
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
                pageTitle: 'Raw JSON Editor'
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





    .controller('DevGameOldEditorCtrl',
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

        $scope.giFull = gameInfo;

        $scope.giKeys = Object.keys(gameInfo);
        $scope.giBasicKeys = Object.keys(gameInfo.basic);

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


        // To avoid editing errors and mis-matches the Reports tab should really be
        // merged with SOWO tab.

        // It might be problematic that the SOWO reports data is in
        // a different object array than the SOWO data (assessment vs. reports).

        // Reports setup

        $scope.sorepitems = [];
        $scope.worepitems = [];


/*
      Rule ID: {{giFull.reports.list[0].table.groups[0].headers[0].id}}<br>
      Rule Name: {{giFull.reports.list[0].table.groups[0].headers[0].title}}<br>
      Rule Description <br>
      <textarea id="keykey" cols="96" rows="2" ng-model="giFull.reports.list[0].table.groups[0].headers[0].description"></textarea><br><br>
*/

/*
        if(!gameInfo.hasOwnProperty('reports')) {
            gameInfo.reports = {};
        }

        if(!gameInfo.reports.hasOwnProperty('list')) {
            gameInfo.reports.list = [];
        }

        if(gameInfo.reports.list.length < 1) {
            gameInfo.reports.list[0] = {};
        }

        if(!gameInfo.reports.list[0].hasOwnProperty('id')) {
            gameInfo.reports.list[0].id = 'so';
        }
*/
/*

xx1 {{giFull.reports.list[0].id}}<br>
xx2 {{giFull.reports.list[0].enabled}}<br>
xx3 {{giFull.reports.list[0].name}}<br>
xx4 {{giFull.reports.list[0].header.text}}<br>
xx5 {{giFull.reports.list[0].header.image}}<br>
xx6 {{giFull.reports.list[0].header.skinny}}<br>
xx7 {{giFull.reports.list[0].header.large}}<br>
xx8 {{giFull.reports.list[0].description}}<br><br>

12 xx {{giFull.reports.list[0].table.groups[0].headers[0].id}}<br>
13 xx {{giFull.reports.list[0].table.groups[0].headers[0].title}}<br>
14 xx {{giFull.reports.list[0].table.groups[0].headers[0].description}}<br><br>
*/




        // Basic functions

        $scope.onChange = function(data, tabName) {
            console.log('    onChange() ...');
            $scope.fullData[tabName] = data;
        };

        $scope.saveGameInfoChanges = function() {
            console.log('        calling saveGameInfoChanges() ... ');
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




    .controller('DevGameEditorCtrl',
        function ($scope, $state, $stateParams, myGames, gameInfo, GamesService, API_BASE) {
            $scope.gameId = $stateParams.gameId;
            $scope.fullData = gameInfo;

            var baseOptions = {
                required_by_default: true,
                disable_collapse: true,
                disable_edit_json: true,
                upload: function(type, file, cbs) {
                    var formData = new FormData();
                    formData.append(type, file, file.name);

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

            var baseSchema = {
                "definitions": {
                    "image_url": {
                        "type": "string",
                        "format": "url",
                        "options": {
                            "upload": true
                        },
                        "links": [
                            {
                                "href": "{{self}}",
                                "mediaType": "image"
                            }
                        ]
                    }
                }
            };

            var sections = [
                {
                    "name": "name",
                    "type": "object",
                    "format": "grid",
                    "title": "Name",
                    "properties": {
                        "longName": {
                            "type": "string",
                            "title": "Full Game Name"
                        },
                        "shortName": {
                            "type": "string",
                            "title": "Short Game Name"
                        }
                    }
                },
                {
                    "name": "basics",
                    "type": "object",
                    "format": "grid",
                    "title": "Basics",
                    "properties": {
                        "platform": {
                            "type": "string",
                            "title": "Platform",
                            "enum": ["iPad", "Browser", "PC/Mac"],
                            "options": {
                                "grid_columns": 2
                            }
                        },
                        "subject": {
                            "type": "string",
                            "title": "Subject",
                            "options": {
                                "grid_columns": 4
                            }
                        },
                        "gradeLevel": {
                            "type": "string",
                            "title": "Grade Level",
                            //"description": "#-# format",
                            "options": {
                                "grid_columns": 2
                            }
                        }
                    }
                },
                {
                    "name": "platform_ipad",
                    "type": "object",
                    "properties": {
                        "applink": {
                            "type": "string",
                            "title": "App Store Download Link",
                            "format": "url"
                        }
                    }
                },
                {
                    "name": "platform_browser",
                    "type": "object",
                    "format": "grid",
                    "properties": {
                        "embed": {
                            "type": "string",
                            "title": "Embed URL",
                            "format": "url",
                            "options": {"grid_columns": 4}
                        },
                        "format": {
                            "type": "string",
                            "title": "Format",
                            "enum": ["html", "swf"]
                        },
                        "width": {
                            "type": "integer",
                            "title": "Width",
                            "options": {"grid_columns": 1}
                        },
                        "height": {
                            "type": "integer",
                            "title": "Height",
                            "options": {"grid_columns": 1}
                        }
                    }
                },
                //{
                //    "name": "platform_client",
                //    "type": "object",
                //    "properties": {}
                //},
                {
                    "name": "developer",
                    "type": "object",
                    "format": "grid",
                    "title": "Developer Info",
                    "properties": {
                        "name": {
                            "type": "string",
                            "title": "Developer Name",
                            "options": {
                                "grid_columns": 3
                            }
                        },
                        "logo": {
                            "$ref": "#/definitions/image_url",
                            "title": "Logo 60x60",
                            "options": {
                                "grid_columns": 3
                            }
                        },
                        "description": {
                            "type": "string",
                            "title": "Developer Description",
                            "format": "textarea",
                            "options": {
                                "grid_columns": 6,
                                "input_height": "150px"
                            }
                        }
                    }
                },
                {
                    "name": "social",
                    "type": "object",
                    "format": "grid",
                    "title": "Social Media",
                    "properties": {
                        "facebook": {
                            "type": "string",
                            "title": "Facebook",
                            "format": "url"
                        },
                        "twitter": {
                            "type": "string",
                            "title": "Twitter",
                            "format": "url"
                        },
                        "google": {
                            "type": "string",
                            "title": "Google+",
                            "format": "url"
                        }
                    }
                },
                {
                    "name": "details",
                    "type": "object",
                    "format": "grid",
                    "title": "Details",
                    "properties": {
                        "shortDescription": {
                            "type": "string",
                            "title": "Short Description",
                            "format": "textarea",
                            "options": {
                                "grid_columns": 4,
                                "input_height": "150px"
                            }
                        },
                        "longDescription": {
                            "type": "string",
                            "title": "Long Description",
                            "format": "textarea",
                            "options": {
                                "grid_columns": 8,
                                "input_height": "150px"
                            }
                        },
                        "curriculum": {
                            "type": "string",
                            "title": "How the Game fits the Curriculum",
                            "description": "Appears as bullet points, one per line",
                            "format": "textarea",
                            "options": {
                                "grid_columns": 6,
                                "input_height": "150px"
                            }
                        }
                    }
                },
                {
                    "name": "resources",
                    "type": "object",
                    "format": "grid",
                    "title": "Resources",
                    "properties": {
                        "video": {
                            "type": "string",
                            "title": "Link to Video",
                            "format": "url"
                        },
                        "brochure": {
                            "type": "string",
                            "title": "Link to Brochure",
                            "format": "url"
                        }
                    }
                },
                {
                    "name": "standards",
                    "type": "array",
                    "format": "table",
                    "title": "Standards Alignment",
                    "items": {
                        "type": "object",
                        "title": "Entry",
                        "format": "grid",
                        "headerTemplate": " ",
                        "properties": {
                            "standard": {
                                "type": "string",
                                "description": "Standard",
                                "enum": ["CCSS", "TEKS"],
                                "options": {"input_width": "15%"}
                            },
                            "category": {
                                "type": "string",
                                "description": "Category",
                                "options": {"input_width": "25%"}
                            },
                            "group": {
                                "type": "string",
                                "description": "Group",
                                "options": {"input_width": "30%"}
                            },
                            "name": {
                                "type": "string",
                                "description": "Name",
                                "options": {"input_width": "40%"}
                            },
                            "link": {
                                "type": "string",
                                "description": "Link",
                                "format": "url",
                                "options": {"input_width": "60%"}
                            },
                            "description": {
                                "type": "string",
                                "description": "Description - <a href='https://help.github.com/articles/markdown-basics/' target='_blank'>Markdown</a> supported",
                                "format": "textarea",
                                "options": {"input_width": "100%"}
                            }
                        }
                    }
                },
                {
                    "name": "lessonPlans",
                    "type": "array",
                    "format": "table",
                    "title": "Lesson Plans",
                    "items": {
                        "type": "object",
                        "title": "Link",
                        "properties": {
                            "category": {
                                "type": "string",
                                "description": "Category",
                                "options": {
                                    "input_width": "130px"
                                }
                            },
                            "name": {
                                "type": "string",
                                "description": "Title",
                                "options": {
                                    "input_width": "200px"
                                }
                            },
                            "link": {
                                "type": "string",
                                "description": "Link",
                                "format": "url",
                                "options": {
                                    "input_width": "400px"
                                }
                            },
                            "standard": {
                                "type": "string",
                                "description": "Standard",
                                "options": {
                                    "input_width": "80px"
                                }
                            },
                            "description": {
                                "type": "string",
                                "description": "Description",
                                "format": "textarea",
                                "options": {
                                    "input_width": "100%"
                                }
                            }
                        }
                    }
                },
                {
                    "name": "images",
                    "type": "object",
                    "format": "grid",
                    "title": "Game Images",
                    "properties": {
                        "thumbnail": {
                            "$ref": "#/definitions/image_url",
                            "title": "Thumbnail 150x120",
                            "options": {
                                "grid_columns": 4
                            }
                        },
                        "card": {
                            "$ref": "#/definitions/image_url",
                            "title": "Card 300x240",
                            "options": {
                                "grid_columns": 8
                            }
                        },
                        "banner": {
                            "$ref": "#/definitions/image_url",
                            "title": "Banner 940x300",
                            "options": {
                                "grid_columns": 12
                            }
                        }
                    }
                },
                {
                    "name": "slideshow",
                    "type": "array",
                    "title": "Product Slideshow",
                    "format": "table",
                    "items": {
                        "type": "object",
                        "title": "Slide",
                        "properties": {
                            "url": {
                                "$ref": "#/definitions/image_url",
                                "title": "Slides 480x360"
                            }
                        }
                    }
                }
            ];

            $scope.sections = _.map(sections, function(section) {
                return {
                    name: section.name,
                    options: _.defaults({}, baseOptions),
                    schema: _.defaults({}, section, baseSchema)
                };
            });

            var baseData = {
                "name": {
                    "longName": gameInfo.basic.longName,
                    "shortName": gameInfo.basic.shortName
                },
                "basics": {
                    "subject": gameInfo.basic.subject,
                    "gradeLevel": gameInfo.basic.grades,
                },
                "details": {
                    "shortDescription": gameInfo.basic.description,
                    "longDescription": gameInfo.details.pages.product.about,
                    "curriculum": [].concat(gameInfo.details.pages.product.curriculum).join("\n")
                },
                "resources": {
                    "video": gameInfo.details.pages.product.video,
                    "brochure": gameInfo.details.pages.product.brochure
                },
                "developer": {
                    "name": gameInfo.basic.developer.name,
                    "description": gameInfo.basic.developer.description,
                    "logo": gameInfo.basic.developer.logo.small
                },
                "social": gameInfo.details.social,
                "images": {
                    "banner": gameInfo.basic.banners.product,
                    "card": gameInfo.basic.card.small,
                    "thumbnail": gameInfo.basic.thumbnail.small
                },
                "slideshow": gameInfo.details.pages.product.slideshow
            };

            if (gameInfo.basic.platform.type.match(/pc.*mac/i)) {
                $scope.platform = "client";
                baseData.basics.platform = "PC/Mac";
                baseData.platform_client = {

                };
            } else if (gameInfo.basic.platform.type.match(/browser/i)) {
                $scope.platform = "browser";
                baseData.basics.platform = "Browser";
                baseData.platform_browser = {
                    embed: _.get(gameInfo.basic, 'play.page.embedSecure') || _.get(gameInfo.basic, 'play.page.embed'),
                    format: _.get(gameInfo.basic, 'play.page.format'),
                    width: _.get(gameInfo.basic, 'play.page.size.width'),
                    height: _.get(gameInfo.basic, 'play.page.size.height')
                };
            } else {
                $scope.platform = "ipad";
                baseData.basics.platform = "iPad";
                baseData.platform_ipad = {
                    applink: gameInfo.details.applink
                };
            }

            if (gameInfo.details.pages.standards) {
                baseData.standards = [];
                var standard, section, groupItem, listItem;
                ["CCSS", "TEKS"].forEach (function(standard) {
                    _.forEach(gameInfo.details.pages.standards[standard], function(section) {
                        //section.category;
                        _.forEach(section.groups, function(groupItem) {
                            //groupItem.name;
                            _.forEach(groupItem.list, function(listItem) {
                                baseData.standards.push({
                                    standard: standard,
                                    category: section.category,
                                    group: groupItem.name,
                                    name: listItem.name,
                                    link: listItem.link,
                                    description: listItem.description
                                });
                            });
                        });
                    });
                });
            }

            if (gameInfo.details.pages.lessonPlans.list) {
                baseData.lessonPlans = [];
                _.forEach(gameInfo.details.pages.lessonPlans.list, function(section) {
                    //section.category
                    _.forEach(section.list, function(listItem) {
                        baseData.lessonPlans.push({
                            category: section.category,
                            name: listItem.name,
                            link: listItem.link,
                            standard: listItem.standard,
                            description: listItem.description
                        });
                    });
                });
            }

            $scope.saveInfo = function() {
                return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.fullData, true);
            };

            $scope.editorData = baseData;

            $scope.onChange = function(sectionData, section) {
                //console.log("onChange", JSON.stringify(data, null, 2));
                $scope.editorData[section] = sectionData;

                var data = $scope.editorData;

                var updatedInfo = $scope.fullData;
                updatedInfo.basic.longName = data.name.longName;
                updatedInfo.basic.shortName = data.name.shortName;
                updatedInfo.basic.platform.type = data.basics.platform;

                if (data.basics.platform.match(/pc.*mac/i)) {
                    $scope.platform = "client";
                } else if (data.basics.platform.match(/browser/i)) {
                    $scope.platform = "browser";
                    updatedInfo.basic.play = {
                        type: "page",
                        page: {
                            embed: data.platform_browser.embed,
                            format: data.platform_browser.format,
                            size: {
                                width: data.platform_browser.width,
                                height: data.platform_browser.height
                            }
                        }
                    };
                } else {
                    $scope.platform = "ipad";
                    updatedInfo.details.applink = data.platform_ipad.applink;
                }

                var platformIconBase = "/assets/platform-" + $scope.platform;
                updatedInfo.basic.platform.icon.small = platformIconBase + ".png";
                updatedInfo.basic.platform.icon.large = platformIconBase + "@2x.png";

                updatedInfo.basic.subject = data.basics.subject;
                updatedInfo.basic.grades = data.basics.gradeLevel;

                updatedInfo.basic.description =
                    updatedInfo.basic.shortDescription = data.details.shortDescription;

                updatedInfo.details.pages.product.about = data.details.longDescription;
                updatedInfo.details.pages.product.curriculum = data.details.curriculum.split("\n");

                updatedInfo.details.pages.product.video = data.resources.video;
                updatedInfo.details.pages.product.brochure = data.resources.brochure;

                if(!updatedInfo.details.pages.standards) {
                    updatedInfo.details.pages.standards = {
                        order: 2,
                        authRequired: false,
                        id: "standards",
                        title: "Standards Alignment"
                    };
                }
                if(data.standards) {
                    var groups = {};
                    var categories = {};
                    var standards = {};

                    _.forEach(data.standards, function(item) {
                        //item.standard
                        var groupKey = [item.standard, "_"+item.category, "_"+item.group].join(".");
                        if(!_.has(groups, groupKey)) {
                            _.set(groups, groupKey, []);
                        }
                        _.get(groups, groupKey).push(_.pick({
                            name: item.name,
                            link: item.link,
                            description: item.description
                        }, _.identity));

                        var categoryKey = [item.standard, "_"+item.category].join(".");
                        if(!_.has(categories, categoryKey)) {
                            _.set(categories, categoryKey, []);
                        }
                        if(_.get(categories, categoryKey).indexOf(item.group) === -1) {
                            _.get(categories, categoryKey).push(item.group);
                        }

                        if(!standards[item.standard]) {
                            standards[item.standard] = [];
                        }
                        if(standards[item.standard].indexOf(item.category) === -1) {
                            standards[item.standard].push(item.category);
                        }
                    });

                    _.forEach(standards, function(_categories, standard) {
                        updatedInfo.details.pages.standards[standard] = [];
                        _.forEach(_categories, function(category) {
                            var _category = {
                                category: category,
                                groups: []
                            };
                            _.forEach(categories[standard]["_"+category], function(group){
                                //console.log(standard, category, group, list);
                                var _group = {};
                                if(group) {
                                    _group.name = group;
                                }
                                _group.list = groups[standard]["_"+category]["_"+group];
                                _category.groups.push(_group);
                            });
                            updatedInfo.details.pages.standards[standard].push(_category);
                        });
                    });

                    updatedInfo.details.pages.standards.enabled = true;
                } else {
                    updatedInfo.details.pages.standards.enabled = false;
                }

                if(data.lessonPlans) {
                    var lessonPlansCategories = {};

                    _.forEach(data.lessonPlans, function(item) {
                        if(!lessonPlansCategories[item.category]) {
                            lessonPlansCategories[item.category] = [];
                        }
                        lessonPlansCategories[item.category].push(_.pick({
                            name: item.name,
                            link: item.link,
                            standard: item.standard,
                            description: item.description
                        }, _.identity));
                    });

                    updatedInfo.details.pages.lessonPlans.title = "Lesson Plans";
                    if (lessonPlansCategories["Videos"]) {
                        updatedInfo.details.pages.lessonPlans.title += " & Videos";
                    }

                    updatedInfo.details.pages.lessonPlans.list = [];
                    _.forEach(lessonPlansCategories, function(items, category) {
                        updatedInfo.details.pages.lessonPlans.list.push({
                            category: category,
                            list: items
                        });
                    });

                    updatedInfo.details.pages.lessonPlans.enabled = true;
                } else {
                    updatedInfo.details.pages.lessonPlans.enabled = false;
                }

                updatedInfo.basic.developer.name = data.developer.name;
                updatedInfo.basic.developer.description = data.developer.description;

                updatedInfo.basic.developer.logo.small =
                    updatedInfo.basic.developer.logo.large = data.developer.logo;

                updatedInfo.details.social = data.social;

                updatedInfo.basic.banners.product =
                    updatedInfo.basic.banners.reports = data.images.banner;

                updatedInfo.basic.card.small =
                    updatedInfo.basic.card.large = data.images.card;

                updatedInfo.basic.thumbnail.small =
                    updatedInfo.basic.thumbnail.large = data.images.thumbnail;

                updatedInfo.details.pages.product.slideshow = data.slideshow;
            };

        })




    .controller('DevGameAdvancedEditorCtrl',
    function ($scope, $state, $stateParams, myGames, gameInfo, infoSchema, GamesService, API_BASE) {
        $scope.gameId = $stateParams.gameId;
        $scope.fullData = gameInfo;
        $scope.fullDataAsStr = JSON.stringify(gameInfo, null, 4);
        $scope.fullSchema = infoSchema;
        $scope.tabs = ["basic", "details", "assessment", "reports"];
        if (gameInfo["missions"]) {
            $scope.tabs.push("missions");
        }
        $scope.saveInfo = function() {
            return GamesService.updateDeveloperGameInfo($scope.gameId, $scope.fullData, true);
        };

        $scope.tabSchema = _.reduce($scope.tabs, function(target, tab) {
            target[tab] = _.defaults({$ref: "#/definitions/" + tab}, $scope.fullSchema);
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
