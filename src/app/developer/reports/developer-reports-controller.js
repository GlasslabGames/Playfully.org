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
            },
            reportsData: function ($stateParams, $http) {
                var url = "/api/v2/research/game/"+$stateParams.gameId+"/dev-game-report";

                return $http({
                    method: 'GET',
                    url: url,
                    params: {}
                }).then(function (response) {
                    //console.log("dev-game-report", response);
                    return response.data;
                }, function (err) {
                    console.error("dev-game-report:", err);
                    return {};
                });
            }
    	},
    	data: {
    		authorizedRoles: ['admin', 'developer']
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
.controller('DeveloperDetailsCtrl', function ($scope, $stateParams, $http, $window, $state, $sce, ResearchService, gameInfo, infoSchema, reportsData, moment) {
    $scope.gameId = $stateParams.gameId;
    $scope.fullData = gameInfo;

    $scope.unitsData = reportsData.units;

    var dau_values = [];
    var max_dau = 0;
    var dau_ticks = 5;
    for (var i = -31; i < 0; i++) {
        var date = moment().add({days:i}).format("YYYY-MM-DD");
        if(reportsData.DAU[date] && reportsData.DAU[date] > max_dau) {
            max_dau = reportsData.DAU[date];
        }
        dau_values.push({x: i, y: reportsData.DAU[date] || 0});
    }
    if (max_dau < dau_ticks) {
        dau_ticks = Math.round(max_dau / 2) + 1;
    }
    $scope.data_dau = [{
        values: dau_values,
        key: 'Active Unique Users'
    }];


    $scope.options_dau = {
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
            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d){
                    var date = new Date();
                    date.setDate(date.getDate()+d);
                    var options = { month: 'short', day: '2-digit' };
                    return (date.toLocaleDateString( 'en-US', options ));
                }
            },
            yAxis: {
                axisLabel: 'Daily Active Unique Users',
                tickFormat: function(d){
                    return d3.format('d')(d);
                },
                ticks: 5,
                axisLabelDistance: -10
            }
        },
        title: {
            enable: true,
            text: 'Daily Active Unique Users'
        }
    };

    $scope.data_unit_progress = [];
    var unit_progress_keys = ["start", "completed", "success", "fail"];
    var unit_progress_key_labels = {
        start: "Units Started",
        completed: "Units Completed",
        success: "Units Completed Successfully",
        fail: "Units Completed Unsuccessfully"
    };
    var unit_progress_key_data = {};
    _.forEach(reportsData.units, function(unit, unitName) {
        _.forEach(unit_progress_keys, function(key) {
            if (!unit_progress_key_data[key]) {
                unit_progress_key_data[key] = [];
            }
            unit_progress_key_data[key].push({
                label: unitName,
                value: unit[key]
            });
        });

        unit.avgTimeStr = moment.duration(unit.avgTime).humanize();
        unit.medianTimeStr = moment.duration(unit.medianTime).humanize();
        unit.successPercentage = Math.round(100 * (unit.start ? unit.success/unit.start : 0)) + "%";
    });
    _.forEach(unit_progress_keys, function(key) {
        $scope.data_unit_progress.push({
            key: unit_progress_key_labels[key],
            values: unit_progress_key_data[key]
        });
    });


    $scope.options_unit_progress = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            xAxis: {
                axisLabel: 'Units'
            },
            yAxis: {
                tickFormat: function(d){
                    return d3.format('d')(d);
                }
            }
        },
        title: {
            enable: true,
            text: 'Unit Progress'
        }
    };

});