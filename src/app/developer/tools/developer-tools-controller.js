angular.module('developer.tools', [])

.config(function($stateProvider) {
    $stateProvider.state('root.developerTools', {
        url: 'developer/tools',
        abstract:true,
        views: {
            'main': {
                templateUrl: 'developer/tools/developer-tools.html'
            }
        },
        data: {
            authorizedRoles: ['developer']
        }
    })
    .state('root.developerTools.parser', {
        url: '',
        templateUrl: 'developer/tools/developer-tools-parser.html',
        resolve : {
            availableGames: function(GamesService){
                return GamesService.checkForGameAccess();
            }
        },
        controller: 'DeveloperToolsParserCtrl',
        data: {
          authorizedRoles: ['developer']
        }
    });
})

.controller('DeveloperToolsParserCtrl', function ($scope, $stateParams, $http, $window, $state, $sce, ResearchService, availableGames) {
    $scope.gameIds = [];

    if (availableGames.hasOwnProperty("error")) {
        return;
    }

    for( var game in availableGames ) {
        $scope.gameIds.push( game );
    }

    //if(!availableGames[$stateParams.gameId]){
    if( $scope.gameIds.length === 0 ) {
        alert("Please request access to a game first.");
        $state.go('root.developerGames.default');
    }

    $scope.gameId = $scope.gameIds[0];
    $scope.userIds = "";
    $scope.startDate = "";
    $scope.startHour = 0;
    $scope.endDate = "";
    $scope.endHour = 23;
    $scope.outData = "";
    $scope.numEvents = 0;
    $scope.download = false;
    $scope.saveToFile = false;
    $scope.loading = false;
    $scope.startDateOpened = false;
    $scope.endDateOpened = false;
    var signedUrls = [];
    $scope.submit = function() {
        if ($scope.gameId) {
            var sd = "";
            var ed = "";
            var sh = 0;
            var eh = 23;

            if($scope.startDate) {
                sd = new Date($scope.startDate);
                if( sd && sd.format ) {
                    sd = sd.format($scope.format);
                }
            }

            if($scope.endDate) {
                ed = new Date($scope.endDate);
                if( ed && ed.format ) {
                    ed = ed.format($scope.format);
                }
            }

            if( $scope.startHour ) {
                sh = $scope.startHour;
            }
            if( $scope.endHour ) {
                eh = $scope.endHour;
            }

            //console.log("startDate:", sd);
            //console.log("endDate:", ed);

            var url = "/api/v2/research/game/"+$scope.gameId+"/events";

            if($scope.saveToFile) {
                url += "?startDate="+sd+
                       "&endDate="+ed+
                       "&saveToFile="+$scope.saveToFile+
                       "&startDateHour="+sh+
                       "&endDateHour="+eh+
                       "&startDateMin=0"+
                       "&startDateSec=0"+
                       "&endDateMin=59"+
                       "&endDateSec=59";
                $window.open(url);
            } else {
                $scope.download = false;
                $scope.outData = "";
                $scope.loading = true;
                $http({
                    method: 'GET',
                    url: url,
                    params: {
                        startDate:  sd,
                        endDate:    ed,
                        saveToFile: $scope.saveToFile,
                        startDateHour: sh,
                        endDateHour:   eh,
                        startDateMin:  0,
                        startDateSec:  0,
                        endDateMin:    59,
                        endDateSec:    59
                    }
                }).success(function(data){
                    $scope.loading = false;
                    if(data.numCSVs === undefined){
                        $scope.outData = data.data;
                        $scope.numEvents = data.numEvents;
                    } else{
                        $scope.download = true;
                        $scope.numCSVs = data.numCSVs;
                        if(data.numCSVs <= 0) {
                            $scope.files = [];
                        } else {
                            $scope.files = _.map(data.urls, function (url) {
                                return {url: $sce.trustAsResourceUrl(url), name: url.split('/').pop().split('?').shift()};
                            });
                            var signedUrls = data.urls;
                        }
                    }
                }).error(function(err){
                    console.error("parse-schema:", err);
                    $scope.loading = false;
                });
            }
        }
    };

    $scope.today = function() {
        $scope.startDate = new Date();
        $scope.startDate.setHours(0,0,0,0);
    };
    //$scope.today();

    $scope.clear = function () {
        $scope.startDate = null;
    };

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    $scope.endDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDateOpened = true;
    };

    updateMinMaxDate = ResearchService.updateMinMaxDate.bind($scope);
    // listen on datepicker calendar.  when dates are changed, update min and max
    $scope.$watch('startDateOpened', updateMinMaxDate);
    $scope.$watch('endDateOpened', updateMinMaxDate);

    $scope.minDate = null;
    $scope.maxDate = new Date();
    $scope.dateOptions = {
        formatYear: 'yy'
    };

    $scope.format = 'yyyy-MM-dd';
});