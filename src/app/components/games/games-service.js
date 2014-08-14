angular.module('games', [])
.factory('GamesService', function ($http, $log, API_BASE, API_OPTIONS) {

  var api = {

    get: function (gameId) {
      return $http
        .get(API_BASE + '/data/game/' + gameId, API_OPTIONS)
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getInfo: function (gameId) {
      return $http
        .get(API_BASE + '/dash/game/' + gameId + '/info', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getDetail: function (gameId) {
      return $http.get(API_BASE + '/dash/game/' + gameId, API_OPTIONS)
        .then(function (response) {
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    all: function (type) {
      var url = '/dash/games';
      if (type == 'min') { url += '/minimal'; }
      return $http
        .get(API_BASE + url, API_OPTIONS)
        .then(function (response) {
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    save: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId, API_OPTIONS)
        .then(function(response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    updateDevice: function() {
      return $http
        .post(API_BASE + '/data/game/device', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getPlayInfo: function(gameId) {
      return $http
        .get(API_BASE + '/data/game/' + gameId + '/playInfo', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },


    getTimePlayed: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId + '/totalTimePlayed', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    addAchievement: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId + '/achievement', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getAchievements: function (gameId) {
      return $http
        .get(API_BASE + '/dash/game/' + gameId + '/achievements', API_OPTIONS)
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getReports: function (gameId) {
      return $http.get(API_BASE + '/dash/game/' + gameId + '/reports', API_OPTIONS)
        .then (function(response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    }
  };

  return api;

});
