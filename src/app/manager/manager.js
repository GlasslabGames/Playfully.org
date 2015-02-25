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
            controller: 'ManagerStudentListCtrl',
            data: {
                authorizedRoles: ['License']
            }
        })
        .state('root.manager.billing-info', {
            url: '/billing-info',
            templateUrl: 'manager/manager-billing-info.html',
            controller: 'ManagerBillingInfoCtrl',
            resolve: {
              billingInfo: function(LicenseService) {
                  return LicenseService.getBillingInfo();
              }
            },
            data: {
                authorizedRoles: ['License']
            }
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
                    controller: function ($scope, plan, $previousState) {
                        $previousState.forget('modalInvoker');
                        $scope.plan = plan;
                        $scope.package = $scope.plan.packageDetails;
                    }
                }
            },
            data: {
                reloadNextState: 'reload'
            }
        })
        .state('modal.remove-educator', {
            url: '/manager/plan/remove-educator?:email',
            data: {
                pageTitle: 'Remove educator',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-remove-educator-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService, UtilService) {
                        $scope.email = $stateParams.email;
                        $scope.request = {
                            success: false,
                            invitedEducators: null,
                            errors: []
                        };
                        $scope.removeEducator = function (email) {
                            UtilService.submitFormRequest($scope.request, function () {
                                return LicenseService.removeEducator(email);
                            });
                        };
                    }
                }
            }
        })
        .state('modal.leave-subscription', {
            url: '/manager/current/leave-subscription?:ownerName',
            data: {
                pageTitle: 'Leave subscription',
                reloadNextState: true
            },
            resolve: {
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                }
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-leave-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService, UserService, UtilService) {
                        $scope.ownerName = $stateParams.ownerName;
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.leaveSubscription = function () {
                            UtilService.submitFormRequest($scope.request, function() {
                                return LicenseService.leaveCurrentPlan();
                            }, function() {
                                UserService.updateUserSession();
                            });
                        };
                    }
                }
            }
        })
        .state('modal.auto-renew', {
            url: '/manager/current/auto-renew?expirationDate?autoRenew',
            data: {
                pageTitle: 'License Auto-Renew',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-auto-renew-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService, UtilService) {
                        $scope.expirationDate = $stateParams.expirationDate;
                        $scope.autoRenew = $stateParams.autoRenew === "true";

                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.enableAutoRenew = function () {
                            UtilService.submitFormRequest($scope.request, function() {
                                return LicenseService.enableAutoRenew();
                            });
                        };
                        $scope.disableAutoRenew = function () {
                            UtilService.submitFormRequest($scope.request, function () {
                                return LicenseService.disableAutoRenew();
                            });
                        };
                    }
                }
            }
        })
        .state('modal.start-trial-subscription', {
            url: '/start-trial-subscription',
            data: {
                pageTitle: 'Start Trial',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/start-trial-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, $window, $rootScope, LicenseService, UserService, UtilService) {
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.startTrial = function () {
                            UtilService.submitFormRequest($scope.request, function() {
                                return LicenseService.startTrial();
                            }, function() {
                                UserService.updateUserSession();
                            });
                        };
                    }
                }
            }
        })
        .state('modal.manager-upgrade-success-modal', {
            url: '/manager/upgrade-success',
            data: {
                pageTitle: 'Upgrade Successful',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-upgrade-success-modal.html',
                    controller: function ($scope, $log, $stateParams, $previousState) {
                        $previousState.forget('modalInvoker');
                    }
                }
            }
        })
        .state('root.manager.upgrade', {
            url: '/upgrade',
            resolve: {
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                },
                packages: function (LicenseService) {
                    return LicenseService.getPackages();
                },
                billingInfo: function (LicenseService) {
                    return LicenseService.getBillingInfo();
                }
            },
            templateUrl: 'manager/manager-upgrade.html',
            controller: 'ManagerUpgradeCtrl',
            data: {
                authorizedRoles: ['License']
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
            controller: 'ManagerPlanCtrl',
            data: {
                authorizedRoles: ['License']
            }
        });
    })
    .controller('ManagerCtrl', function ($scope,$state, SUBSCRIBE_CONSTANTS) {
        $scope.currentTab = $state.current.url;
    })
    .controller('ManagerBillingInfoCtrl', function ($scope, $state, billingInfo, REGISTER_CONSTANTS, LicenseService, UtilService) {
        $scope.$parent.currentTab = $state.current.url;
        $scope.billingInfo = {};
        $scope.billingInfo = billingInfo;
        $scope.isChangingCard = false;
        $scope.choices = {
            states: REGISTER_CONSTANTS.states,
            cardTypes: REGISTER_CONSTANTS.cardTypes
        };

        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };

        $scope.info = {
            CC: REGISTER_CONSTANTS.ccInfo
        };
        $scope.changeCard = function(info) {
            // stripe request
            //LicenseService.stripeValidation($scope.info.cc);
            $scope.request.isSubmitting = true;
            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                Stripe.card.createToken({
                    name: 'charles',
                    number: 4242424242424242,
                    exp_month: 1,
                    exp_year: 2020,
                    cvc: 123,
                    address_line1: 'Kaka.',
                    address_city: 'why',
                    address_zip: 95014,
                    address_state: 'CA',
                    address_country: 'USA'
                }, function (status, stripeToken) {
                    _updateBillingInfo(stripeToken);
                });
            }
        };
        var _updateBillingInfo = function (stripeToken) {
            UtilService.submitFormRequest($scope.request,function() {
                return LicenseService.updateBillingInfo(stripeToken);
            } ,function(response) {
                $scope.billingInfo = response.data;
                $scope.isChangingCard = false;
            });
        };
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
    .controller('ManagerUpgradeCtrl', function ($scope, $state, $stateParams, LicenseService, UserService, UtilService, plan, packages, billingInfo,  REGISTER_CONSTANTS) {

        // Current Plan Info
        $scope.$parent.currentTab = '/plan';

        $scope.plan = plan;
        $scope.plan.expirationDate = moment(plan.expirationDate).format("MMM Do YYYY");
        $scope.originalPackage = plan.packageDetails;
        $scope.billingInfo = billingInfo;

        if (plan.packageDetails.name === 'Trial') {
            var allGames = _.find(packages.plans, {name: 'All Games'});
            allGames.studentSeats = plan.packageDetails.studentSeats;
            allGames.educatorSeats = plan.packageDetails.educatorSeats;
            $scope.originalPackage = allGames;
        }

        // Setup Seat and Package Choices
        var selectedPackage = $scope.originalPackage;
        var packagesChoices = _.map(packages.plans, 'name');

        $scope.status = {
          packageName: selectedPackage.name,
          selectedPackage: selectedPackage,
          studentSeats: $stateParams.seatsSelected || $scope.originalPackage.studentSeats,
          isPaymentCreditCard: true,
          currentCard: 'current'
        };

        if (plan.packageDetails.name === 'Trial') {
            $scope.status.currentCard = 'change';
        }

        $scope.choices = {
            packages: packagesChoices,
            seats: packages.seats,
            states: REGISTER_CONSTANTS.states,
            cardTypes: REGISTER_CONSTANTS.cardTypes
        };

        $scope.$watch('packages.selectedName', function (packageName) {
            $scope.status.selectedPackage = _.find(packages.plans, {name: packageName});
        });

        $scope.calculateTotal = function (packageName, seatChoice) {
            var targetSeatTier = _.find($scope.choices.seats, {studentSeats: parseInt(seatChoice)});
            var targetPackage = _.find(packages.plans, {name: packageName});
            var total = seatChoice * (targetPackage.pricePerSeat || 0);
            return total - (total * (targetSeatTier.discount / 100));
        };

        // Request

        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };

        $scope.info = {
            school: {
                name: null,
                zipCode: null,
                address: null,
                state: "California",
                city: null
            },
            subscription: {},
            CC: REGISTER_CONSTANTS.ccInfo,
            PO: REGISTER_CONSTANTS.poInfo
        };

        $scope.submitPayment = function (studentSeats, packageName, info) {
            // stripe request
            if (status.currentCard === 'current') {
                return _upgradeLicense(studentSeats, packageName, {});
            }

            //LicenseService.stripeValidation(info.CC, $scope.request.errors);

            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                Stripe.card.createToken({
                    name: 'charles',
                    number: 4242424242424242,
                    exp_month: 1,
                    exp_year: 2020,
                    cvc: 123
                }, function (status, stripeToken) {
                    _upgradeLicense(studentSeats, packageName, stripeToken);
                });
            }
        };

        var _upgradeLicense = function (studentSeats, packageName, stripeInfo) {

            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});

            UtilService.submitFormRequest($scope.request, function() {
                if (plan.packageDetails.name === 'Trial') {
                    return LicenseService.upgradeFromTrial({
                        planInfo: {type: targetPlan.planId, seats: targetSeat.seatId},
                        stripeInfo: stripeInfo
                    });
                }
                return LicenseService.upgradeLicense({
                    planInfo: {type: targetPlan.planId, seats: targetSeat.seatId},
                    stripeInfo: stripeInfo
                });
            }, function() {
                UserService.updateUserSession(function () {
                    $state.go('modal.manager-upgrade-success-modal');
                });
            });
        };

    })
    .controller('ManagerPlanCtrl', function ($scope,$state, $q, plan, LicenseService, UtilService, EMAIL_VALIDATION_PATTERN) {

        $scope.$parent.currentTab = $state.current.url;
        $scope.plan = plan;
        $scope.plan.expirationDate = moment(plan.expirationDate).format("MMM Do YYYY");
        $scope.package = plan.packageDetails;

        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };

        var _requestInvite = function (invitedEducators) {
            UtilService.submitFormRequest($scope.request, function () {
                return LicenseService.inviteTeachers(invitedEducators);
            },function(response) {
                // Populate error and success alerts
                $scope.request.successes = response.approvedTeachers;
                $scope.request.rejectedTeachers = response.rejectedTeachers;
                // Set plan as returned response
                $scope.plan = response;
                $scope.plan.expirationDate = moment(response.expirationDate).format("MMM Do YYYY");
                $scope.package = response.packageDetails;
            });
        };

        var _validateEmail = function (email) {
            var re = EMAIL_VALIDATION_PATTERN;
            return re.test(email);
        };

        $scope.inviteEducators = function(string) {
            $scope.request.errors = [];
            $scope.request.successes = [];

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
