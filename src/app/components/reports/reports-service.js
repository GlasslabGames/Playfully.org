angular.module('reports', [])
.factory('ReportsService', function ($http, $log, API_BASE, API_OPTIONS) {

  var api = {

    get: function(reportId, gameId, courseId, limit) {
      var params = {
        gameId: gameId,
        courseId: courseId,
      };
      if (limit) {
        params.limit = limit;
      }
      var apiUrl = API_BASE + '/dash/reports/' + reportId;
      return $http(angular.extend({method: 'GET', url: apiUrl, params: params}, API_OPTIONS))
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getAchievements: function (gameId, courseId) {
      var params = {
        gameId: gameId,
        courseId: courseId
      };
      var apiUrl = API_BASE + '/dash/reports/achievements';
      return $http(angular.extend({ method: 'GET', url: apiUrl, params: params}, API_OPTIONS))
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getSOWO: function (gameId, courseId, limit) {
      var params = {
        gameId: gameId,
        courseId: courseId,
        limit: limit || 10
      };
      var apiUrl = API_BASE + '/dash/reports/sowo';
      return $http(angular.extend({method: 'GET', url: apiUrl, params: params}, API_OPTIONS))
        .then(function(response) {
          return response.data;  
        }, function(response) {
          $log.error(response);
          return response;
        });
    }


  };

  return api;

});
