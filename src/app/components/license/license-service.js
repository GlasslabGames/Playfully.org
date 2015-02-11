/**
 * Created by charles on 2/5/15.
 */
angular.module('license', [])
    .service('LicenseService', function ($http, $log, $rootScope, API_BASE) {

            this.getCurrentPlan = function () {
                var apiUrl = API_BASE + '/license/plan';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.getStudentList = function () {
                var apiUrl = API_BASE + '/license/students';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.getPackages = function () {
                var apiUrl = API_BASE + '/license/packages';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.subscribeToLicense = function (input) {
                var apiUrl = API_BASE + '/license/subscribe';
                return $http.post(apiUrl, {planInfo: input.planInfo, stripeInfo: input.stripeInfo })
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.inviteTeachers = function (emails) {
                var apiUrl = API_BASE + '/license/invite';
                return $http.post(apiUrl, {teacherEmails: emails})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.activateLicenseStatus = function () {
                var apiUrl = API_BASE + '/license/activate';
                return $http.post(apiUrl)
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.isOwner = function () {
                if ($rootScope.currentUser) {
                    return $rootScope.currentUser.id === $rootScope.currentUser.licenseOwnerId;
                }
            };
            this.hasLicense = function () {
              if ($rootScope.currentUser) {
                  return $rootScope.currentUser.licenseStatus ==="active";
              }
            };
            this.leaveCurrentPlan = function () {
                var apiUrl = API_BASE + '/license/leave';
                return $http.post(apiUrl)
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.removeEducator = function (email) {
                var apiUrl = API_BASE + '/license/remove';
                return $http.post(apiUrl, {teacherEmail: email})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
            this.startTrial = function () {
                var apiUrl = API_BASE + '/license/trial';
                return $http.post(apiUrl)
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        return response;
                    });
            };
    });