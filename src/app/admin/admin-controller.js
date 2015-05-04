angular.module('playfully.admin', ['dash','license'])

.config(function($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        abstract: true,
        views: {
            'main@': {
                templateUrl: 'admin/admin.html'
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.message-center', {
        url: '/message-center',
        templateUrl: 'admin/admin-message-center.html',
        controller: 'AdminMessageCenterCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.reseller-subscribe', {
        url: '/reseller-subscribe',
        templateUrl: 'admin/admin-reseller-subscribe.html',
        controller: 'AdminResellerCtrl',
        resolve: {
            packages: function (LicenseService) {
                return LicenseService.getPackages();
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('modal.reseller-confirm-purchase-order-modal', {
        url: '/admin/reseller-confirm-purchase-order',
        data: {
            pageTitle: 'Confirm Purchase Order',
            authorizedRoles: ['admin']
        },
        views: {
            'modal@': {
                templateUrl: 'admin/reseller-confirm-purchase-order-modal.html',
                controller: function ($scope, $log, $stateParams, $previousState, LicenseStore, UtilService, LicenseService, UserService) {
                    $scope.request = {
                        success: false,
                        errors: [],
                        isSubmitting: false
                    };
                    $scope.acceptedTerms = false;
                    $scope.purchaseInfo = LicenseStore.getData();
                    $scope.submitResellerPayment = function () {
                        UtilService.submitFormRequest($scope.request, function () {
                            return LicenseService.resellerSubscribeWithPurchaseOrder($scope.purchaseInfo);
                        }, function () {
                            LicenseStore.reset();
                            UserService.updateUserSession();
                        });
                    };
                }
            }
        }
    })
    .state('admin.purchase-orders', {
        url: '/purchase-orders',
        templateUrl: 'admin/admin-purchase-orders.html',
        controller: 'AdminPurchaseOrdersCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    });
})
.controller('AdminResellerCtrl', function ($scope, $state, $stateParams, $rootScope, $window, AUTH_EVENTS, packages, LicenseService, UtilService, UserService, LicenseStore, REGISTER_CONSTANTS, STRIPE, ENV) {
        // Setup Seats and Package choices
        var selectedPackage = _.find(packages.plans, {name: $stateParams.packageType || "Chromebook/Web"});
        var packagesChoices = _.map(packages.plans, 'name');

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
            PO: angular.copy(REGISTER_CONSTANTS.poInfo),
            user: {
                email: ''
            }
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
                payment: $scope.info.PO.payment,
                user: $scope.info.user
            });
            $state.go('modal.reseller-confirm-purchase-order-modal');
        };
        //$scope.submitPayment = function (studentSeats, packageName, info, test) {
        //    if (test) {
        //        if ($scope.request.errors < 1) {
        //            Stripe.setPublishableKey( STRIPE[ ENV.stripe ].publishableKey );
        //            Stripe.card.createToken({
        //                name: 'charles',
        //                number: 4242424242424242,
        //                exp_month: 1,
        //                exp_year: 2020,
        //                cvc: 123
        //            }, function (status, stripeToken) {
        //                _subscribeToLicense(studentSeats, packageName, stripeToken, info);
        //            });
        //        }
        //        return;
        //    }
        //
        //    LicenseService.stripeValidation(info.CC, $scope.request);
        //
        //    if ($scope.request.errors < 1) {
        //        Stripe.setPublishableKey( STRIPE[ ENV.stripe ].publishableKey );
        //        Stripe.card.createToken(info.CC, function (status, stripeToken) {
        //            _subscribeToLicense(studentSeats, packageName, stripeToken, info);
        //        });
        //    }
        //};
        //
        //var _subscribeToLicense = function (studentSeats, packageName, stripeInfo, info) {
        //
        //    var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
        //    var targetPlan = _.find(packages.plans, {name: packageName});
        //
        //    // Attach the promo code as a "coupon" to stripeInfo if it is valid
        //    if( $scope.promoCode.valid && stripeInfo) {
        //        stripeInfo.coupon = $scope.promoCode.code;
        //    }
        //    LicenseStore.setData({
        //        planInfo: {type: targetPlan.planId, seats: targetSeat.seatId, promoCode: stripeInfo.coupon},
        //        stripeInfo: stripeInfo,
        //        schoolInfo: info.school,
        //        payment: $scope.info.CC.payment || $scope.info.PO.payment
        //    });
        //    $state.go('modal.reseller-confirm-subscribe-cc-modal');
        //};
    })
.controller('AdminMessageCenterCtrl', function ($scope, $http, $window, DashService) {

    $scope.mcSubject = "";
    $scope.mcMessage = "";
    $scope.mcIcon = "";
    $scope.mcOutput = "";

    $scope.submitMessage = function() {
        $scope.mcOutput = "Processing...";

        var messageData = {};
        messageData.subject = $scope.mcSubject;
        messageData.message = $scope.mcMessage;
        messageData.icon = $scope.mcIcon;

        DashService.postMessage("message", messageData).then(function(data) {
            $scope.mcOutput = data;
            $scope.mcSubject = "";
            $scope.mcMessage = "";
            $scope.mcIcon = "";
        });
    };
})

.controller('AdminPurchaseOrdersCtrl', function ($scope, $http, $window, LicenseService) {
    $scope.purchaseOrder = {
        key: "",
        number: "",
        amount: ""
    };
    $scope.planInfo = {
        type: "",
        seats: ""
    };
    $scope.action = "";
    $scope.output = "";


    $scope.updatePurchaseOrder = function() {
        LicenseService.updatePurchaseOrder($scope.purchaseOrder, $scope.planInfo, $scope.action).then(function(data) {
            // Update the output
            $scope.output = data;

            // Reset the order
            $scope.purchaseOrder.key = "";
            $scope.purchaseOrder.number = "";
            $scope.purchaseOrder.amount = "";

            // Reset the package
            $scope.planInfo.type = "";
            $scope.planInfo.seats = "";

            // Reset the action
            $scope.action = "";
        });
    };
});