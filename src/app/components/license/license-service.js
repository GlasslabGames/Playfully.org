/**
 * Created by charles on 2/5/15.
 */
angular.module('license', [])
    .factory('LicenseService', function ($http, $log, API_BASE) {
        var api = {
            getCurrentPlan: function () {
                var apiUrl = API_BASE + '/license/plan';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            },
            getStudentList: function () {
                var apiUrl = API_BASE + '/license/students';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            },
            getPackages: function () {
                var apiUrl = API_BASE + '/license/packages';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            }
        };
        return api;
    });