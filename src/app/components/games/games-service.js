angular.module('games', [])
.factory('GamesService', function ($http, $log, API_BASE) {

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

    getInfo: function (gameId) {
      return $http
        .get(API_BASE + '/dash/game/' + gameId + '/info')
        .then(function (response) {
          $log.debug(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getDetail: function (gameId) {
      return $http.get(API_BASE + '/dash/game/' + gameId)
        .then(function (response) {
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getGameMissions: function (gameId) {
      return $http.get(API_BASE + '/dash/game/' + gameId + '/missions')
        .then(function (response) {
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    all: function (type) {
      var url = '/dash/games';
      if (type) { url += "/"+type; }
      return $http
        .get(API_BASE + url)
        .then(function (response) {
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    active: function (type) {
      var url = '/dash/games/active';
      if (type) { url += "/" + type; }
      return $http
          .get(API_BASE + url)
          .then(function (response) {
            return response.data;
          }, function (response) {
            $log.error(response);
            return response;
          });
    },

    save: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId)
        .then(function(response) {
          $log.debug(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    updateDevice: function() {
      return $http
        .post(API_BASE + '/data/game/device')
        .then(function (response) {
          $log.debug(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },

    getPlayInfo: function(gameId) {
      return $http
        .get(API_BASE + '/data/game/' + gameId + '/playInfo')
        .then(function (response) {
          $log.debug(response);
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    },


    getTimePlayed: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId + '/totalTimePlayed')
        .then(function (response) {
          $log.debug(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    addAchievement: function (gameId) {
      return $http
        .post(API_BASE + '/data/game/' + gameId + '/achievement')
        .then(function (response) {
          $log.debug(response);
          return response.data;
        }, function (response) {
          $log.error(response);

          return response;
        });
    },

    getAllReports: function (gameId) {
      var _modifyOrderOfReports = function (list) {
        var dict = {
          'sowo': 1,
          'mission-progress': 2,
          'achievements': 3,
          'competency': 4
        };
        list.sort(function (a, b) {
          return dict[a.id] - dict[b.id];
        });
        return list;
      };
      
      return $http.get(API_BASE + '/dash/game/' + gameId + '/reports/all')
        .then (function(response) {
          response.data.list = _modifyOrderOfReports(response.data.list);
          $log.debug(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getMyGames: function () {
      return $http.get(API_BASE + '/dash/myGames')
        .then (function(response) {
        $log.debug(response);
        return response.data;
      }, function (response) {
        $log.error(response);
        return response;
      });
    }
  };

  return api;

});
