angular.module('developer.tools', [])

.config(function($stateProvider) {
    $stateProvider.state('root.developerTools', {
        url: 'developer/tools',
        views: {
            'main@': {
                templateUrl: 'developer/tools/developer-tools.html'
            }
        },
        data: {
            authorizedRoles: ['developer']
        }
    })
    .state('root.developerTools.parser', {
        url: '/parser/:gameId',
        templateUrl: 'developer/tools/developer-tools-parser.html',
        controller: 'DeveloperToolsParserCtrl',
        data: {
          authorizedRoles: ['developer']
        }
    });
})

.controller('DeveloperToolsParserCtrl', function ($scope, $stateParams, $http, $window, ResearchService) {
    $scope.gameId = $stateParams.gameId;
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
                        $scope.outData = "Too many events for this query.  Click the above link to download the CSVs for those days.";
                        signedUrls = data.urls;
                        $scope.download = true;
                    }
                }).error(function(err){
                    console.error("parse-schema:", err);
                    $scope.loading = false;
                });
            }
        }
    };

    $scope.nextLoad = function(){
        $scope.download = false;
        $scope.outData = '';
        ResearchService.nextLoad($scope, signedUrls, 0);
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