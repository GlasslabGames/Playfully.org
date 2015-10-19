angular.module('playfully.admin', ['dash','data','games','license'])

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
                controller: function ($scope, $log, $stateParams, $previousState, LicenseStore, UtilService, LicenseService, UserService, AuthService) {
                    $scope.request = {
                        success: false,
                        errors: [],
                        isSubmitting: false
                    };
                    $scope.purchaseInfo = LicenseStore.getData();
                    $scope.acceptedTerms = false;

                    $scope.submitResellerPayment = function () {
                        // First, we might have to create the license holder
                        if ( ! $scope.purchaseInfo.licenseOwnerExists ) {
                            UserService.register( $scope.purchaseInfo.account )
                            .then( function(data, status, headers, config) {
                                var user = data.config.data;
                                // TODO: KMY: Confirm - do not think I need Session.create()
                                //Session.create(user.id, user.role, data.loginType);
                                console.log("-----> sucessfully created ", user);
                                $scope.purchaseInfo.user = user;
                                return AuthService.sendPasswordResetLink( $scope.purchaseInfo.account.email );
                            }.bind(this), function(error) {
                                console.log("-----> failed to create ", $scope.purchaseInfo.account);
                                console.log("-----> error ", data.error);
                                if ( data.error ) {
                                    $scope.purchaseInfo.account.errors.push(data.error);
                                } else {
                                    $scope.purchaseInfo.account.errors.push(ERRORS['general']);
                                }

                                // Do not create PO
                                return;
                            }.bind(this) )
                            .then( function(data, status, headers, config) {
                            	console.log("-----> sent password email");

		                        // Submit PO
			                    $scope.request = {
			                        success: false,
			                        errors: [],
			                        isSubmitting: false
			                    };
		                        console.log("submit req ", $scope.request);
		                        UtilService.submitFormRequest($scope.request, function () {
		                        	console.log("success submit now po ", $scope.purchaseInfo);
		                            return LicenseService.resellerSubscribeWithPurchaseOrder($scope.purchaseInfo);
		                        }, function () {
		                            LicenseStore.reset();
		                        });
                            }.bind(this), function(error) {
                            	console.log("-----> failed to send password email ", $scope.purchaseInfo.account.email );
                            }.bind(this) );
                        } else {
	                        // Submit PO
		                    $scope.request = {
		                        success: false,
		                        errors: [],
		                        isSubmitting: false
		                    };
	                        console.log("submit req ", $scope.request);
	                        UtilService.submitFormRequest($scope.request, function () {
	                        	console.log("success submit now po ", $scope.purchaseInfo);
	                            return LicenseService.resellerSubscribeWithPurchaseOrder($scope.purchaseInfo);
	                        }, function () {
	                            LicenseStore.reset();
	                        });
	                    }
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
    })
    .state('admin.report-data-export', {
        url: '/report-data-export',
        templateUrl: 'admin/admin-report-data.html',
        controller: 'AdminReportDataExportCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.one-page', {
        url: '/one-page',
        templateUrl: 'admin/admin-one-page.html',
        controller: 'AdminOnePageCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    });

})
.controller('AdminOnePageCtrl', function ($scope) {

    //     $scope.dataExportForm = function() {
    //         DataService.exportReportData().then(function(data) {
    //         });
    //     };
})
.controller('AdminReportDataExportCtrl', function ($scope, $http, $window, DataService) {
    $scope.rdeTextArea1 = 'press "Get Data" button.';
    $scope.dataExportForm = function() {
        $scope.rdeTextArea1 = "\nProcessing...";
        DataService.exportReportData().then(function(data) {

            if("string" == typeof(data[0])) {
                $scope.rdeTextArea1 = '' + data[0];
            }else{
                $scope.rdeTextArea1 = ' sorry -- no data ';
            }

            if(1 < data.length) {
                if("string" == typeof(data[1])) {
                    $scope.rdeTextArea2 = '' + data[1];
                }else{
                    $scope.rdeTextArea2 = ' sorry -- no data ';
                }
            }

            if(2 < data.length) {
                if("string" == typeof(data[2])) {
                    $scope.rdeTextArea3 = '' + data[2];
                }else{
                    $scope.rdeTextArea3 = ' sorry -- no data ';
                }
            }

            // if(3 < data.length) {
            //     if("string" == typeof(data[3])) {
            //         $scope.rdeTextArea4 = '' + data[3];
            //     }else{
            //         $scope.rdeTextArea4 = ' sorry -- no data ';
            //     }
            // }

        });
    };
})
.controller('AdminResellerCtrl', function ($scope, $state, $stateParams, $rootScope, $window, AUTH_EVENTS, packages, LicenseService, UtilService, UserService, LicenseStore, REGISTER_CONSTANTS, STRIPE, ENV) {
        // Setup Seats and Package choices
        var selectedPackage = _.find(packages.plans, {name: $stateParams.packageType}) || packages.plans[0];
        var packagesChoices = _.map(packages.plans, 'name');

        $scope.status = {
            isPaymentCreditCard: false,
            packageName: selectedPackage.name,
            selectedPackage: selectedPackage,
            studentSeats: 10,
            educatorSeats: 1,
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

            // Adjust prices
            $scope.calculatePOPrice();
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

        $scope.licenseOwnerValid = false;
        $scope.licenseOwnerExists = false;

        $scope.findLicenseOwner = function ( info ) {
            $scope.licenseOwnerValid = false;
            $scope.licenseOwnerExists = false;

            if ( $scope.validateEmail( info.user.email ) ) {
                $scope.licenseOwnerValid = true;

                UserService.getByEmail( info.user.email )
                .success(function (data,status) {
                    if ( ! _.isEmpty(data) ) {
                        $scope.licenseOwnerExists = true;
                        info.user = data;
                        info.PO.firstName = data.firstName;
                        info.PO.lastName = data.lastName;
                        info.PO.email = info.user.email;
                    } else {
                        info.PO.firstName = "";
                        info.PO.lastName = "";
                        info.PO.email = info.user.email;
                    }
                });
            }
        };

        $scope.validateEmail = function (email) {
            var re = $rootScope.emailValidationPattern;
            return re.test(email);
        };

		$scope.cancelPurchaseOrder = function () {
			$scope.licenseOwnerValid = false;
			$scope.licenseOwnerExists = false;
			$scope.info.user.email = "";
			$scope.info.PO.email = "";
		};

        $scope.calculatePOPrice = function () {
            var students = 10.0;
            var educators = 1.0;

            if ( ! $scope.status.studentSeats ) {
                students = 10.0;
            } else {
                students = parseFloat( $scope.status.studentSeats );
            }

            // Current limits
            if ( students < 1.0 ) {
                students = 10.0;
                $scope.status.studentSeats = "1";
            } else if ( students < 10.0 ) {
                students = 10.0;
            } else if ( students > 9999 ) {
                students = 9999.0;
                $scope.status.studentSeats = students.toString();
            }

            // For now, force educators value based on # of students
            var discount = 0;
            if ( students < 11.0 ) {
                discount = 0;
                educators = 1.0;
            } else if ( students < 31.0 ) {
                discount = 20;
                educators = 2.0;
            } else if ( students < 121.0 ) {
                discount = 25;
                educators = 8.0;
            } else if ( students < 501.0 ) {
                discount = 30;
                educators = 15.0;
            } else {
                discount = 35;
                educators = 100.0;
            }

            $scope.status.educatorSeats = educators.toString();

            /*
            // In case we make it flexible again
            if ( ! $scope.status.educatorSeats ) {
                educators = 1.0;
            } else {
                educators = parseFloat( $scope.status.educatorSeats );
            }
            */

            /*
            if ( educators < 1.0 ) {
                educators = 1.0;
                $scope.status.educatorSeats = '1';
            }
            */

            var baseStripeQuantity = $scope.status.selectedPackage.pricePerSeat * students;
            $scope.info.PO.payment = Math.round(baseStripeQuantity - baseStripeQuantity*discount/100);
        };

        $scope.requestPurchaseOrder = function (studentSeats,packageName, info) {
            var targetPlan = _.find(packages.plans, {name: packageName});
            var planInfo = {
                                seats: '_' + $scope.status.studentSeats.toString() + '_' + $scope.status.educatorSeats.toString(),
                                educators: parseInt($scope.status.educatorSeats),
                                students: parseInt($scope.status.studentSeats),
                                type: targetPlan.planId
                            };
            if ($scope.promoCode.valid) {
                planInfo.promoCode = $scope.promoCode.code;
            }
            var purchaseOrder = $scope.info.PO;
            /* Convert to database expected values */
            purchaseOrder.payment = parseFloat(purchaseOrder.payment);
            purchaseOrder.payment = purchaseOrder.payment.toFixed(2);
            purchaseOrder.payment = parseFloat(purchaseOrder.payment);
            purchaseOrder.name = purchaseOrder.firstName + ' ' + purchaseOrder.lastName;

            // If we require a new user account
            var account = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                state: null,
                school: '',
                confirm: '',
                role: 'instructor',
                acceptedTerms: true,
                newsletter: true,
                errors: [],
                isRegCompleted: false
            };

            if ( ! $scope.licenseOwnerExists ) {
                // Fill in
                account.firstName = $scope.info.PO.firstName;
                account.lastName = $scope.info.PO.lastName;
                account.email = $scope.info.PO.email;

                // TODO: KMY: get this from current pwd randomizer
                account.password = "nglsenFUuiu395389h84ghekljhgl";
                account.confirm = account.password;

                account.state = $scope.info.school.state;

                // Get the standard based on state
                if( account.state === "Texas" ) {
                    account.standards = "TEKS";
                }
                else {
                    account.standards = "CCSS";
                }

                account.school = $scope.info.school.name;
            }

            LicenseStore.setData({
                purchaseOrderInfo: purchaseOrder,
                planInfo: planInfo,
                schoolInfo: $scope.info.school,
                payment: $scope.info.PO.payment,
                user: $scope.info.user,
                licenseOwnerExists: $scope.licenseOwnerExists,
                account: account
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