angular.module('dash', [])
.service('DashService', function ($http, $log, API_BASE) {

    this.getMessages = function(messageId, limit, asc) {
      var apiUrl = API_BASE + '/dash/message-center/' + messageId;
      if( limit ) {
        apiUrl += "?limit=" + limit;
        if( asc ) {
          apiUrl += "&asc=" + asc;
        }
      }
      else if( asc ) {
        apiUrl += "?asc=" + asc;
      }

      return $http({
          method: 'GET',
          url: apiUrl
        })
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    };

    this.postMessage = function(messageId, messageData) {
      var apiUrl = API_BASE + '/dash/message-center/' + messageId;
      return $http({
          method: 'POST',
          url: apiUrl,
          data: messageData
        })
        .then(function(response) {
          return response.data;
        }, function(response) {
          $log.error(response);
          return response;
        });
    };
});