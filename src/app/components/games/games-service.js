angular.module('games', [])
.factory('GamesService', function ($http, $log, API_BASE) {

  var api = {

    get: function (gameId) {
      return $http
        .get(API_BASE + '/data/game/' + gameId)
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
        .get(API_BASE + '/dash/game/' + gameId + '/info')
        .then(function (response) {
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getDetail: function (gameId) {
      return $http.get(API_BASE + '/dash/game/' + gameId)
        .then(function (response) {
          $log.info(response);
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
        .get(API_BASE + url)
        .then(function (response) {
          $log.info(response);
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
          $log.info(response);
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
          $log.info(response);
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
          $log.info(response);
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
          $log.info(response);
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
          $log.info(response);
          return response.data;
        }, function (response) {
          $log.error(response);
          return response;
        });
    },

    getAchievements: function (gameId) {
      return $http
        .get(API_BASE + '/dash/game/' + gameId + '/achievements')
        .then(function (response) {
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
