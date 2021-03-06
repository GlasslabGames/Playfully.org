angular.module('playfully.admin', ['dash','data','games','license','gl-popover-unsafe-html'])

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
            authorizedRoles: ['admin','reseller']
        }
    })
    .state('modal.reseller-confirm-purchase-order-modal', {
        url: '/admin/reseller-confirm-purchase-order',
        data: {
            pageTitle: 'Confirm Purchase Order',
            authorizedRoles: ['admin','reseller']
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
                                $scope.purchaseInfo.user = user;
                                return AuthService.sendPasswordResetLink( $scope.purchaseInfo.account.email );
                            }.bind(this), function(error) {
                                if ( data.error ) {
                                    $scope.purchaseInfo.account.errors.push(data.error);
                                } else {
                                    $scope.purchaseInfo.account.errors.push(ERRORS['general']);
                                }

                                // Do not create PO
                                return;
                            }.bind(this) )
                            .then( function(data, status, headers, config) {
		                        // Submit PO
			                    $scope.request = {
			                        success: false,
			                        errors: [],
			                        isSubmitting: false
			                    };
		                        UtilService.submitFormRequest($scope.request, function () {
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
	                        UtilService.submitFormRequest($scope.request, function () {
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
        resolve: {
        	purchaseOrders: function (LicenseService) {
        		return LicenseService.getOpenPurchaseOrders();
        	},
        	processedPurchaseOrders: function (LicenseService) {
        		return LicenseService.getNotOpenPurchaseOrders();
        	}
        },
        data: {
            authorizedRoles: ['admin','reseller']
        }
    })
    .state('admin.developer-approval', {
        url: '/developer-approval',
        views: {
          'main@': {
            templateUrl: 'admin/admin-developer-approval.html',
            controller: 'AdminDeveloperApprovalCtrl'
          }
        },
        resolve: {
            developers: function (UserService) {
                return UserService.getAllDevelopers();
            }
        },
        data: {
            pageTitle: 'Developers Pending',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.developer-approval.approved', {
        url: '/approved',
        views: {
          'main@': {
            templateUrl: 'admin/admin-developer-approval.html',
            controller: 'AdminDeveloperApprovalCtrl'
          }
        },
        resolve: {
            developers: function (UserService) {
                return UserService.getAllDevelopers();
            }
        },
        data: {
            pageTitle: 'Developers Approved',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.developer-approval.revoked', {
        url: '/revoked',
        views: {
            'main@': {
                templateUrl: 'admin/admin-developer-approval.html',
                controller: 'AdminDeveloperApprovalCtrl'
            }
        },
        resolve: {
            developers: function (UserService) {
                return UserService.getAllDevelopers();
            }
        },
        data: {
            pageTitle: 'Developers Revoked',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.developer-approval.sent', {
        url: '/sent',
        views: {
            'main@': {
                templateUrl: 'admin/admin-developer-approval.html',
                controller: 'AdminDeveloperApprovalCtrl'
            }
        },
        resolve: {
            developers: function (UserService) {
                return UserService.getAllDevelopers();
            }
        },
        data: {
            pageTitle: 'Unverified Developers',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.account-management', {
        url: '/account-management',
        templateUrl: 'admin/admin-account-management.html',
        controller: 'AdminAccountManagementCtrl',
        resolve: {
            packages: function (LicenseService) {
                return LicenseService.getPackages({salesRep: true});
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.monitor', {
        url: '/monitor',
        templateUrl: 'admin/admin-monitor.html',
        controller: 'AdminMonitorCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('modal.developer-email-reason-modal', {
        url: '/admin/developer-email-reason',
        data: {
            pageTitle: 'Enter message or explanation',
            authorizedRoles: ['admin']
        },
        views: {
            'modal@': {
                templateUrl: 'admin/admin-develoepr-email-reason-modal.html',
                controller: function ($scope, $log, $window, GamesService) {
                    $scope.request = {
                        success: false,
                        errors: [],
                        isSubmitting: false
                    };

                    $scope.notice = {text: ""};
                    
                    $scope.completeAction = function() {
                        var data = GamesService.getGameData();
                        $scope.request.isSubmitting = true;
           
                        if (data.action == 'reject') {
                            GamesService.rejectGame(data.game.gameId, $scope.notice.text)
                            .then(function(response) {
                                // could be array or object
                                if (angular.isArray($scope.games)) {
                                    data.games.splice(data.game.myKey, 1);
                                } else {
                                    delete data.games[data.game.myKey];
                                }
                                angular.forEach( data.games, function( value, key ) {
                                    value.myKey = key;
                                });
                                
                                $scope.close();
                            }, function(err){
                                $log.error("check game access:", err);
                                $window.alert(err);
                                $scope.close();
                            });
                        } else {
                            GamesService.requestMoreInfoAboutGame(data.game.gameId, $scope.notice.text)
                            .then(function(response) {
                                $scope.close();
                            }, function(err){
                                $log.error("check game access:", err);
                                $window.alert(err);
                                $scope.close();
                            });
                        }
                    };
                }
            }
        }
    })
    .state('admin.game-access', {
        url: '/game-access',
        resolve: {
            gameAccessRequestsAwaitingApproval: function (GamesService) {
                return GamesService.getAllDeveloperGameAccessRequestsAwaitingApproval();
            },
            gameAccessRequestsDenied: function (GamesService) {
                return GamesService.getAllDeveloperGameAccessRequestsDenied();
            }
        },
        views: {
            'main@': {
                templateUrl: 'admin/admin-game-access.html',
                controller: 'AdminGameAccessCtrl'
            }
        },
        data: {
            pageTitle: 'Game Access',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.game-access.denied', {
        url: '/game-access/denied',
        resolve: {
            gameAccessRequestsAwaitingApproval: function (GamesService) {
                return GamesService.getAllDeveloperGameAccessRequestsAwaitingApproval();
            },
            gameAccessRequestsDenied: function (GamesService) {
                return GamesService.getAllDeveloperGameAccessRequestsDenied();
            }
        },
        views: {
            'main@': {
                templateUrl: 'admin/admin-game-access.html',
                controller: 'AdminGameAccessCtrl'
            }
        },
        data: {
            pageTitle: 'Denied Requests',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.game-approval', {
        url: '/game-approval',
        resolve: {
            gamesApproved: function (GamesService) {
                return GamesService.getAllDeveloperGamesApproved();
            },
            gamesAwaitingApproval: function (GamesService) {
                return GamesService.getAllDeveloperGamesAwaitingApproval();
            },
            gamesRejected: function (GamesService) {
                return GamesService.getAllDeveloperGamesRejected();
            }
        },
        views: {
          'main@': {
            templateUrl: 'admin/admin-game-approval.html',
            controller: 'AdminGameApprovalCtrl'
          }
        },
        data: {
            pageTitle: 'Approved Games',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.game-approval.pending', {
        url: '/game-approval/pending',
        views: {
          'main@': {
            templateUrl: 'admin/admin-game-approval.html',
            controller: 'AdminGameApprovalCtrl'
          }
        },
        data: {
            pageTitle: 'Pending Games',
            authorizedRoles: ['admin']
        }
    })
    .state('admin.game-approval.rejected', {
        url: '/game-approval/rejected',
        views: {
          'main@': {
            templateUrl: 'admin/admin-game-approval.html',
            controller: 'AdminGameApprovalCtrl'
          }
        },
        data: {
            pageTitle: 'Rejected Games',
            authorizedRoles: ['admin']
        }
    })




    .state('admin.admin-games-edit', {
        url: '/admin-games-edit',
        resolve: {
            allGamesInfo: function(GamesService) {
                return GamesService.all();
            },
            gamesAvailable: function (GamesService) {
                return GamesService.getAllDeveloperGamesAvailable();
            },
            gamesApproved: function (GamesService) {
                return GamesService.getAllDeveloperGamesApproved();
            },
            gamesAwaitingApproval: function (GamesService) {
                return GamesService.getAllDeveloperGamesAwaitingApproval();
            },
            gamesRejected: function (GamesService) {
                return GamesService.getAllDeveloperGamesRejected();
            },
            submissionTarget: function (GamesService) {
                return GamesService.getSubmissionTarget();
            }
        },
        views: {
          'main@': {
            templateUrl: 'admin/admin-games-edit.html',
            controller: 'AdminGamesEditCtrl'
          }
        },
        data: {
            pageTitle: 'Admin Games Edit',
            authorizedRoles: ['admin']
        }
    })




    .state('admin.reseller-approval', {
        url: '/reseller-approval',
        templateUrl: 'admin/admin-reseller-approval.html',
        controller: 'AdminResellerApprovalCtrl',
        resolve: {
            resellers: function (UserService) {
                return UserService.getResellers();
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
    })
    .state('admin.reseller-one-page', {
        url: '/reseller-one-page',
        templateUrl: 'admin/admin-reseller-one-page.html',
        controller: 'ResellerOnePageCtrl',
        data: {
            authorizedRoles: ['admin','reseller']
        }
    });
})


////////////////
////////////////


.controller('AdminOnePageCtrl', function ($scope) {

    //     $scope.dataExportForm = function() {
    //         DataService.exportReportData().then(function(data) {
    //         });
    //     };
})
.controller('ResellerOnePageCtrl', function ($scope) {
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

            if (3 < data.length) {
                if ("string" == typeof(data[3])) {
                    $scope.rdeTextArea4 = '' + data[3];
                } else {
                    $scope.rdeTextArea4 = JSON.stringify(data[3], null, 2);
                }
            }

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
        $scope.licenseOwnerPending = false;

        $scope.findLicenseOwner = function ( info ) {
            $scope.licenseOwnerValid = false;
            $scope.licenseOwnerExists = false;
            $scope.licenseOwnerPending = false;

            if ( $scope.validateEmail( info.user.email ) ) {
                $scope.licenseOwnerValid = true;

				info.PO.firstName = "";
				info.PO.lastName = "";
				info.PO.email = info.user.email;

                UserService.getByEmail( info.user.email )
                .then( function( data ) {
					if ( ! _.isEmpty( data.data ) ) {
	                    $scope.licenseOwnerExists = true;
	                    info.user = data.data;
	                    info.PO.firstName = info.user.firstName;
	                    info.PO.lastName = info.user.lastName;
	                    return LicenseService.getPendingPOForUser( info.user.id );
	                } else {
	                    return;
	                }
                }.bind(this))
                .then( function( data ) {
                	if ( data && ( ! _.isEmpty( data.data ) ) ) {
                		$scope.licenseOwnerPending = true;
                	}
                }.bind(this))
                .then( null, function( err ) {
                }.bind(this));
            }
        };

        $scope.validateEmail = function (email) {
            var re = $rootScope.emailValidationPattern;
            return re.test(email);
        };

		$scope.cancelPurchaseOrder = function () {
			$scope.licenseOwnerValid = false;
			$scope.licenseOwnerExists = false;
			$scope.licenseOwnerPending = false;
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

.controller('AdminPurchaseOrdersCtrl', function ($scope, $http, $window, LicenseService, purchaseOrders, processedPurchaseOrders) {
	$scope.openPurchaseOrders = purchaseOrders.data;
	$scope.closedPurchaseOrders = processedPurchaseOrders.data;

	$scope.predicateApprove = 'date';
    $scope.reverseApprove = false;
    $scope.orderApprove = function(predicate) {
        $scope.reverseApprove = ($scope.predicateApprove === predicate) ? !$scope.reverseApprove : false;
        $scope.predicateApprove = predicate;
    };

    $scope.actionPO = function( po ) {
		var purchaseOrder = {
			key: "",
			number: "",
			amount: ""
		};

		purchaseOrder.key	 = po.purchase_order_key;
		purchaseOrder.number = po.purchase_order_number;
		purchaseOrder.amount = po.payment;

		var planInfo = {
			type: "",
			seats: ""
		};

		planInfo.type = po.current_package_type;
		planInfo.seats = po.current_package_size_tier;

    	var action = "";

    	if ( po.status === 'pending' ) {
    		action = 'receive';
    	} else if ( po.status === 'received' ) {
    		action = 'invoice';
    	} else {
    		action = 'approve';
    	}

        LicenseService.updatePurchaseOrder( purchaseOrder, planInfo, action )
        	.then(function(data) {
        		$window.location.reload( true );
        	}.bind(this));
    };

    $scope.rejectPO = function( po ) {
		var purchaseOrder = {
			key: "",
			number: "",
			amount: ""
		};

		purchaseOrder.key	 = po.purchase_order_key;
		purchaseOrder.number = po.purchase_order_number;
		purchaseOrder.amount = po.payment;

		var planInfo = {
			type: "",
			seats: ""
		};

		planInfo.type = po.current_package_type;
		planInfo.seats = po.current_package_size_tier;

    	var action = "reject";

        LicenseService.updatePurchaseOrder( purchaseOrder, planInfo, action )
        	.then(function(data) {
        		$window.location.reload( true );
        	}.bind(this));
    };

    $scope.showDate = function( dt ) {
    	var date = new Date( dt );
    	return date.toLocaleDateString();
    };

    $scope.actionPOName = function( po ) {
    	if ( po.status === 'pending' ) {
    		return 'RECEIVE';
    	} else if ( po.status === 'received' ) {
    		return 'INVOICE';
    	}

		return 'APPROVE';
    };
})

.controller('AdminResellerApprovalCtrl', function (resellers, $scope, $window, UserService) {
	$scope.pending = [];
	$scope.approved = [];

	var resellerList = resellers.data;

	// build lists
	angular.forEach( resellerList, function( value ) {
		if ( value.role === "reseller" ) {
			$scope.approved.push( value );
		} else if ( value.role === "res-cand" ) {
			$scope.pending.push( value );
		}
	});

	$scope.predicateApprove = 'username';
    $scope.reverseApprove = false;
    $scope.orderApprove = function(predicate) {
        $scope.reverseApprove = ($scope.predicateApprove === predicate) ? !$scope.reverseApprove : false;
        $scope.predicateApprove = predicate;
    };
      
	$scope.predicateVerified = 'username';
    $scope.reverseVerified = false;
    $scope.orderVerified = function(predicate) {
        $scope.reverseVerified = ($scope.predicateVerified === predicate) ? !$scope.reverseVerified : false;
        $scope.predicateVerified = predicate;
    };

    $scope.approveReseller = function(reseller) {
    	var i;
		for(i = $scope.pending.length; i--;) {
			if($scope.pending[i] === reseller) {
				break;
			}
		}

		if (i >= 0) {
			var doApprove = $window.confirm('Are you sure you want to approve ' + reseller.username + '?');
			if (doApprove) {
				UserService.updateUserRole( reseller.id, "reseller")
				.then(function(response) {
					$scope.pending.splice(i, 1);

					// Add to approved
					reseller.role = "reseller";
					$scope.approved.push( reseller );
				}.bind(this),
				function (response) {
					$window.alert(response.message);
				});
			}
		}
    };

    $scope.revokeReseller = function(reseller) {
		var i;
		for(i = $scope.approved.length; i--;) {
			if($scope.approved[i] === reseller) {
				break;
			}
		}
		if (i >= 0) {
			var doRevoke = $window.confirm('Are you sure you want to revoke ' + reseller.username + '?');
			if (doRevoke) {
				UserService.updateUserRole( reseller.id, "res-cand")
				.then(function(response) {
					$scope.approved.splice(i, 1);

					// Can we FORCE them to be logged off (in case they're logged in)?

					// Add to pending
					reseller.role = "res-cand";
					$scope.pending.push( reseller );
				}.bind(this),
				function (response) {
					$window.alert(response.message);
				});
			}
		}
   };
})

.controller('AdminDeveloperApprovalCtrl', function (developers, $scope, $state, $window, UserService) {
    $scope.showTab = 0;
    if ($state.includes('admin.developer-approval.approved')) {
        $scope.showTab = 1;
    } else if ($state.includes('admin.developer-approval.revoked')) {
        $scope.showTab = 2;
    } else if ($state.includes('admin.developer-approval.sent')) {
        $scope.showTab = 3;
    }

    switch ($scope.showTab) {
        case 0:
            $scope.developers = developers.pending;
            break;
        case 1:
            $scope.developers = developers.approved;
            break;
        case 2:
            $scope.developers = developers.revoked;
            break;
        case 3:
            $scope.developers = developers.pendingVerification;
            break;
    }

	$scope.predicateList = 'date';
    $scope.reverseList = false;
    $scope.orderList = function(predicate) {
        $scope.reverseList = ($scope.predicateList === predicate) ? !$scope.reverseList : false;
        $scope.predicateList = predicate;
    };

    $scope.organizationInfo = function(developer) {
        if (!developer.organization) {
            return "No organization information";
        }
        
        return "<strong>Role:</strong> " + developer.orgRole + "<br />" +
            "<strong>Number of games:</strong> " + developer.numGames + "<br />" +
            "<strong>Subjects:</strong> " + developer.subjects + "<br />" +
            "<strong>Interest:</strong> " + developer.interest;
    };
    
    $scope.approveDeveloper = function(developer) {
    	var i;
    	for(i = $scope.developers.length; i--;) {
          if($scope.developers[i] === developer) {
              break;
          }
        }
        if (i >= 0) {
		  var doApprove = $window.confirm('Are you sure you want to approve ' + developer.name + '?');
		  if (doApprove) {
			UserService.alterDeveloperStatus(developer.id, "sent")
			.then(function(response) {
				$scope.developers.splice(i, 1);
			}.bind(this),
			function (response) {
				$window.alert(response.message);
			});
		  }
        }
    };
      
    $scope.revokeDeveloper = function(developer) {
    	var i;
    	for(i = $scope.developers.length; i--;) {
          if($scope.developers[i] === developer) {
              break;
          }
        }
        if (i >= 0) {
		  var doRevoke = $window.confirm('Are you sure you want to revoke ' + developer.name + '?');
		  if (doRevoke) {
			UserService.alterDeveloperStatus(developer.id, "revoked")
			.then(function(response) {
				$scope.developers.splice(i, 1);
			}.bind(this),
			function (response) {
				$window.alert(response.message);
			});
		  }
        }
    };

    $scope.resendDeveloperVerification = function(developer) {
        var i;
        for(i = $scope.developers.length; i--;) {
            if($scope.developers[i] === developer) {
                break;
            }
        }
        if (i >= 0 && typeof($scope.developers[i].resent) === "undefined") {
            UserService.alterDeveloperStatus(developer.id, "resent")
                .then(function(response) {
                        $scope.developers[i].resent = true;
                    }.bind(this),
                    function (response) {
                        $window.alert(response.message);
                    });
        }
    };
    
    $scope.emailDeveloper = function(developer) {
        $window.location = "mailto:" + developer.email;
    };
})
.controller('AdminAccountManagementCtrl', function ($scope, $state, $window, packages, REGISTER_CONSTANTS, UserService, LicenseService) {
    
    $scope.packages = angular.copy(packages);
    $scope.role = 'none';
    $scope.username = '';
    $scope.userInfo = null;
    $scope.lookupErrorMsg = null;
    $scope.changeErrorMsg = null;
    $scope.hasPlan = false;
    $scope.canUpgradeSeats = false;
    $scope.canAddYear = false;
    $scope.hasInstitution = false;
    $scope.planSetting = 'noChange';
    $scope.seatsSetting = { id: 'noChange' };
    $scope.yearAdded = false;
    $scope.institutionInfo = { name: "", address: "", city: "", state: "", zipCode: "" };
    $scope.seatOptions = { };
    $scope.states = angular.copy(REGISTER_CONSTANTS.states);

    $scope.seatsLevelMap = { "trial": 0, "group": 1, "class": 2, "multiClass": 3, "school": 4 };

    $scope.lookupAccount = function() {
        UserService.getByUsername($scope.username)
        .success(function (data, status) {
            if ( ! _.isEmpty(data) ) {
                $scope.role = data.role;
                $scope.userInfo = data;
                $scope.expirationDate = new Date(data.expirationDate).toLocaleString();
                $scope.newExpirationDate = new Date(data.expirationDate).toLocaleString();
                $scope.lookupErrorMsg = null;
                $scope.changeErrorMsg = null;
                if (data.role === 'instructor' && data.licenseStatus === 'active') {
                    LicenseService.getUserPlan(data.id, data.licenseId, data.licenseOwnerId)
                    .then(function(response) {
                        if (response.autoRenew !== undefined) {
                            $scope.hasPlan = true;
                            $scope.plan = response;
                            $scope.hasInstitution = response.institution !== undefined;
                            $scope.planSetting = 'noChange';
                            $scope.yearAdded = false;
                            $scope.institutionInfo = { name: "", address: "", city: "", state: "", zipCode: "" };
                          
                            $scope.seatOptions = [];

                            var standardSeatOptions = [{ id: "noChange", title: "[No change]"}];
                            var isTrial = (response.packageDetails.planId === 'trial' || response.packageDetails.planId === 'trialLegacy' );
                            var students = response.packageDetails.studentSeats;
                            var educators = response.packageDetails.educatorSeats;

                            $scope.canAddYear = !isTrial;

                            angular.forEach( $scope.packages.seats, function(seat) {
                                if (isTrial || (seat.studentSeats > students && seat.educatorSeats > educators)) {
                                    if (seat.size == "Custom") {
                                        $scope.seatOptions.push({ id: seat.seatId, title: "Custom (" +  seat.studentSeats + " students, " + seat.educatorSeats + " educators)"});
                                    } else if (seat.seatId == "group") {
                                        standardSeatOptions.push({ id: "group", title: "Group (10 students, 1 educator)"});
                                    } else if (seat.seatId == "class") {
                                        standardSeatOptions.push({ id: "class", title: "Class (30 students, 2 educators)"});
                                    } else if (seat.seatId == "multiClass") {
                                        standardSeatOptions.push({ id: "multiClass", title: "Multi Class (120 students, 8 educators)"});
                                    } else if (seat.seatId == "school") {
                                        standardSeatOptions.push({ id: "school", title: "School (500 students, 15 educators)"});
                                    }
                                }
                            });
                            
                            $scope.seatOptions = standardSeatOptions.concat($scope.seatOptions);
                            $scope.seatsSetting = $scope.seatOptions[0];
                            $scope.canUpgradeSeats = $scope.seatOptions.length > 1;
                          
                            //console.log(response);
                        } else {
                            $scope.hasPlan = false;
                            $scope.hasInstitution = false;
                            //console.log("No plan?");
                        }
                    });
                }
            } else {
                $scope.role = 'none';
                $scope.lookupErrorMsg = 'Cannot find that user!';
            }
        });
    };
    
    $scope.changePlan = function() {
        var changed = false;
        var details = $scope.plan.packageDetails;
        var planInfo = { type: details.planId, seats: details.seatId, yearAdded: false };
        
        if ($scope.yearAdded) {
            changed = true;
            planInfo.yearAdded = true;
        } else if ($scope.newExpirationDate != $scope.expirationDate) {
            changed = true;
            planInfo.expDate = new Date($scope.newExpirationDate);
        }
        if ($scope.planSetting !== 'noChange') {
            changed = true;
            planInfo.type = $scope.planSetting;
        }
        if ($scope.seatsSetting.id !== 'noChange') {
            changed = true;
            planInfo.seats = $scope.seatsSetting.id;
        }
        
        var schoolInfo = { name: "", address: "", city: "", state: "", zipCode: "" };
        if ($scope.hasInstitution) {
            schoolInfo.name = $scope.plan.institution.TITLE;
            schoolInfo.address = $scope.plan.institution.ADDRESS;
            schoolInfo.city = $scope.plan.institution.CITY;
            schoolInfo.state = $scope.plan.institution.STATE;
            schoolInfo.zipCode = $scope.plan.institution.ZIP;
        }
        
        if ($scope.institutionInfo.name.length > 0) {
            changed = true;
            schoolInfo.name = $scope.institutionInfo.name;
        }
        if ($scope.institutionInfo.address.length > 0) {
            changed = true;
            schoolInfo.address = $scope.institutionInfo.address;
        }
        if ($scope.institutionInfo.city.length > 0) {
            changed = true;
            schoolInfo.city = $scope.institutionInfo.city;
        }
        if ($scope.institutionInfo.state.length > 0) {
            changed = true;
            schoolInfo.state = $scope.institutionInfo.state;
        }
        if ($scope.institutionInfo.zipCode.length > 0) {
            changed = true;
            schoolInfo.zipCode = $scope.institutionInfo.zipCode;
        }

        if (changed) {
            if (!$scope.hasInstitution && $scope.userInfo.isTrial) {
                if (planInfo.type === 'trial' || planInfo.seats === 'trial') {
                    $scope.changeErrorMsg = "Upgrading from trial requires selecting plan and seats!";
                    return;
                }
            
                if (schoolInfo.name === '' || schoolInfo.address === '' || schoolInfo.city === '' ||                schoolInfo.state === '' || schoolInfo.zipCode === '') {
                    $scope.changeErrorMsg = "Upgrading from trial requires entering institution information!";
                    return;
                }
            }

            var licenseInfo = { userId: $scope.userInfo.id, email: $scope.userInfo.email, licenseId: $scope.userInfo.licenseId, licenseOwnerId: $scope.userInfo.licenseOwnerId };
            
            LicenseService.alterLicense({ licenseInfo: licenseInfo, planInfo: planInfo, schoolInfo: schoolInfo })
            .then(function(response) {
                $scope.changeErrorMsg = null;
                $scope.lookupAccount();
            }, function (response) {
                $scope.changeErrorMsg = "Error! " + response.statusText + " (" + response.status + ")";
            });
        } else {
            $scope.changeErrorMsg = "No data changed";
        }
    };
})




////    ////////                        ////////
////      ////////                    ////////
////        ////////                ////////
////          ////////            ////////
////            ////////        ////////
////              ////////    ////////
////                ////////////////
////                  ////////////
////                    ////////
////                  ////////////
////                ////////////////
////              ////////    ////////
////            ////////        ////////
////          ////////            ////////
////        ////////                ////////
////      ////////                    ////////
////    ////////                        ////////




.controller('AdminGamesEditCtrl', function ($scope, $state, $log, $window, UserService, GamesService, allGamesInfo, gamesAvailable, submissionTarget, gamesApproved, gamesAwaitingApproval, gamesRejected) {

    $scope.showTab = 0;

    $scope.usersxx = gamesAvailable;
    $scope.allgames = allGamesInfo;

    $scope.submissionTarget = submissionTarget;

    $scope.predicateList = 'gameId';
    $scope.reverseList = false;
    $scope.orderList = function(predicate) {
        $scope.reverseList = ($scope.predicateList === predicate) ? !$scope.reverseList : false;
        $scope.predicateList = predicate;
    };
    
    // $scope.games must after any massaging must be an array of objects
    // with fields "gameId", "userId", "company" and "longName"
    if ($scope.showTab === 0) {
        // $scope.games = gamesApproved;
        $scope.games = allGamesInfo;
        angular.forEach( $scope.games, function( value, key ) {
            value.myKey = key;
            value.company = (value.organization !== undefined ? value.organization.organization : "");
        });
    }

    $scope.approveGame = function(gameId) {
        GamesService.approveGame(gameId)
            .then(function(response) {
                // always on objct
                //delete $scope.games[game.myKey];
            }, function(err){
                $log.error("check game access:", err);
                $window.alert(err);
            });
    };
})


.controller('AdminGameAccessCtrl', function ($scope, $state, $log, $window, UserService, GamesService, gameAccessRequestsAwaitingApproval, gameAccessRequestsDenied) {
    $scope.showTab = 0;
    if ($state.includes('admin.game-access.denied')) {
        $scope.showTab = 1;
    }

    $scope.predicateList = 'gameId';
    $scope.reverseList = false;
    $scope.orderList = function(predicate) {
        $scope.reverseList = ($scope.predicateList === predicate) ? !$scope.reverseList : false;
        $scope.predicateList = predicate;
    };

    if ($scope.showTab === 0) {
        $scope.accessRequests = gameAccessRequestsAwaitingApproval;
    } else if ($scope.showTab === 1) {
        $scope.accessRequests = gameAccessRequestsDenied;
    }

    // $scope.games must after any massaging must be an array of objects
    // with fields "gameId", "userId", "devEmail", "gameName" and "verifyCode"
    angular.forEach( $scope.accessRequests, function( value, key ) {
        value.myKey = key;
        value.userId = value.userId;
        value.devEmail = value.devEmail;
        value.gameId = value.gameId;
        value.gameName = value.basic.longName;
        value.verifyCode = value.verifyCode;
    });

    $scope.grantAccess = function(accessRequest) {
        GamesService.approveGameAccessRequest(accessRequest)
            .then(function(response) {
                $scope.accessRequests.splice(accessRequest.myKey, 1);
            }, function(err){
                $log.error("check game access:", err);
                $window.alert(err);
            });
    };

    $scope.denyAccess = function(accessRequest) {
        GamesService.denyGameAccessRequest(accessRequest)
            .then(function(response) {
                // always on object
                $scope.accessRequests.splice(accessRequest.myKey, 1);
            }, function(err){
                $log.error("check game access:", err);
                $window.alert(err);
            });
        //$state.go("modal.developer-email-reason-modal");
    };

})

.controller('AdminGameApprovalCtrl', function ($scope, $state, $log, $window, UserService, GamesService, gamesApproved, gamesAwaitingApproval, gamesRejected) {
    $scope.showTab = 0;
    if ($state.includes('admin.game-approval.pending')) {
        $scope.showTab = 1;
    } else if ($state.includes('admin.game-approval.rejected')) {
        $scope.showTab = 2;
    }

    $scope.predicateList = 'gameId';
    $scope.reverseList = false;
    $scope.orderList = function(predicate) {
        $scope.reverseList = ($scope.predicateList === predicate) ? !$scope.reverseList : false;
        $scope.predicateList = predicate;
    };
    
    // $scope.games must after any massaging must be an array of objects
    // with fields "gameId", "userId", "company" and "longName"
    if ($scope.showTab === 0) {
        $scope.games = gamesApproved;
        angular.forEach( $scope.games, function( value, key ) {
            value.myKey = key;
            value.company = (value.organization !== undefined ? value.organization.organization : "");
        });
    } else if ($scope.showTab === 1) {
        $scope.games = gamesAwaitingApproval;
        angular.forEach( $scope.games, function( value, key ) {
            value.myKey = key;
            value.company = (value.organization !== undefined ? value.organization.organization : "");
            value.longName = value.basic.longName;
        });
    } else if ($scope.showTab === 2) {
        $scope.games = gamesRejected;
        angular.forEach( $scope.games, function( value, key ) {
            value.myKey = key;
            value.company = (value.organization !== undefined ? value.organization.organization : "");
            value.longName = value.basic.longName;
        });
    }

    $scope.approveGame = function(game) {
        GamesService.approveGame(game.gameId)
        .then(function(response) {
            // always on objct
            delete $scope.games[game.myKey];
        }, function(err){
            $log.error("check game access:", err);
            $window.alert(err);
        });
    };

    $scope.rejectGame = function(game) {
        GamesService.setGameData({ games: $scope.games, game: game, action: 'reject' });
        $state.go("modal.developer-email-reason-modal");
    };

    $scope.needMoreInfo = function(game) {
        GamesService.setGameData({ game: game, action: 'more-info' });
        $state.go("modal.developer-email-reason-modal");
    };

})

.controller('AdminMonitorCtrl', function ($scope, $state, $interval, DataService, ENV) {
    $scope.loaded = false;

    $scope.monitorReport = function() {
        DataService.monitorReport()
        .then(function(response) {
            $scope.report = response;
            $scope.loaded = true;
            $scope.lastReportDate = moment().format("YYYY-MM-DD HH:mm:ss");
        });
    };

    $scope.myInterval = $interval(function () {
        $scope.monitorReport();
    }, ENV.monitorRateMillis ? ENV.monitorRateMillis : 300000);

    $scope.$on("$destroy", function(){
        $interval.cancel($scope.myInterval);
    });

    $scope.monitorReport(); // prime it
    
    $scope.fetchData = function() {
        DataService.runMonitor()
        .then(function(response) {
            $scope.monitorReport();
        });
    };
    
    $scope.upText = function(data) {
        return data ? "UP" : "DOWN";
    };

    $scope.infoText = function(data) {
        return data ? "OK" : "MISSING";
    };

    $scope.cpuUsageText = function(data) {
        return data.toFixed(2);
    };

    $scope.jobCountText = function(missing, count) {
        return missing ? "MISSING" : count;
    };
    
    $scope.leakText = function(leak, msg) {
        return leak ? msg : "None";
    };
    
    $scope.nodeText = function(data) {
        return data === 'healthy' ? 'Healthy' : 'ERROR: ' + data;
    };
});
