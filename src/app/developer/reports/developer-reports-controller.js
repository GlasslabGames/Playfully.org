angular.module('developer.reports', [])

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

});