angular.module('playfully.manager', [])
    .config(function ($stateProvider) {
        $stateProvider.state('root.manager', {
            abstract: true,
            url: 'manager',
            data: {
              ssl: true
            },
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
        .state('root.manager.purchase-order-status', {
            url: '/purchase-order-status',
            templateUrl: 'subscribe/purchase-order-status.html',
            resolve: {
              purchaseOrderInfo: function(LicenseService) {
                  return LicenseService.getPurchaseOrderInfo();
              }
            },
            controller: function($scope, $state, purchaseOrderInfo) {
                $scope.$parent.currentTab = $state.current.url;
                $scope.info = purchaseOrderInfo;
            },
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
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                }
            },
            templateUrl: 'manager/manager-plan.html',
            controller: 'ManagerPlanCtrl',
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
        .state('modal-xlg.prorating-information', {
            url: '/prorating-information',
            views: {
                'modal@': {
                    templateUrl: 'manager/prorating-information-modal.html'
                }
            }
        })
        .state('modal-lg.games-available', {
            url: '/games-available?:planId?:packageName',
            data: {
                pageTitle: 'Games Available'
            },
            resolve: {
                gamesAvailable: function ($stateParams, LicenseService) {
                   return LicenseService.getGamesByPlanType($stateParams.planId);
                }
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/games-available-modal.html',
                    controller: function ($scope, $log, $stateParams, gamesAvailable) {
                        $scope.gamesAvailable = gamesAvailable;
                        $scope.packageName = $stateParams.packageName;
                    }
                }
            }
        })
        .state('modal.remove-educator', {
            url: '/manager/plan/remove-educator?:email',
            data: {
                pageTitle: 'Remove educator',
                reloadNextState: true,
                ssl: true
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
                reloadNextState: true,
                ssl: true
            },
            resolve: {
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                }
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-leave-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, LicenseService, UserService, UtilService, $previousState) {
                        $previousState.forget('modalInvoker');
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
        /*.state('modal.auto-renew', {
            url: '/manager/current/auto-renew?expirationDate?autoRenew',
            data: {
                pageTitle: 'License Auto-Renew',
                reloadNextState: true,
                ssl: true
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
        })*/
        .state('modal.start-trial-subscription', {
            url: '/start-trial-subscription',
            data: {
                pageTitle: 'Start Trial',
                reloadNextState: 'reload app',
                ssl: true
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/start-trial-subscription-modal.html',
                    controller: function ($scope, $log, $stateParams, $window, $rootScope, LicenseService, UserService, UtilService, $previousState) {
                        $previousState.forget('modalInvoker');
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
        .state('modal.error-processing-upgrade', {
            url: '/manager/error-processing-upgrade',
            views: {
                'modal@': {
                    templateUrl: 'manager/error-processing-upgrade-modal.html',
                    controller: function ($scope, $log, $stateParams, $previousState) {
                        $previousState.forget('modalInvoker');
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
        });
    })
    .controller('ManagerCtrl', function ($scope,$state) {
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
        $scope.changeCard = function(info,test) {
            if (test) {
                if ($scope.request.errors < 1) {
                    Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                    Stripe.card.createToken({
                        name: 'charles',
                        number: 4242424242424242,
                        exp_month: 1,
                        exp_year: 2020,
                        cvc: 123,
                        address_line1: 'Kaka.',
                        address_city: 'whybutts',
                        address_zip: 95014,
                        address_state: 'CA',
                        address_country: 'USA'
                    }, function (status, stripeToken) {
                        _updateBillingInfo(stripeToken);
                    });
                }
                return;
            }
            LicenseService.stripeValidation($scope.info.CC);
            if ($scope.isChangingCard) {

            }
            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                Stripe.card.createToken($scope.info.CC, function (status, stripeToken) {
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

        $scope.$watch('status.packageName', function (packageName) {
            $scope.status.selectedPackage = _.find(packages.plans, {name: packageName});
        });

        // Request

        $scope.promoCode = {
            code: null,
            valid: false,
            amount_off: 0,
            percent_off: 0
        };

        $scope.requestPromo = {
            success: false,
            errors: [],
            successes: [],
            isSubmitting: false
        };
        $scope.request = {
            success: false,
            invitedEducators: '',
            errors: [],
            successes: []
        };

        $scope.info = {
            school: REGISTER_CONSTANTS.school,
            subscription: {},
            CC: REGISTER_CONSTANTS.ccInfo,
            PO: REGISTER_CONSTANTS.poInfo
        };

        $scope.submitPayment = function (studentSeats, packageName, info, test) {
            // stripe request
            if ($scope.status.currentCard === 'current') {
                return _upgradeLicense(studentSeats, packageName, {});
            }

            if (test) {
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
                return;
            }

            LicenseService.stripeValidation(info.CC, $scope.request.errors);

            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
                Stripe.card.createToken(info.CC, function (status, stripeToken) {
                    _upgradeLicense(studentSeats, packageName, stripeToken);
                });
            }
        };

        var _upgradeLicense = function (studentSeats, packageName, stripeInfo) {

            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});

            // Attach the promo code as a "coupon" to stripeInfo if it is valid
            if ($scope.promoCode.valid) {
                stripeInfo.coupon = $scope.promoCode.code;
            }

            UtilService.submitFormRequest($scope.request, function() {
                if (plan.packageDetails.name === 'Trial') {
                    return LicenseService.upgradeFromTrial({
                        planInfo: {type: targetPlan.planId, seats: targetSeat.seatId, promoCode: stripeInfo.coupon},
                        stripeInfo: stripeInfo
                    });
                }
                return LicenseService.upgradeLicense({
                    planInfo: {type: targetPlan.planId, seats: targetSeat.seatId, promoCode: stripeInfo.coupon},
                    stripeInfo: stripeInfo
                });
            }, function() {
                UserService.updateUserSession(function () {
                    $state.go('modal.manager-upgrade-success-modal');
                });
            });
        };

        var _calculateProrateQuotient = function() {
            var expirationTemp = plan.expirationDate.split(' ');
            var expirationYear = expirationTemp[2];
            var startYear = expirationYear - 1;
            expirationTemp[2] = startYear;
            var startDate = expirationTemp.join(' ');
            var daysFromNow = moment(startDate, 'MMMM Do YYYY').fromNow();
            daysFromNow = parseInt(daysFromNow.split(' ')[0]);
            return (365-daysFromNow)/365;
        };
        var _calculateTotal = function (packageName, seatChoice) {
            var targetSeatTier = _.find($scope.choices.seats, {studentSeats: parseInt(seatChoice)});
            var targetPackage = _.find(packages.plans, {name: packageName});
            var total = seatChoice * (targetPackage.pricePerSeat || 0);
            total = total - (total * (targetSeatTier.discount / 100));
            /* Changes output from number to string type and fixed to the 10ths digit */
            return total.toFixed(2);
        };

        var _calculateDiscounted = function (total, discount, type) {
            var discountedTotal = total;
            /* Apply amount off or percentage off */
            if (type === 'amount off') {
                discountedTotal = total - (discount);
                $scope.promoDiscount = discount;
            } else if (type === 'percent_off'){
                $scope.promoDiscount = total * (discount / 100);
                discountedTotal = total - ($scope.promoDiscount);
            }
            /* Show how much money was discounted */
            if ($scope.promoDiscount) {
                $scope.promoDiscount = $scope.promoDiscount.toFixed(2);
            }
            return discountedTotal;
        };

        $scope.calculateDiscountedTotal = function (packageName, seatChoice, type) {
            var total = _calculateTotal(packageName, seatChoice);
            if ($scope.promoCode.valid) {
                /* Only apply existing promoCode to current subscription */
                /* If no existing promoCode, only apply to new subscriptions */
                if ((plan.promoCode && type ==='current') ||
                    !plan.promoCode && type ==='new') {
                    if ($scope.promoCode.amount_off) {
                        return _calculateDiscounted(total, $scope.promoCode.amount_off, 'amount_off');
                    } else {
                        return _calculateDiscounted(total, $scope.promoCode.percent_off, 'percent_off');
                    }
                }

            }
            return total;
        };

        $scope.newPlanTotal = function(packageName, seatChoice) {
            return _calculateTotal(packageName,seatChoice);
        };

        $scope.currentPlanTotal = function(packageName, seatChoice) {
            return _calculateTotal(packageName, seatChoice);
        };

        $scope.calculateProrated = function(packageName, seatChoice, originalName, originalSeat) {
            var prorateMultiplier = _calculateProrateQuotient();
            var total = parseInt(($scope.newPlanTotal(packageName, seatChoice, 'new')));
            var originalTotal = parseInt($scope.currentPlanTotal(originalName, originalSeat, 'current'));
            var proratedTotal = (total - originalTotal) * prorateMultiplier;
            $scope.status.proratedTotal = proratedTotal;
            return proratedTotal.toFixed(2);
        };

        $scope.applyPromoCode = function (promoCode) {
            UtilService.submitFormRequest($scope.requestPromo, function () {
                return LicenseService.stripeRequestPromo(promoCode);
            }, function (response) {

                // Set default discounts to 0, since we can simply apply both
                $scope.promoCode.amount_off = 0;
                $scope.promoCode.percent_off = 0;

                // Check for the actual amount and percentage off
                if (response.data.amount_off) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.amount_off = response.data.amount_off / 100;
                    $scope.requestPromo.successes.push('$' + $scope.promoCode.amount_off + ' discount applied');
                }
                else if (response.data.percent_off) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.percent_off = response.data.percent_off;
                    $scope.requestPromo.successes.push(response.data.percent_off + '% discount applied');
                }
            }, function () {
                if (plan.promoCode) {
                    $state.go('modal.error-processing-upgrade');
                }
            });
        };

        if (plan.promoCode) {
            $scope.applyPromoCode(plan.promoCode);
            /* Apply existing promoCode discount to currentPlan, instead of just calculating the total */
            $scope.currentPlanTotal = $scope.calculateDiscountedTotal;
        }

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

