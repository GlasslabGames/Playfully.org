angular.module('reports', [])
.factory('ReportsService', function ($http, $log, API_BASE) {

  var api = {

    get: function(reportId, gameId, courseId) {
      var apiUrl = API_BASE + '/dash/reports/' + reportId + '/game/' + gameId + '/course/' + courseId;
      return $http({method: 'GET', url: apiUrl})
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    }

  };

  return api;

});
