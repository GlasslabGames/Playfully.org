angular.module('data', [])
.factory('DataService', function ($http, $log, API_BASE) {

    var api = {

        get: function (gameId) {
            return $http
            .get(API_BASE + '/data/game/' + gameId)
            .then(function(response) {
                $log.debug(response);
                return response.data;
            }, function(response) {
                $log.error(response);
                return response;
            });
        },

        exportReportData: function () {
            // API_BASE == "/api/v2"
            var url = '/admin-thx1138-data/export-report-data';
            return $http
                .get(API_BASE + url)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    $log.error(response);
                    return response;
            });
        },
        
        monitorReport: function() {
            var url = '/monitor/report';
            return $http
                .get(API_BASE + url)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    $log.error(response);
                    return response;
            });
        },

        runMonitor: function() {
            var url = '/monitor/run';
            return $http
                .get(API_BASE + url)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    $log.error(response);
                    return response;
            });
        },
    };

    return api;

});
