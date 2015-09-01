angular.module('user', [])
.factory('UserService', function ($q, $http, $log, $window, Session, API_BASE, $rootScope, CHECKLIST, AUTH_EVENTS) {

  var _currentUser;

  var api = {

    currentUser: function(startNewSession) {
      var deferred = $q.defer();
      if (angular.isDefined(_currentUser) && _currentUser !== null && !startNewSession) {
        deferred.resolve(_currentUser);
        return deferred.promise;
      }

      api.retrieveCurrentUser()
        .success(function(data) {
          _currentUser = data;
          Session.create(data.id, data.role, data.loginType, data.licenseStatus, data.purchaseOrderLicenseStatus, data.licenseOwnerId, data.paymentType, data.isTrial, data.hadTrial, data.packageType);
          deferred.resolve(_currentUser);
        })
        .error(function() {
          _currentUser = null;
          Session.destroy();
          deferred.resolve(null);
        });
      return deferred.promise;
    },
    updateUserSession: function(callback) {
        api.currentUser('startNewSession').then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.userRetrieved, user);
            if (callback) {
                callback();
            }
        });
    },
    isAuthenticated: function() {
      return !!_currentUser;
    },

    hasCurrentUser: function() {
      return angular.isDefined(_currentUser);
    },

    isSSOLogin: function(_user){
      // default to currentUser
      var user = _user || _currentUser;
      if(user) {
        if(user.loginType != 'glasslabv2') {
          return true;
        }
      }

      return false;
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

    update: function (user, shouldUpdateCurrentUser) {
      if (typeof(shouldUpdateCurrentUser) === 'undefined') {
        shouldUpdateCurrentUser = true;
      }
      user.userId = user.id;
      result = $http.post(API_BASE + '/auth/user/' + user.id, user);
      result.success(function(data) {
        if (shouldUpdateCurrentUser) {
          _currentUser = data;
        }
      });
      return result;
    },

    register: function(regInfo, upgrade, packageInfo) {
      var params = { cb: new Date().getTime() };
      if( upgrade ) {
        params.upgrade = upgrade;
      }
      if( packageInfo ) {
        params.seatsSelected = packageInfo.seatsSelected;
        params.packageType = packageInfo.packageType;
      }

      return $http({
        method: 'POST',
        url: API_BASE + '/auth/user/register',
        data: regInfo,
        params: params
      });
    },

    updateUserFTUE: function(checkListEvent) {
      var _updateUserFTUE = function (order) {
        if ($rootScope.currentUser.ftue < order) {
          $rootScope.currentUser.ftue = order;
          api.update($rootScope.currentUser);
        }
      };

      if ($rootScope.currentUser &&
          ($rootScope.currentUser.role === 'instructor') &&
          (!$rootScope.currentUser.ftue || $rootScope.currentUser.ftue < 4)) {
            if (CHECKLIST.visitGameCatalog === checkListEvent) {
              _updateUserFTUE(1);
            }
            if (CHECKLIST.createCourse === checkListEvent) {
              _updateUserFTUE(2);
            }
            if (CHECKLIST.inviteStudents === checkListEvent) {
              _updateUserFTUE(3);
            }
            if (CHECKLIST.closeFTUE === checkListEvent) {
              _updateUserFTUE(4);
            }
      }

    }
  };

  return api;

});

