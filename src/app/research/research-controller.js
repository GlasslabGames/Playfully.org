angular.module('playfully.research', ['research'])

.config(function($stateProvider) {
    $stateProvider.state('research', {
        url: '/research/:gameId',
        abstract:true,
        views: {
            'main@': {
                controller: "ResearchCtrl",
                templateUrl: 'research/research.html'
            }
        },
        resolve: {
            allGamesInfo: function(GamesService) {
                return GamesService.all();
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('research.parser', {
        url:'',
        templateUrl: 'research/research-parser.html',
        controller: 'ResearchParserCtrl',
        data: {
          authorizedRoles: ['admin']
        }
    })
    .state('research.download', {
        url:'/download',
        templateUrl: 'research/research-download.html',
        controller: 'ResearchDownloadCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('research.editCsv', {
        url:'/editCsv',
        templateUrl: 'research/research-edit-csv.html',
        controller: 'ResearchEditCsvCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    });
})

    .controller('ResearchCtrl', function($scope, $state, $stateParams, allGamesInfo) {
        $scope.currentState = $state.current.name;
        $scope.allGamesInfo = allGamesInfo;
        if (!$stateParams.gameId) {
            $state.go($state.current.name, {gameId: allGamesInfo[0].gameId});
        }
        $scope.gameId = $stateParams.gameId;

        $scope.onGameIdClick = function(gameId) {
            $state.go($state.current.name, {gameId:gameId});
        };
    })

.controller('ResearchParserCtrl', function ($scope, $http, $window, $sce, ResearchService) {
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
                sd = sd.toISOString();
            }

            if($scope.endDate) {
                ed = new Date($scope.endDate);
                ed = ed.toISOString();
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
})

.controller('ResearchEditCsvCtrl', function ($scope, $http) {
        $scope.csvData = "";
        $scope.loading = true;

        $scope.selectGame = function() {
            getCSVData($scope.gameId);
        };

        $scope.submit = function() {
            if ($scope.gameId) {
                $scope.loading = true;
                $http({
                    method: 'POST',
                    url: "/api/v2/research/game/"+$scope.gameId+"/parse-schema",
                    data: {
                        data: $scope.csvData
                    }
                }).success(function(){
                    $scope.loading = false;
                }).error(function(){
                    console.error("parse-schema:", err);
                });
            }
        };

        function getCSVData(gameId){
            $scope.loading = true;
            $http({
                method: 'GET',
                url: "/api/v2/research/game/"+gameId+"/parse-schema"
            }).success(function(data){
                $scope.loading = false;
                $scope.csvData = data;
            }).error(function(err){
                console.error("parse-schema:", err);
            });
        }

        getCSVData($scope.gameId);
  })
    // need good messaging, that this section only allows querying within one month
.controller('ResearchDownloadCtrl', function ($scope, $http, $window, $sce, ResearchService) {
    $scope.userIds = "";
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.numCSVs = 0;
    $scope.loading = false;
    $scope.startDateOpened = false;
    $scope.endDateOpened = false;

    $scope.submit = function() {
        if ($scope.gameId) {
            var sd = "";
            var ed = "";

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

            var url = "/api/v2/research/game/"+$scope.gameId+"/urls";
            $scope.loading = true;
            $http({
                method: 'GET',
                url: url,
                params: {
                    startDate:  sd,
                    endDate:    ed
                }
            }).success(function(data){
                //console.log("events data:", data);
                $scope.loading = false;
                $scope.numCSVs = data.numCSVs;
                if(data.numCSVs <= 0) {
                    $scope.files = [];
                } else {
                    $scope.files = _.map(data.urls, function (url) {
                        return {url: $sce.trustAsResourceUrl(url), name: url.split('/').pop().split('?').shift()};
                    });
                    var signedUrls = data.urls;
                }
            }).error(function(err){
                console.error("parse-schema:", err);
                $scope.loading = false;
            });

        }
    };

    $scope.today = function() {
        $scope.startDate = new Date();
        $scope.startDate.setHours(0,0,0,0);
    };

    $scope.clear = function () {
        $scope.startDate = null;
    };

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDate = null;
        $scope.startDateOpened = true;
    };

    $scope.endDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endDateOpened = true;
    };

    $scope.minDate = null;
    $scope.maxDate = new Date();

    var updateMinMaxDate = ResearchService.updateMinMaxDate.bind($scope);
    // listen on datepicker calendar.  when dates are changed, update min and max
    $scope.$watch('startDateOpened', updateMinMaxDate);
    $scope.$watch('endDateOpened', updateMinMaxDate);

    $scope.dateOptions = {
        formatYear: 'yy'
    };

    $scope.format = 'yyyy-MM-dd';

});
