angular.module('user', [])
.factory('UserService', function ($q, $http, $log, $window, Session, API_BASE, API_OPTIONS) {

  var _currentUser;

  var api = {

    currentUser: function() {
      var deferred = $q.defer();
      if (angular.isDefined(_currentUser) && _currentUser !== null) {
        deferred.resolve(_currentUser);
        return deferred.promise;
      }

      api.retrieveCurrentUser()
        .success(function(data) {
          _currentUser = data;
          Session.create(data.id, data.role);
          deferred.resolve(_currentUser);
        })
        .error(function() {
          _currentUser = null;
          Session.destroy();
          deferred.resolve(null);
        });
      return deferred.promise;
    },

    isAuthenticated: function() {
      return !!_currentUser;
    },

    hasCurrentUser: function() {
      return angular.isDefined(_currentUser);
    },

    retrieveCurrentUser: function() {
      return $http.get(API_BASE + '/auth/user/profile', API_OPTIONS);
    },

    removeCurrentUser: function() {
      _currentUser = null;
      Session.destroy();
      return true;
    },

    getById: function (userId) {
      return $http.get(API_BASE + '/auth/user/' + userId, API_OPTIONS);
    },

    update: function (user) {
      user.userId = user.id;
      $log.info(user);
      result = $http.post(API_BASE + '/auth/user/' + user.id, user, API_OPTIONS);
      result.success(function(data) {
        _currentUser = data;
      });
      return result;
    },

    register: function(regInfo) {
      return $http(angular.extend({
        method: 'POST',
        url: API_BASE + '/auth/user/register',
        data: regInfo,
        params: {cb: new Date().getTime()}
      }, API_OPTIONS));
    }
  };

  return api;

});

