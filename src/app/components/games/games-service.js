angular.module('games', [
  'reports.const'
])
.factory('GamesService', function ($http, $log, API_BASE, REPORT_CONSTANTS) {

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

    getGamesForPlan: function () {
        var url = '/dash/games/plan/basic';
        return $http
            .get(API_BASE + url)
            .then(function (response) {
                return response.data;
            }, function (response) {
                $log.error(response);
                return response;
            });
    },

    hasAccessToGameInCourse: function(gameId, courseId) {
      var url = '/lms/course/' + courseId + '/game/' + gameId + '/verify-access';
        return $http.get(API_BASE + url);
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
    /** Returns list of students and their total time played **/
    getTotalTimePlayed: function (gameId, studentIds) {
      /* expects array of studentIds */
      return $http({
        url: '/api/v2/dash/reports/totalTimePlayed',
        method: "GET",
        params: {gameId: gameId, userIds: studentIds}
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
      /** Sets order of reports dropdown and default report in Reports Page **/
      var _modifyOrderOfReports = function (list) {
        var dict = REPORT_CONSTANTS.orderOfReports;
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

    // Returns basic info for all games current user has in all his classes
    getMyGames: function () {
      return $http.get(API_BASE + '/dash/myGames')
        .then (function(response) {
        $log.debug(response);
        return response.data;
      }, function (response) {
        $log.error(response);
        return response;
      });
    },

    getMyDeveloperGames: function () {
      return $http.get(API_BASE + '/dash/developer/info')
          .then(function(response) {
            $log.debug(response);
            return response.data;
          }, function (response) {
            $log.error(response);
            return response;
          });
    },
    getDeveloperGamesInfoSchema: function() {
      return $http.get(API_BASE + '/dash/developer/info/schema')
          .then(function(response) {
            $log.debug(response);
            return response.data;
          }, function (response) {
            $log.error(response);
            return response;
          });
    },
    getDeveloperGameInfo: function(gameId) {
      return $http.get(API_BASE + '/dash/developer/info/game/' + gameId)
          .then(function(response) {
              $log.debug(response);
              return response.data;
          }, function (response) {
              $log.error(response);
              return response;
          });
    },
    updateDeveloperGameInfo: function(gameId,data) {

// data = undefined

console.log('xxxx--------xxxx trying to call /dash/developer/info/game/<gameId> ...');
console.log('    data keys =', '\n'+Object.keys(data));
console.log('    data.assessment[0].rules.wo5.description =', '\n'+data.assessment[0].rules.wo5.description);
console.log('xxxxxxxx');

      return $http.post(API_BASE + '/dash/developer/info/game/' + gameId, {jsonStr: JSON.stringify(data)})
          .then(function(response) {
            $log.debug(response);
            return response.data;
          }, function (response) {
            $log.error(response);
            return response;
          });
    },

    checkForGameAccess: function() {
      return $http.get(API_BASE + '/dash/developer/profile')
          .then(function(response) {
            return response.data;
          }, function(err){
            $log.error("check game access:", err);
            return err;
          });
    },

    requestGameAccess: function(gameId) {
      return $http.get(API_BASE + '/auth/developer/game/' + gameId + '/request');
    },

    getBadgeDetailsFromLRNG: function(badgeId) {
      return $http.get(API_BASE + '/dash/badge/' + badgeId )
          .then(function(response) {
              $log.debug(response);
              return response;
          }, function (response) {
              $log.error(response);
              return response;
          });
    },

    generateBadgeCode: function(userId, badgeId) {
      return $http.post(API_BASE + '/dash/badge/' + badgeId + '/generateCode/' + userId)
          .then(function(response) {
              $log.debug(response);
              return response;
          }, function (response) {
              $log.error(response);
              return response;
          });
    }

	};

  return api;

});
