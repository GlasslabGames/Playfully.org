angular.module( 'playfully.check', [])
.factory('ConfigRsrc',['$http','API_BASE', function ($http, API_BASE) {
    var resource = {
        /**
         Method returns server configuration.

         @method get
         **/
        get: function () {
            return $http({
                method: 'GET',
                url: API_BASE + '/config/',
                params: {cb: new Date().getTime()}
            });
        }
    };
    return resource;
    }
]);