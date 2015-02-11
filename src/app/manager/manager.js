angular.module('playfully.manager', [])
    .config(function ($stateProvider) {
        $stateProvider.state('root.manager', {
            abstract: true,
            url: 'manager',
            views: {
                'main@': {
                    templateUrl: 'manager/manager.html',
                    controller: 'ManagerCtrl'
                }
            }
        })
        .state('root.manager.student-list', {
            url: '/student-list',
            resolve: {
                studentList: function (LicenseService) {
                    return LicenseService.getStudentList();
                }
            },
            templateUrl: 'manager/manager-student-list.html',
            controller: 'ManagerStudentListCtrl'
        })
        .state('modal.notify-invited-subscription', {
            url: '/notify-invited-subscription',
            resolve: {
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                }
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/notify-invited-subscription-modal.html',
                    controller: function ($scope, plan) {
                        $scope.plan = plan;
                        $scope.package = $scope.plan.packageDetails;
                    }
                }
            }
        })
        .state('modal.remove-educator', {
            url: '/manager/plan/remove-educator?:email',
            data: {
                pageTitle: 'Remove educator'
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-remove-educator-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService) {
                        $scope.email = $stateParams.email;
                        $scope.request = {
                            success: false,
                            invitedEducators: null,
                            errors: []
                        };
                        $scope.removeEducator = function (email) {
                            $scope.request.isSubmitting = true;
                            LicenseService.removeEducator(email).then(function () {
                                    $scope.request.errors = [];
                                    $scope.request.isSubmitting = false;
                                    $scope.request.success = true;
                                },
                                function (response) {
                                    $log.error(response.data);
                                    $scope.request.isSubmitting = false;
                                    $scope.request.errors = [];
                                    $scope.request.errors.push(response.data.error);
                                });
                        };
                    }
                }
            }
        })
        .state('modal.leave-subscription', {
            url: '/manager/current/leave-subscription?:email',
            data: {
                pageTitle: 'Leave subscription'
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-leave-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService) {
                        $scope.email = $stateParams.email;
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.leaveSubscription = function () {
                            LicenseService.leaveCurrentPlan().then(function (response) {
                                    $scope.request.errors = [];
                                    $scope.request.isSubmitting = false;
                                    $scope.request.success = true;
                                },
                                function (response) {
                                    $log.error(response.data);
                                    $scope.request.isSubmitting = false;
                                    $scope.request.errors = [];
                                    $scope.request.errors.push(response.data.error);
                                });
                        };
                    }
                }
            }
        })
        .state('modal.start-trial-subscription', {
            url: '/start-trial-subscription',
            data: {
                pageTitle: 'Remove educator'
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/start-trial-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService) {
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.startTrial = function () {
                          $scope.request.isSubmitting = true;
                          LicenseService.startTrial().then(function (response) {
                                  $scope.request.errors = [];
                                  $scope.request.isSubmitting = false;
                                  $scope.request.success = true;
                              },
                              function (response) {
                                  $log.error(response.data);
                                  $scope.request.isSubmitting = false;
                                  $scope.request.errors = [];
                                  $scope.request.errors.push(response.data.error);
                              });
                        };
                    }
                }
            }
        })
        .state('root.manager.plan', {
            url: '/plan',
            resolve: {
                plan: function(LicenseService) {
                    return LicenseService.getCurrentPlan();
                }
            },
            templateUrl: 'manager/manager-plan.html',
            controller: 'ManagerPlanCtrl'
        });
    })
    .controller('ManagerCtrl', function ($scope,$state, SUBSCRIBE_CONSTANTS) {
        $scope.currentTab = $state.current.url;

    })
    .controller('ManagerStudentListCtrl', function ($scope,$state, studentList) {
        $scope.$parent.currentTab = $state.current.url;

        $scope.studentList = studentList;

        $scope.userSortFunction = function (colName, callback) {
            return function (user) {
                if (colName === 'firstName') {
                    return user.firstName;
                }
                if (colName === 'lastInitial') {
                    return user.lastInitial;
                }
                if (colName === 'screenName') {
                    return user.username;
                }
                if (callback) {
                    return callback();
                }
            };
        };
        // Highlights currently selected column, name is the default selected column
        $scope.sortSelected = function (colName) {

            var columns = $scope.col;
            // check if column exists
            if (!columns[colName]) {
                columns[colName] = {};
            }
            // check if clicked column is already active
            if (columns['current'] === colName) {
                columns[colName].reverse = !columns[colName].reverse;
                return;
            }
            // set previous current values to false
            columns[columns.current].reverse = false;
            // set clicked column as new current and to active
            columns.current = colName;
            return;
        };

        $scope.col = {firstName: {reverse: false}, lastInitial: {}, screenName: {}, current: 'firstName'};
        $scope.colName = {value: 'firstName'};
    })
    .controller('ManagerPlanCtrl', function ($scope,$state, plan, LicenseService) {

        $scope.$parent.currentTab = $state.current.url;
        $scope.plan = plan;
        $scope.plan.expirationDate = moment(plan.expirationDate).format("MMM Do YYYY");
        $scope.package = plan.packageDetails;

        $scope.request = {
            success: false,
            invitedEducators: null,
            errors: []
        };

        var _requestInvite = function (invitedEducators) {
            request.isSubmitting = true;
            LicenseService.inviteTeachers(invitedEducators)
                .then(function (response) {
                    console.log(response);
                    $scope.request.errors = [];
                    $scope.request.isSubmitting = false;
                    $scope.request.success = true;
                },
                function (response) {
                    $log.error(response.data);
                    $scope.request.isSubmitting = false;
                    $scope.request.errors = [];
                    $scope.request.errors.push(response.data.error);
                });
        };

        var _validateEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.inviteEducators = function(string) {

            var str = string.replace(/\s+/g, '');
            var educators = str.split(',');
            var valid = [];
            var invalid = [];

            if (educators.length > $scope.plan.educatorSeatsRemaining) {
                invalid.push("You tried inviting " + educators.length + " educators. But you only have " +
                $scope.plan.educatorSeatsRemaining  + " educator seats remaining in your subscription.");
            }

            if (educators.length) {
                for (var i = 0; i < educators.length; i++) {

                    if (_.some($scope.plan.educatorList, {email:educators[i]})) {
                        invalid.push(educators[i] + ' is already sharing your subscription.');
                    }
                    if (_validateEmail(educators[i])) {
                        valid.push(educators[i]);
                    } else {
                        invalid.push('Invalid Email: ' + educators[i]);
                    }
                }
            }

            if (invalid.length < 1) {
                _requestInvite(valid);
            }

            $scope.request.errors = invalid;
        };

    });

