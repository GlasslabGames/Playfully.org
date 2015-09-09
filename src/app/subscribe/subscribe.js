angular.module('playfully.subscribe', ['subscribe.const','register.const'])

    .config(function ($urlMatcherFactoryProvider, $stateProvider) {

        $stateProvider.state('root.subscribe', {
            abstract: true,
            url: 'subscribe'
        })
            .state('root.subscribe.payment', {
                url: '/payment',
                views: {
                    'main@': {
                        templateUrl: 'subscribe/subscribe.html'
                    }
                },
                templateUrl: 'subscribe/subscribe.html',
                abstract: true
            })
            .state('root.subscribe.payment.default', {
                url: '?packageType?seatsSelected',
                templateUrl: 'subscribe/subscribe-payment.html',
                resolve: {
                    packages: function (LicenseService) {
                        return LicenseService.getPackages();
                    }
                },
                controller: 'SubscribePaymentCtrl',
                data: {
                    authorizedRoles: [
                        'instructor'
                    ],
                    redirects: [
                        {
                            state: 'root.subscribe.payment.purchase-order-status',
                            licenses: ['po-pending'],
                            roles: ['instructor']
                        },
                        {
                            state: 'root.manager.plan',
                            licenses: ['premium', 'po-received'],
                            roles: ['instructor']
                        }
                    ],
                    ssl: true
                }
            })
            .state('modal.cancel-purchase-order', {
                url: 'subscribe/payment/cancel-purchase-order',
                views: {
                    'modal@': {
                        templateUrl: 'subscribe/cancel-purchase-order-modal.html',
                        controller: function ($scope, $state, LicenseService, UtilService, UserService, $previousState) {
                            $scope.request = {
                                successes: [],
                                errors: [],
                                submitting: false
                            };
                            $scope.goToState = function(state) {
                                $previousState.forget('modalInvoker');
                                $state.go(state);
                            };
                            $scope.cancelPurchaseOrder = function () {
                                UtilService.submitFormRequest($scope.request, function () {
                                    return LicenseService.cancelActivePurchaseOrder();
                                }, function() {
                                    return UserService.updateUserSession();
                               });
                            };
                        }
                    }
                },
                data: {
                    authorizedRoles: [
                        'instructor'
                    ],
                    ssl: true
                }
            })
            .state('root.subscribe.payment.purchase-order-status', {
                url: '/purchase-order-status',
                templateUrl: 'subscribe/purchase-order-status.html',
                resolve: {
                  purchaseOrderInfo: function(LicenseService) {
                      return LicenseService.getPurchaseOrderInfo();
                  }
                },
                controller: function($scope, purchaseOrderInfo) {
                    $scope.info = purchaseOrderInfo;
                },
                data: {
                    authorizedRoles: [
                        'instructor'
                    ],
                    ssl: true
                }
            })
            .state('modal.notify-po-status', {
                url: '/purchase-order-notify-status?:purchaseOrderStatus',
                data: {
                    pageTitle: 'Purchase Order Status',
                    reloadNextState: true
                },
                views: {
                    'modal@': {
                        templateUrl: 'subscribe/notify-po-status-modal.html',
                        controller: function ($scope, $log, $stateParams, $previousState) {
                            $previousState.forget('modalInvoker');
                            $scope.purchaseOrderStatus = $stateParams.purchaseOrderStatus;
                        }
                    }
                }
            })
            .state('modal-xlg.subscribe-video', {
                url: '/subscribe-video',
                data: {
                    pageTitle: 'Subscribe Video',
                    reloadNextState: true
                },
                views: {
                    'modal@': {
                        templateUrl: 'subscribe/subscribe-video-modal.html'
                    }
                }
            })
           .state('modal.confirm-subscribe-cc-modal', {
                url: '/subscribe/confirm-subscribe',
                data: {
                    pageTitle: 'Confirm Subscribe'
                },
                views: {
                    'modal@': {
                        templateUrl: 'subscribe/confirm-subscribe-cc-modal.html',
                        controller: function ($scope, $log, $stateParams, $previousState, LicenseStore, UtilService, LicenseService, UserService) {
                            $scope.request = {
                                success: false,
                                errors: [],
                                isSubmitting: false
                            };
                            $scope.acceptedTerms = false;
                            $scope.purchaseInfo = LicenseStore.getData();
                            $scope.submitPayment = function () {
                                UtilService.submitFormRequest($scope.request, function () {
                                    return LicenseService.subscribeToLicense($scope.purchaseInfo);
                                }, function () {
                                    UserService.updateUserSession();
                                    $previousState.forget('modalInvoker');
                                    LicenseStore.reset();
                                });
                            };
                        }
                    }
                }
            })
            .state('modal.confirm-purchase-order-modal', {
                url: '/subscribe/confirm-purchase-order',
                data: {
                    pageTitle: 'Confirm Purchase Order'
                },
                views: {
                    'modal@': {
                        templateUrl: 'subscribe/confirm-purchase-order-modal.html',
                        controller: function ($scope, $log, $stateParams, $previousState, LicenseStore, UtilService, LicenseService, UserService) {
                            $scope.request = {
                                success: false,
                                errors: [],
                                isSubmitting: false
                            };
                            $scope.acceptedTerms = false;
                            $scope.purchaseInfo = LicenseStore.getData();
                            $scope.submitPayment = function () {
                                UtilService.submitFormRequest($scope.request, function () {
                                    return LicenseService.subscribeWithPurchaseOrder($scope.purchaseInfo);
                                }, function () {
                                    $previousState.forget('modalInvoker');
                                    LicenseStore.reset();
                                    UserService.updateUserSession();
                                });
                            };
                        }
                    }
                }
            })
            .state('root.subscribe.packages', {
                url: '/packages',
                resolve: {
                    packages: function (LicenseService) {
                        return LicenseService.getPackages();
                    }
                } ,
                views: {
                    'main@': {
                        templateUrl: 'subscribe/packages.html',
                        controller: 'SubscribePackagesCtrl'
                    }
                },
                data: {
                    // This works only because the ultimate redirect an unauthorized
                    // a student is /courses (GLAS-129)
                    unauthorizedRoles: [
                       'student'
                    ],
                    redirects: [
                        {
                            state: 'root.subscribe.payment.purchase-order-status',
                            licenses: ['po-pending'],
                            roles: ['instructor']
                        },
                        {
                            state: 'root.manager.plan',
                            licenses: ['premium', 'po-received'],
                            roles: ['instructor']
                        }
                    ]
                }
            });

        // Prevent forward slashes in url params from being URL-encoded twice - http://stackoverflow.com/a/29169510
        function valToString(val) {
            return val != null ? val.toString() : val;
        }
        function regexpMatches(val) {
            return this.pattern.test(val);
        }
        $urlMatcherFactoryProvider.type("string", {
            encode: valToString,
            decode: valToString,
            is: regexpMatches,
            pattern: /[^/]*/
        });
    })
    .controller('SubscribePaymentCtrl', function ($scope, $state, $stateParams, $rootScope, $window, AUTH_EVENTS, packages, LicenseService, UtilService, UserService, LicenseStore, REGISTER_CONSTANTS, STRIPE, ENV) {
        // Setup Seats and Package choices
        var selectedPackage = _.find(packages.plans, {name: $stateParams.packageType}) || packages.plans;
        var packagesChoices = _.map(packages.plans, 'name');

        $scope.packageId = { 'All Games': '1', 'iPad': '2', 'Chromebook/Web': '3', 'PC/MAC': '4' };
                
        $scope.status = {
            isPaymentCreditCard: false,
            packageName: selectedPackage.name,
            selectedPackage: selectedPackage,
            studentSeats: $stateParams.seatsSelected || 10,
            totalPrice: null
        };

        $scope.promoCode = {
            code: null,
            valid: false,
            amount_off: 0,
            percent_off: 0
        };

        $scope.choices = {
            packages: packagesChoices,
            seats: packages.seats,
            states: angular.copy(REGISTER_CONSTANTS.states),
            cardTypes: angular.copy(REGISTER_CONSTANTS.cardTypes)
        };

        $scope.$watch('status.packageName', function (packageName) {
            $scope.status.selectedPackage = _.find(packages.plans, {name: packageName});
        });

        // School and Payment Info
        $scope.info = {
            school: angular.copy(REGISTER_CONSTANTS.school),
            subscription: {},
            CC: angular.copy(REGISTER_CONSTANTS.ccInfo),
            PO: angular.copy(REGISTER_CONSTANTS.poInfo)
        };

        $scope.request = {
            success: false,
            errors: [],
            isSubmitting: false
        };

        $scope.requestPromo = {
            success: false,
            errors: [],
            successes: [],
            isSubmitting: false
        };

        $scope.applyPromoCode = function () {
            UtilService.submitFormRequest($scope.requestPromo, function () {
                return LicenseService.stripeRequestPromo($scope.promoCode.code);
            }, function (response) {

                // Set default discounts to 0, since we can simply apply both
                $scope.promoCode.amount_off = 0;
                $scope.promoCode.percent_off = 0;

                // Check for the actual amount and percentage off
                if( response.data.amount_off ) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.amount_off = (response.data.amount_off/100).toFixed(2);
                    $scope.requestPromo.successes.push('$' + $scope.promoCode.amount_off + ' discount applied');
                }
                else if( response.data.percent_off ) {
                    $scope.promoCode.valid = true;
                    $scope.promoCode.percent_off = response.data.percent_off;
                    $scope.requestPromo.successes.push(response.data.percent_off + '% discount applied');
                }
            });
        };

        $scope.calculateTotal = function (price, seatChoice) {
            var targetSeatTier = _.find($scope.choices.seats, {studentSeats: parseInt(seatChoice)});
            var result = {total: seatChoice * price};

            result.total = result.total - (result.total * (targetSeatTier.discount / 100));

            // apply a promo code if it's valid
            if( $scope.promoCode.valid ) {
                var discountedTotal = result.total - ($scope.promoCode.amount_off);
                discountedTotal = discountedTotal - (discountedTotal * ($scope.promoCode.percent_off / 100));
                result.discountedTotal = discountedTotal.toFixed(2);
            }
            result.total = result.total.toFixed(2);
            $scope.info.PO.payment = result.discountedTotal || result.total;
            $scope.info.PO.payment = parseFloat($scope.info.PO.payment);
            $scope.info.CC.payment = result.discountedTotal || result.total;
            $scope.info.CC.payment = parseFloat($scope.info.CC.payment);
            // Return the final and discounted total
            return result;
        };
        $scope.requestPurchaseOrder = function (studentSeats,packageName, info) {
            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});
            var planInfo = {seats: targetSeat.seatId, type: targetPlan.planId};
            if ($scope.promoCode.valid) {
                planInfo.promoCode = $scope.promoCode.code;
            }
            var purchaseOrder = info.PO;
            /* Convert to database expected values */
            purchaseOrder.payment = parseFloat(purchaseOrder.payment);
            purchaseOrder.name = purchaseOrder.firstName + ' ' + purchaseOrder.lastName;
            LicenseStore.setData({
                purchaseOrderInfo: purchaseOrder,
                planInfo: planInfo,
                schoolInfo: info.school,
                payment: $scope.info.PO.payment
            });
            $state.go('modal.confirm-purchase-order-modal');
        };
        $scope.submitPayment = function (studentSeats, packageName, info, test) {
            if (test) {
                if ($scope.request.errors < 1) {
                    Stripe.setPublishableKey( STRIPE[ ENV.stripe ].publishableKey );
                    Stripe.card.createToken({
                        name: 'charles',
                        number: 4242424242424242,
                        exp_month: 1,
                        exp_year: 2020,
                        cvc: 123
                    }, function (status, stripeToken) {
                        _subscribeToLicense(studentSeats, packageName, stripeToken, info);
                    });
                }
                return;
            }

            LicenseService.stripeValidation(info.CC, $scope.request);

            if ($scope.request.errors < 1) {
                Stripe.setPublishableKey( STRIPE[ ENV.stripe ].publishableKey );
                Stripe.card.createToken(info.CC, function (status, stripeToken) {
                    _subscribeToLicense(studentSeats, packageName, stripeToken, info);
                });
            }
        };
                
        $scope.impression = function(packageName, seatChoice) {
            var seatChoiceAsId  = seatChoice >= 100 ? seatChoice : "0" + seatChoice;
            $window.ga('ec:addImpression', {
                       'id': 'P' + $scope.packageId[packageName] + seatChoiceAsId,
                       'name': packageName,
                       'category': 'subscription',
                       'brand': 'Glasslab Games',
                       'variant': seatChoice + " seats",
                       'list': 'purchase view',
                    });
        };

        var _subscribeToLicense = function (studentSeats, packageName, stripeInfo, info) {

            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});

            // Attach the promo code as a "coupon" to stripeInfo if it is valid
            if( $scope.promoCode.valid && stripeInfo) {
                stripeInfo.coupon = $scope.promoCode.code;
            }
            LicenseStore.setData({
                planInfo: {type: targetPlan.planId, seats: targetSeat.seatId, promoCode: stripeInfo.coupon},
                stripeInfo: stripeInfo,
                schoolInfo: info.school,
                payment: $scope.info.CC.payment || $scope.info.PO.payment
            });
            $state.go('modal.confirm-subscribe-cc-modal');
        };
    })
    .controller('SubscribePackagesCtrl', function ($scope, $window, packages) {
        $scope.seatChoices = [];
        $scope.packageChoices = packages.plans;
                
        $scope.packageId = { 'All Games': '1', 'iPad': '2', 'Chromebook/Web': '3', 'PC/MAC': '4' };
                
        angular.forEach(packages.seats, function (pack) {
            $scope.seatChoices.push(pack.studentSeats);
        });

        angular.forEach($scope.packageChoices, function(pack) {
           pack.seatsSelected = $scope.seatChoices[0];
        });

        $scope.calculateTotal = function(price,seatChoice) {
            var targetPackage = _.find(packages.seats, {studentSeats: seatChoice});
            var total = seatChoice * price;
            return total - (total* (targetPackage.discount/100));
        };
                
        $scope.impressionPackage = function(packageName, seatChoice) {
            var seatChoiceAsId  = seatChoice >= 100 ? seatChoice : "0" + seatChoice;
            $window.ga('ec:addImpression', {
               'id': 'P' + $scope.packageId[packageName] + seatChoiceAsId,
               'name': packageName,
               'category': 'subscription',
               'brand': 'Glasslab Games',
               'variant': seatChoice + " seats",
               'list': 'subcription view',
            });
        };
                
        $scope.impressionTryItOut = function(role) {
                console.log(role);
            $window.ga('ec:addImpression', {
                       'id': 'T3030',
                       'name': 'Trial',
                       'category': 'subscription',
                       'brand': 'Glasslab Games',
                       'variant': role,
                       'list': 'subcription view',
            });
        };
    });