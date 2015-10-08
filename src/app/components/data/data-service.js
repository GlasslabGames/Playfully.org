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
    };

    return api;

});
