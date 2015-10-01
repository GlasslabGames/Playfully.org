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
                return LicenseService.getPackages({salesRep: true});
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
    })
    .state('admin.developer-approval', {
        url: '/developer-approval',
        templateUrl: 'admin/admin-developer-approval.html',
        controller: 'AdminDeveloperApprovalCtrl',
        resolve: {
            developers: function (UserService) {
                return UserService.getAllDevelopers();
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    });

})
.controller('AdminResellerCtrl', function ($scope, $state, $stateParams, $rootScope, $window, AUTH_EVENTS, packages, LicenseService, UtilService, UserService, LicenseStore, REGISTER_CONSTANTS, STRIPE, ENV) {
        // Setup Seats and Package choices
        var selectedPackage = _.find(packages.plans, {name: $stateParams.packageType}) || packages.plans[0];
        var packagesChoices = _.map(packages.plans, 'name');

        $scope.status = {
            isPaymentCreditCard: false,
            packageName: selectedPackage.name,
            selectedPackage: selectedPackage,
            studentSeats: $stateParams.seatsSelected || 5,
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

        $scope.requestPurchaseOrder = function (studentSeats,packageName, info) {
            var targetSeat = _.find($scope.choices.seats, {studentSeats: parseInt(studentSeats)});
            var targetPlan = _.find(packages.plans, {name: packageName});
            var planInfo = {seats: targetSeat.seatId, type: targetPlan.planId};
            if ($scope.promoCode.valid) {
                planInfo.promoCode = $scope.promoCode.code;
            }
            var purchaseOrder = info.PO;
            /* Convert to database expected values */
            console.log(typeof(purchaseOrder.payment));
            purchaseOrder.payment = parseFloat(purchaseOrder.payment);
            purchaseOrder.payment = purchaseOrder.payment.toFixed(2);
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
})

.controller('AdminDeveloperApprovalCtrl', function (developers, $scope, $window, UserService) {

	$scope.pending = developers.pending;
	$scope.approved = developers.approved;

	$scope.predicateApprove = 'date';
    $scope.reverseApprove = false;
    $scope.orderApprove = function(predicate) {
        $scope.reverseApprove = ($scope.predicateApprove === predicate) ? !$scope.reverseApprove : false;
        $scope.predicateApprove = predicate;
    };
      
	$scope.predicateVerified = 'date';
    $scope.reverseVerified = false;
    $scope.orderVerified = function(predicate) {
        $scope.reverseVerified = ($scope.predicateVerified === predicate) ? !$scope.reverseVerified : false;
        $scope.predicateVerified = predicate;
    };
     
    $scope.approveDeveloper = function(developer) {    	
    	var i;
    	for(i = $scope.pending.length; i--;) {
          if($scope.pending[i] === developer) {
              break;
          }
        }
        if (i >= 0) {
		  var doApprove = $window.confirm('Are you sure you want to approve ' + developer.name + '?');
		  if (doApprove) {
			UserService.alterDeveloperStatus(developer.id, "sent")
			.then(function(response) {
				$scope.pending.splice(i, 1);
			}.bind(this),
			function (response) {
				$window.alert(response.message);
			});
		  }
        }
    };
      
    $scope.revokeDeveloper = function(developer) {
    	var i;
    	for(i = $scope.approved.length; i--;) {
          if($scope.approved[i] === developer) {
              break;
          }
        }
        if (i >= 0) {
		  var doRevoke = $window.confirm('Are you sure you want to revoke ' + developer.name + '?');
		  if (doRevoke) {
			UserService.alterDeveloperStatus(developer.id, "revoked")
			.then(function(response) {
				$scope.approved.splice(i, 1);
			}.bind(this),
			function (response) {
				$window.alert(response.message);
			});
		  }
        }
   };
});