angular.module('developer.reports', ['nvd3'])

.config(function($stateProvider) {
    $stateProvider.state('root.developerReports', {
        url: 'developer/reports',
        abstract:true,
        views: {
            'main@': {
                templateUrl: 'developer/reports/developer-reports.html'
            }
        },
        data: {
            authorizedRoles: ['developer']
        }
    })
    .state('root.developerReports.default', {
        url: '',
        templateUrl: 'developer/reports/developer-reports-default.html',
        resolve : {
            availableGames: function(GamesService){
                return GamesService.checkForGameAccess();
            },
            myGames: function (GamesService) {
                return GamesService.getMyDeveloperGames();
            }
        },
        controller: 'DeveloperReportsCtrl',
        data: {
          authorizedRoles: ['developer']
        }
    })
    .state('root.developerReports.detail', {
        url: '/:gameId/reports',
        views: {
            'main@': {
                templateUrl: 'developer/reports/developer-reports-detail.html',
                controller: 'DeveloperDetailsCtrl'
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
    		authorizedRoles: ['developer']
    	}
    });
})


.controller('DeveloperReportsCtrl', function ($scope, $stateParams, $http, $window, $state, $sce, ResearchService, availableGames, myGames) {

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
    $scope.viewGameReports = function(gameId) {
        $state.go('root.developerReports.detail', {gameId: gameId});
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
.controller('DeveloperDetailsCtrl', function ($scope, $stateParams, $http, $window, $state, $sce, ResearchService, gameInfo, infoSchema) {
    $scope.gameId = $stateParams.gameId;
    $scope.fullData = gameInfo;

    $scope.options = {};
    $scope.data = {};


    $scope.options_dauu = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                	if ( d === 0 ) {
                		return "today";
                	}
                	else {
						var date = new Date(Date.now());
						date.setDate(date.getDate()+d);
						var options = { month: 'short', day: '2-digit' };
                        return (date.toLocaleDateString( 'en-US', options ));
                    }
                }
            },
            yAxis: {
                axisLabel: 'Daily Active Unique Users',
                tickFormat: function(d){
                    return d3.format('f')(d*100.0);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Daily Active Unique Users'
        },
        subtitle: {
            enable: false,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: false,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.options_up = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                	if ( d === 0 ) {
                		return "today";
                	}
                	else {
						var date = new Date(Date.now());
						date.setDate(date.getDate()+d);
						var options = { month: 'short', day: '2-digit' };
                        return (date.toLocaleDateString( 'en-US', options ));
                    }
                }
            },
            yAxis: {
                axisLabel: 'Unit Progress',
                tickFormat: function(d){
                    return d3.format('f')(d*100.0);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Unit Progress'
        },
        subtitle: {
            enable: false,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: false,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.options_tsiu = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                	if ( d === 0 ) {
                		return "today";
                	}
                	else {
						var date = new Date(Date.now());
						date.setDate(date.getDate()+d);
						var options = { month: 'short', day: '2-digit' };
                        return (date.toLocaleDateString( 'en-US', options ));
                    }
                }
            },
            yAxis: {
                axisLabel: 'Time Spent in Unit',
                tickFormat: function(d){
                    return d3.format('f')(d*100.0);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Time Spent in Unit'
        },
        subtitle: {
            enable: false,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: false,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.options_sfiu = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                	if ( d === 0 ) {
                		return "today";
                	}
                	else {
						var date = new Date(Date.now());
						date.setDate(date.getDate()+d);
						var options = { month: 'short', day: '2-digit' };
                        return (date.toLocaleDateString( 'en-US', options ));
                    }
                }
            },
            yAxis: {
                axisLabel: 'Success/Fail in Unit',
                tickFormat: function(d){
                    return d3.format('f')(d*100.0);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Success/Fail in Unit'
        },
        subtitle: {
            enable: false,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: false,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.options_luc = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                	if ( d === 0 ) {
                		return "today";
                	}
                	else {
						var date = new Date(Date.now());
						date.setDate(date.getDate()+d);
						var options = { month: 'short', day: '2-digit' };
                        return (date.toLocaleDateString( 'en-US', options ));
                    }
                }
            },
            yAxis: {
                axisLabel: 'Last Unit Completed',
                tickFormat: function(d){
                    return d3.format('f')(d*100.0);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Last Unit Completed'
        },
        subtitle: {
            enable: false,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: false,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    /*Random Data Generator */
    function data_dauu() {
        var sin = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = -31; i <= 0; i++) {
            sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: sin,
                key: 'Active Unique Users',
                color: '#7777ff',
                area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];
    }

    $scope.setReport = function( type ) {
    	switch ( type ) {
    		case 'dauu':
    			$scope.options = $scope.options_dauu;
    			$scope.data = data_dauu();
	    		break;
    		case 'up':
    			$scope.options = $scope.options_up;
    			$scope.data = data_dauu();
	    		break;
    		case 'tsiu':
    			$scope.options = $scope.options_tsiu;
    			$scope.data = data_dauu();
	    		break;
    		case 'sfiu':
    			$scope.options = $scope.options_sfiu;
    			$scope.data = data_dauu();
	    		break;
    		case 'luc':
    			$scope.options = $scope.options_luc;
    			$scope.data = data_dauu();
	    		break;
    	}
    };

    $scope.setReport( 'dauu' );
});