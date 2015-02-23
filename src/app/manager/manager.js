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
                    controller: function ($scope, $log, $stateParams, LicenseService, $previousState, UserService) {

                        $scope.ownerName = $stateParams.ownerName;

                        $scope.request = {
                            success: false,
                            errors: []
                        };

                        $scope.leaveSubscription = function () {
                            LicenseService.leaveCurrentPlan().then(function (response) {
                                    $scope.request.errors = [];
                                    $scope.request.isSubmitting = false;
                                    $scope.request.success = true;
                                    UserService.updateUserSession();
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
        .state('modal.auto-renew', {
            url: '/manager/current/auto-renew?expirationDate?autoRenew',
            data: {
                pageTitle: 'License Auto-Renew',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-auto-renew-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService) {
                        $scope.expirationDate = $stateParams.expirationDate;

                        if ($stateParams.autoRenew === "true") {
                            $scope.autoRenew = true;
                        } else {
                            $scope.autoRenew = false;
                        }

                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.enableAutoRenew = function () {
                            $scope.request.isSubmitting = true;
                            $scope.request.errors = [];
                            LicenseService.enableAutoRenew().then(function (response) {
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
                        $scope.disableAutoRenew = function () {
                            $scope.request.isSubmitting = true;
                            $scope.request.errors = [];
                            LicenseService.disableAutoRenew().then(function (response) {
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
                pageTitle: 'Start Trial',
                reloadNextState: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/start-trial-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, $window, $rootScope, LicenseService, UserService) {
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.startTrial = function () {
                          $scope.request.isSubmitting = true;
                          LicenseService.startTrial().then(function () {
                                  $scope.request.errors = [];
                                  $scope.request.isSubmitting = false;
                                  $scope.request.success = true;
                                  UserService.updateUserSession();
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
    .controller('ManagerBillingInfoCtrl', function ($scope, $state, billingInfo, REGISTER_CONSTANTS, LicenseService, UserService) {
        $scope.$parent.currentTab = $state.current.url;
        $scope.billingInfo = billingInfo;
        $scope.isChangingCard = false;
        $scope.choices = {
            states: REGISTER_CONSTANTS.states,
            cardTypes: ["Visa", "MasterCard", "American Express", "Discover", "Diners Club", "JCB"]
        };

        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };

        $scope.info = {
            CC: {
                name: null,
                cardType: "Visa",
                number: null,
                exp_month: null,
                exp_year: null,
                cvc: null,
                address_line1: null,
                address_line2: null,
                address_city: null,
                address_state: null,
                address_zip: null,
                address_country: null
            }
        };
        $scope.changeCard = function(info) {
            // stripe request
            //if (!Stripe.card.validateCardNumber(info.payment.number)) {
            //  $scope.request.errors.push("You entered an invalid Credit Card number");
            //}
            //if (!Stripe.card.validateExpiry(info.payment.exp_month, info.payment.exp_year)) {
            //    $scope.request.errors.push("You entered an invalid expiration date");
            //}
            //if (!Stripe.card.validateCVC(info.payment.cvc)) {
            //    $scope.request.errors.push("You entered an invalid CVC number");
            //}
            //if (!Stripe.card.cardType(info.payment.cardType)) {
            //    $scope.request.errors.push("You entered an invalid CVC number");
            //}
            $scope.request.isSubmitting = true;
            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                Stripe.card.createToken({
                    name: 'charles',
                    number: 4242424242424242,
                    exp_month: 1,
                    exp_year: 2020,
                    cvc: 123,
                    address_line1: '1945 GlassLab Dr.',
                    address_city: 'Transparent City',
                    address_zip: 95014,
                    address_state: 'CA',
                    address_country: 'USA'
                }, function (status, stripeToken) {
                    _updateBillingInfo(stripeToken.id);
                });
            }
        };
        var _updateBillingInfo = function (stripeTokenId) {
            $scope.request.isSubmitting = true;
            $scope.request.errors = [];
            LicenseService.updateBillingInfo(stripeTokenId).then(function () {
                $scope.request.errors = [];
                $scope.request.isSubmitting = false;
                $scope.request.success = true;
                UserService.updateUserSession(function () {
                    $scope.isChangingCard = false;
                });
            }, function (response) {
                $scope.request.isSubmitting = false;
                $scope.request.errors = [];
                $scope.request.errors.push(response.data.error);
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
    .controller('ManagerUpgradeCtrl', function ($scope, $state, $stateParams, LicenseService, UserService, plan, packages, billingInfo,  REGISTER_CONSTANTS) {

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
            cardTypes: ["Visa", "MasterCard", "American Express", "Discover", "Diners Club", "JCB"]
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
            CC: {
                name: null,
                cardType: "Visa",
                number: null,
                exp_month: null,
                exp_year: null,
                cvc: null
            },
            PO: {
                name: null,
                phone: null,
                email: null,
                number: null
            }
        };



        $scope.submitPayment = function (studentSeats, packageName,info) {
            // stripe request
            //if (!Stripe.card.validateCardNumber(info.payment.number)) {
            //  $scope.request.errors.push("You entered an invalid Credit Card number");
            //}
            //if (!Stripe.card.validateExpiry(info.payment.exp_month, info.payment.exp_year)) {
            //    $scope.request.errors.push("You entered an invalid expiration date");
            //}
            //if (!Stripe.card.validateCVC(info.payment.cvc)) {
            //    $scope.request.errors.push("You entered an invalid CVC number");
            //}
            //if (!Stripe.card.cardType(info.payment.cardType)) {
            //    $scope.request.errors.push("You entered an invalid CVC number");
            //}

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

            $scope.request.isSubmitting = true;
            $scope.request.errors = [];

            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});

            LicenseService.upgradeLicense({
                planInfo: {type: targetPlan.planId, seats: targetSeat.seatId},
                stripeInfo: stripeInfo
            }).then(function () {
                $scope.request.errors = [];
                $scope.request.isSubmitting = false;
                $scope.request.success = true;
                UserService.updateUserSession(function () {
                    $state.go('modal.manager-upgrade-success-modal');
                });
            }, function (response) {
                $scope.request.isSubmitting = false;
                $scope.request.errors = [];
                $scope.request.errors.push(response.data.error);
            });
        };

    })
    .controller('ManagerPlanCtrl', function ($scope,$state, plan, LicenseService, EMAIL_VALIDATION_PATTERN) {

        $scope.$parent.currentTab = $state.current.url;
        $scope.plan = plan;
        $scope.plan.expirationDate = moment(plan.expirationDate).format("MMM Do YYYY");
        $scope.package = plan.packageDetails;
        console.log(plan);
        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };
        var _requestInvite = function (invitedEducators) {
            request.isSubmitting = true;
            LicenseService.inviteTeachers(invitedEducators)
                .then(function (response) {
                    // Populate error and success alerts
                    $scope.request.successes = response.approvedTeachers;
                    $scope.request.rejectedTeachers = response.rejectedTeachers;
                    $scope.request.invitedEducators = '';
                    // Set plan as returned response
                    $scope.plan = response;
                    $scope.plan.expirationDate = moment(response.expirationDate).format("MMM Do YYYY");
                    $scope.package = response.packageDetails;

                    $scope.request.errors = [];
                    $scope.request.isSubmitting = false;
                    $scope.request.success = true;
                },
                function (response) {
                    $scope.request.isSubmitting = false;
                    $scope.request.errors = [];
                    $scope.request.errors.push(response.data.error);
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

