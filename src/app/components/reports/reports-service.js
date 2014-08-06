angular.module('reports', [])
.factory('ReportsService', function ($http, $log, API_BASE) {

  var api = {

    getAchievements: function (gameId, courseId) {
      var params = {
        gameId: gameId,
        courseId: courseId
      };
      var apiUrl = API_BASE + '/dash/reports/achievements';
      return $http({ method: 'GET', url: apiUrl, params: params})
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },


  };

  return api;

});
