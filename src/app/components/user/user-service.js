angular.module('user', [])
.factory('UserService', function ($q, $http, $log, Session, API_BASE) {

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
      angular.isDefined(_currentUser);
    },

    retrieveCurrentUser: function() {
      return $http.get(API_BASE + '/auth/user/profile');
    },

    removeCurrentUser: function() {
      _currentUser = null;
      Session.destroy();
      return true;
    },

    getById: function (userId) {
      return $http.get(API_BASE + '/auth/user/' + userId);
    },

    update: function (user) {
      return $http.post(API_BASE + '/auth/user/' + user.id, user);
    },

    register: function(regInfo) {
      return $http({
        method: 'POST',
        url: API_BASE + '/auth/user/register',
        data: regInfo,
        params: {cb: new Date().getTime()}
      });
      
    }
  };

  return api;

});
