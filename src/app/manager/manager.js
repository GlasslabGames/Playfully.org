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
                },
                plan: function (LicenseService) {
                    return LicenseService.getCurrentPlan();
                },
                packages: function (LicenseService) {
                    return LicenseService.getPackages();
                },
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
                purchaseOrderInfo: function (LicenseService) {
                    return LicenseService.getPurchaseOrderInfo();
                }
            },
            controller: function ($scope, $state, purchaseOrderInfo) {
                $scope.$parent.currentTab = $state.current.url;
                $scope.info = purchaseOrderInfo;
            },
            data: {
                authorizedRoles: ['License-Owner-PO']
            }
        })
        .state('root.manager.billing-info', {
            url: '/billing-info',
            templateUrl: 'manager/manager-billing-info.html',
            controller: 'ManagerBillingInfoCtrl',
            resolve: {
                billingInfo: function (LicenseService) {
                    return LicenseService.getBillingInfo();
                }
            },
            data: {
                authorizedRoles: ['License-Owner-CC']
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
                    controller: function ($scope, $state, $previousState, plan) {
                        $scope.goToLink = function (link) {
                            $previousState.forget('modalInvoker');
                            $state.go(link);
                        };
                        $scope.plan = plan;
                        $scope.package = $scope.plan.packageDetails;
                    }
                }
            },
            data: {
                reloadNextState: 'reload'
            }
        })
        .state('modal-lg.prorating-information', {
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
                            }, function() {});
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
                        $scope.ownerName = $stateParams.ownerName;
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.leaveSubscription = function () {
                            UtilService.submitFormRequest($scope.request, function () {
                                return LicenseService.leaveCurrentPlan();
                            }, function () {
                                $previousState.forget('modalInvoker');
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
                    controller: function ($scope, $state, $log, $stateParams, $window, $rootScope, LicenseService, UserService, UtilService, $previousState) {
                        $scope.acceptedTerms = false;
                        $scope.request = {
                            success: false,
                            errors: []
                        };
                        $scope.goToState = function (state) {
                            $previousState.forget('modalInvoker');
                            $state.go(state);
                        };
                        $scope.startTrial = function () {
                            UtilService.submitFormRequest($scope.request, function () {
                                return LicenseService.startTrial();
                            }, function () {
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
                    controller: function ($scope, $state, $previousState) {
                        $scope.goToState = function (state) {
                            $previousState.forget('modalInvoker');
                            $state.go(state);
                        };
                    }
                }
            }
        })
        .state('modal.confirm-update-modal', {
            url: '/manager/confirm-update?:isPaymentCreditCard?:isTrial',
            data: {
                pageTitle: 'Confirm Update'
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/confirm-update-modal.html',
                    controller: function ($scope, $log, $state, $stateParams, $previousState, LicenseStore, UtilService, LicenseService, UserService) {
                        $scope.request = {
                            success: false,
                            errors: [],
                            isSubmitting: false
                        };
                        $scope.acceptedTerms = false;
                        $scope.isTrial = $stateParams.isTrial==='true';
                        $scope.isPaymentCreditCard = $stateParams.isPaymentCreditCard==='true';
                        $scope.purchaseInfo = LicenseStore.getData();
                        $scope.goToState = function (state) {
                            $previousState.forget('modalInvoker');
                            $state.go(state);
                        };
                        $scope.submitPayment = function () {
                            UtilService.submitFormRequest($scope.request, function () {
                                if ($scope.isPaymentCreditCard) {
                                    if ($scope.isTrial) {
                                        return LicenseService.upgradeFromTrial($scope.purchaseInfo);
                                    } else {
                                        return LicenseService.upgradeLicense($scope.purchaseInfo);
                                    }
                                } else {
                                    return LicenseService.upgradeFromTrialwithPurchaseOrder($scope.purchaseInfo);
                                }
                            }, function () {
                                LicenseStore.reset();
                                UserService.updateUserSession();
                            });
                        };
                    }
                }
            }
        });
    })
    .controller('ManagerCtrl', function ($scope,$state) {
        $scope.currentTab = $state.current.url;
    })
    .controller('ManagerBillingInfoCtrl', function ($scope, $state, billingInfo, REGISTER_CONSTANTS, LicenseService, UtilService, STRIPE, ENV) {
        $scope.$parent.currentTab = $state.current.url;
        $scope.billingInfo = {};
        $scope.billingInfo = angular.copy(billingInfo);
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
            CC: angular.copy(REGISTER_CONSTANTS.ccInfo)
        };
        $scope.changeCard = function(info) {
            LicenseService.stripeValidation(info.CC, $scope.request);
            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey( STRIPE[ ENV.stripe ].publishableKey );
                Stripe.card.createToken(info.CC, function (status, stripeToken) {
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
                $scope.resetForm();
            });
        };
        $scope.resetForm = function() {
            $scope.info = { CC: angular.copy(REGISTER_CONSTANTS.ccInfo) };
        };
    })
    .controller('ManagerStudentListCtrl', function ($scope,$state, studentList, plan) {
        $scope.$parent.currentTab = $state.current.url;

        $scope.studentList = studentList;
        $scope.noEnrollment = (plan.packageDetails.studentSeats === plan.studentSeatsRemaining);
                
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
    .controller('ManagerUpgradeCtrl', function ($scope, $state, $stateParams, LicenseService, LicenseStore, UserService, UtilService, plan, packages, billingInfo, REGISTER_CONSTANTS, STRIPE, ENV) {

        // Current Plan Info
        $scope.$parent.currentTab = '/plan';

        $scope.plan = angular.copy(plan);
        $scope.packages = angular.copy(packages);
        $scope.plan.expirationDate = moment($scope.plan.expirationDate).format("MMM Do YYYY");
        $scope.originalPackage = $scope.plan.packageDetails;
        $scope.billingInfo = angular.copy(billingInfo);
        $scope.billingInfo.accountBalance = Math.abs( $scope.billingInfo.accountBalance / 100 );
        $scope.isLegacyUser = $scope.plan.packageDetails.planId === 'trialLegacy';

        if ($scope.plan.packageDetails.name === 'Trial') {
            var allGames = _.find($scope.packages.plans, {name: 'All Games'});
            allGames.studentSeats = $scope.plan.packageDetails.studentSeats;
            allGames.educatorSeats = $scope.plan.packageDetails.educatorSeats;
            $scope.originalPackage = allGames;
        }

        // Setup Seat and Package Choices
        var selectedPackage = $scope.originalPackage;
        var packagesChoices = _.map($scope.packages.plans, 'name');

        $scope.status = {
          packageName: selectedPackage.name,
          selectedPackage: selectedPackage,
          studentSeats: $stateParams.seatsSelected || $scope.originalPackage.studentSeats,
          isPaymentCreditCard: true,
          currentCard: 'current'
        };

        if ($scope.plan.packageDetails.name === 'Trial') {
            $scope.status.currentCard = 'change';
            $scope.status.isPaymentCreditCard = false;
        }

        $scope.choices = {
            packages: packagesChoices,
            seats: packages.seats,
            states: angular.copy(REGISTER_CONSTANTS.states),
            cardTypes: angular.copy(REGISTER_CONSTANTS.cardTypes)
        };

        $scope.$watch('status.packageName', function (packageName) {
            $scope.status.selectedPackage = _.find($scope.packages.plans, {name: packageName});
        });

        // Request

        $scope.promoCode = {
            code: null,
            valid: false,
            amount_off: 0,
            percent_off: 0,
            existing: false
        };

        $scope.requestPromo = {
            success: false,
            errors: [],
            successes: [],
            isSubmitting: false
        };
        $scope.request = {
            success: false,
            errors: [],
            successes: []
        };

        $scope.info = {
            school: angular.copy(REGISTER_CONSTANTS.school),
            subscription: {},
            CC: angular.copy(REGISTER_CONSTANTS.ccInfo),
            PO: angular.copy(REGISTER_CONSTANTS.poInfo)
        };

        $scope.submitPayment = function (studentSeats, packageName, info, test) {
            // stripe request

            if ($scope.status.isPaymentCreditCard) {
                if (test) {
                    Stripe.setPublishableKey(STRIPE[ENV.stripe].publishableKey);
                    Stripe.card.createToken({
                        name: 'charles',
                        number: 4242424242424242,
                        exp_month: 1,
                        exp_year: 2020,
                        cvc: 123
                    }, function (status, stripeToken) {
                        _upgradeLicense(studentSeats, packageName, stripeToken, info);
                    });
                    return;
                }
                if ($scope.status.currentCard === 'current') {
                    return _upgradeLicense(studentSeats, packageName, {}, info);
                }
                /* Check for errors in Credit Card Info */
                LicenseService.stripeValidation(info.CC, $scope.request);
                if ($scope.request.errors < 1) {
                    Stripe.setPublishableKey(STRIPE[ENV.stripe].publishableKey);
                    Stripe.card.createToken(info.CC, function (status, stripeToken) {
                        _upgradeLicense(studentSeats, packageName, stripeToken, info);
                    });
                }
            } else {
                /* Upgrade License using Purchase Order */
                _upgradeLicense(studentSeats, packageName, null, info);
            }
        };

        var _upgradeLicense = function (studentSeats, packageName, stripeInfo, info) {

            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find($scope.packages.plans, {name: packageName});
            var planInfo = {type: targetPlan.planId, seats: targetSeat.seatId};

             if ($scope.promoCode.valid) {
                if (stripeInfo) {
                    stripeInfo.coupon = $scope.promoCode.code;
                }
                planInfo.promoCode = $scope.promoCode.code;
            }

            if ($scope.status.isPaymentCreditCard) {
                /* Upgrade from Trial using Credit Card */
                if ($scope.plan.packageDetails.name === 'Trial') {
                    LicenseStore.setData({
                        planInfo: planInfo,
                        stripeInfo: stripeInfo,
                        schoolInfo: info.school,
                        payment: parseFloat($scope.status.grandTotal)
                    });
                    return $state.go('modal.confirm-update-modal', {isTrial: true, isPaymentCreditCard: true});
                } else {
                    /* Upgrade from License using Credit Card */
                    LicenseStore.setData({
                        planInfo: planInfo,
                        stripeInfo: stripeInfo,
                        schoolInfo: info.school,
                        payment: parseFloat($scope.status.grandTotal)
                    });
                    $state.go('modal.confirm-update-modal', {isTrial: false, isPaymentCreditCard: true});
                }
            } else {
                LicenseStore.setData({
                    planInfo: planInfo,
                    schoolInfo: info.school,
                    purchaseOrderInfo: info.PO,
                    payment: parseFloat($scope.status.discountedTotal)
                });
                /* Upgrade from Trial using Purchase Order */
                if ($scope.plan.packageDetails.name === 'Trial') {
                    $state.go('modal.confirm-update-modal', {isTrial: true, isPaymentCreditCard: false});
                }
            }

        };

        var _calculateProrateQuotient = function() {
            // Calculate prorating using stripe's start/end times, against current utc
            // Stripe's start/end are without ms, so we need to divide by 1000 on current
            var periodStart = $scope.billingInfo.currentPeriodStart;
            var periodEnd = $scope.billingInfo.currentPeriodEnd;
            var periodCurrent = moment.utc() / 1000;
            // The final quotient
            return ( periodEnd - periodCurrent ) / ( periodEnd - periodStart );
        };
        var _calculateTotal = function (packageName, seatChoice) {
            var targetSeatTier = _.find($scope.choices.seats, {studentSeats: parseInt(seatChoice)});
            var targetPackage = _.find(packages.plans, {name: packageName});
            var total = seatChoice * (targetPackage.pricePerSeat || 0);
            total = total - (total * (targetSeatTier.discount / 100));
            /* Changes output from number to string type and fixed to the 10ths digit */
            return total.toFixed(2);
        };

        // Helper function for calulating discount on particular plan
        var _planDiscount = function(total) {
            if( $scope.promoCode.valid ) {
                if( $scope.promoCode.amount_off ) {
                    return $scope.promoCode.amount_off;
                }
                else {
                    return total * ($scope.promoCode.percent_off / 100);
                }
            }
            return 0;
        };

        // Promotional Discount info located here
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
                $scope.formattedPromoDiscount = $scope.promoDiscount.toFixed(2);
            }
            return discountedTotal.toFixed(2);
        };

        // Used for current plan if promo code
        // Used for subtotal if trial
        $scope.calculateDiscountedTotal = function (packageName, seatChoice, type) {
            var total = _calculateTotal(packageName, seatChoice);
            var discountedTotal;
            if ($scope.promoCode.valid) {
                /* If promoCode previously existed in user's account, only apply to current subscription */
                /* If no previously existing promoCode in user's account, only apply to new subscriptions */
                if (($scope.promoCode.existing && type ==='current') ||
                    !$scope.promoCode.existing && type ==='new') {
                    if ($scope.promoCode.amount_off) {
                        discountedTotal = _calculateDiscounted(total, $scope.promoCode.amount_off, 'amount_off');
                        $scope.status.discountedTotal = discountedTotal;
                        return discountedTotal;
                    } else {
                        discountedTotal = _calculateDiscounted(total, $scope.promoCode.percent_off, 'percent_off');
                        $scope.status.discountedTotal = discountedTotal;
                        return discountedTotal;
                    }
                }
            }
            $scope.status.discountedTotal = total;
            return total;
        };

        // Used for new plan
        $scope.newPlanTotal = function(packageName, seatChoice) {
            if( $scope.plan.promoCode ) {
                $scope.calculateDiscountedTotal(packageName, seatChoice, 'current');
            }
            
            return _calculateTotal(packageName,seatChoice);
        };

        // Used for current plan if no promo code
        $scope.currentPlanTotal = function(packageName, seatChoice) {
            return _calculateTotal(packageName, seatChoice);
        };

        // Used for subtotal if not trial
        $scope.calculateProrated = function(packageName, seatChoice, originalName, originalSeat) {
            var prorateMultiplier = _calculateProrateQuotient();
            var total = parseInt(($scope.newPlanTotal(packageName, seatChoice, 'new')));
            total -= _planDiscount( total );
            var originalTotal = parseInt($scope.currentPlanTotal(originalName, originalSeat, 'current'));
            if( $scope.promoCode.existing ) {
                originalTotal -= _planDiscount( originalTotal );
            }
            var proratedTotal = (total - originalTotal) * prorateMultiplier;
            $scope.status.proratedTotal = proratedTotal;
            if( proratedTotal < 0 ) {
                return "-$" + Math.abs(proratedTotal).toFixed(2);
            }
            return "$" + proratedTotal.toFixed(2);
        };

        // Used for Credit (account balance)
        $scope.creditBalance = function() {
            return $scope.billingInfo.accountBalance.toFixed(2);
        };

        // Used for Total without trial
        // TODO
        $scope.calculateGrandTotalWithTrial = function() {
            var grandTotal =  $scope.calculateDiscountedTotal($scope.status.packageName, $scope.status.studentSeats, 'new') - $scope.billingInfo.accountBalance;
            $scope.status.grandTotal = grandTotal;
            if( grandTotal < 0 ) {
                $scope.status.showCredit = true;
                return "-$" + Math.abs(grandTotal).toFixed(2);
            }
            $scope.status.showCredit = false;
            return "$" + grandTotal.toFixed(2);
        };

        // Used for Total with trial
        $scope.calculateGrandTotal = function() {
            var grandTotal = $scope.status.proratedTotal - $scope.billingInfo.accountBalance;
            $scope.status.grandTotal = grandTotal;
            if( grandTotal < 0 ) {
                $scope.status.showCredit = true;
                return "-$" + Math.abs(grandTotal).toFixed(2);
            }
            $scope.status.showCredit = false;
            return "$" + grandTotal.toFixed(2);
        };

        $scope.applyPromoCode = function (promoCode, acceptInvalid) {
            UtilService.submitFormRequest($scope.requestPromo, function () {
                return LicenseService.stripeRequestPromo(promoCode, acceptInvalid);
            }, function (response) {

                // Set default discounts to 0, since we can simply apply both
                $scope.promoCode.amount_off = 0;
                $scope.promoCode.percent_off = 0;

                // Check for the actual amount and percentage off
                if (response.data.amount_off) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.amount_off = response.data.amount_off / 100;
                    $scope.requestPromo.successes.push('$' + $scope.promoCode.amount_off + ' discount applied');
                    _calculateDiscounted($scope.newPlanTotal($scope.status.packageName, $scope.status.studentSeats), $scope.promoCode.amount_off, 'amount_off');
                }
                else if (response.data.percent_off) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.percent_off = response.data.percent_off;
                    $scope.requestPromo.successes.push(response.data.percent_off + '% discount applied');
                    _calculateDiscounted($scope.newPlanTotal($scope.status.packageName, $scope.status.studentSeats), $scope.promoCode.percent_off, 'percent_off');
                }
            }, function () {
                $state.go('modal.error-processing-upgrade');
            });
        };

        if ($scope.plan.promoCode) {
            /* Apply existing promoCode discount */
            $scope.promoCode.existing = true;
            /* API will accept invalid coupons and return a response */
            $scope.applyPromoCode($scope.plan.promoCode, {acceptInvalid: true });
        }
    })
    .controller('ManagerPlanCtrl', function ($scope,$state, $q, plan, LicenseService, UtilService, EMAIL_VALIDATION_PATTERN) {

        $scope.$parent.currentTab = $state.current.url;
        $scope.plan = plan;
        $scope.plan.expirationDate = moment(plan.expirationDate).format("MMM Do YYYY");
        $scope.package = plan.packageDetails;
        $scope.isLegacyUser = plan.packageDetails.planId === 'trialLegacy';
        $scope.canUpgrade = plan.canUpgrade;

        if (plan.nextUpgrade) {
            $scope.nextUpgrade = moment(plan.nextUpgrade).format("MMM Do YYYY");
        }

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
                $scope.request.invitedEducators = '';
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

