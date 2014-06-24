angular.module('user', ['user.navbar', 'user.edit'])
.factory('UserService', function ($http, $log, Session, API_BASE) {

  var api = {

    getById: function (userId) {
      return $http
        .get('/api/user/' + userId)
        .then(function (response) {
          Session.create(response.data.id, response.data.role);
          return response.data;
        }, function(response) {
          return response;
        });
    }


  };

  return api;

});
