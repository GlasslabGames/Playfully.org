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
            },
            subscribeToLicense: function (input) {
                var apiUrl = API_BASE + '/license/subscribe';
                return $http.post(apiUrl, {planInfo: input.planInfo, stripeInfo: input.stripeInfo })
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            },
            inviteTeachers: function (emails) {
                var apiUrl = API_BASE + '/license/invite';
                return $http.post(apiUrl, {teacherEmails: emails})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            }
        };
        return api;
    });