/**
 * Created by charles on 2/5/15.
 */
angular.module('license', [])
    .service('LicenseService', function ($http, $log, $q, $rootScope, API_BASE) {

            this.getCurrentPlan = function () {
                var apiUrl = API_BASE + '/license/plan';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        console.log(response);
                        return response;
                    });
            };
            this.getStudentList = function () {
                var apiUrl = API_BASE + '/license/students';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        console.log(response);
                        return response;
                    });
            };
            this.getPackages = function (params) {
                var apiUrl = API_BASE + '/license/packages';
                return $http({method: 'GET', url: apiUrl, params: params})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        console.log(response);
                        return response;
                    });
            };
            this.subscribeToLicense = function (input) {
                var apiUrl = API_BASE + '/license/subscribe';
                return $http.post(apiUrl, {
                    planInfo: input.planInfo,
                    stripeInfo: input.stripeInfo,
                    schoolInfo: input.schoolInfo
                });
            };
            this.inviteTeachers = function (emails) {
                var apiUrl = API_BASE + '/license/invite';
                return $http.post(apiUrl, {teacherEmails: emails})
                    .then(function (response) {
                        return response.data;
                    });
            };
            this.activateLicenseStatus = function () {
                var apiUrl = API_BASE + '/license/activate';
                return $http.post(apiUrl);
            };
            this.isOwner = function () {
                if ($rootScope.currentUser) {
                    return $rootScope.currentUser.id === $rootScope.currentUser.licenseOwnerId;
                }
            };
            this.isTrial = function () {
                if ($rootScope.currentUser) {
                    return $rootScope.currentUser.isTrial;
                }
            };
            this.isPurchaseOrder = function () {
                if ($rootScope.currentUser) {
                    if ($rootScope.currentUser.isTrial && $rootScope.currentUser.purchaseOrderLicenseId) {
                        return true;
                    }
                    if ($rootScope.currentUser.paymentType === 'purchase-order') {
                        return true;
                    }
                }
            };
            this.hadTrial = function () {
                if ($rootScope.currentUser) {
                    return $rootScope.currentUser.hadTrial;
                }
                return false;
            };
            this.hasLicense = function (show) {
              var license = null;
              var _conditional = function() {
                  if (show) {
                      return license[show];
                  }
                  return license.active;
              };
              if ($rootScope.currentUser) {
                  if ($rootScope.currentUser.isTrial) {
                      license = {type:'trial', badge:'trial', active: true};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.licenseStatus==="active") {
                      license = {type: 'premium', badge: 'premium', active: true};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.purchaseOrderLicenseStatus === "po-received") {
                      license = {type: 'po-received', badge: null, active: null};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.purchaseOrderLicenseStatus ==='po-pending') {
                      license = {type: 'po-pending', badge: null, active: false};
                      return _conditional();
                  }
              }
            };
            this.packageType = function(show) {
                var result = null;
                if ($rootScope.currentUser) {
                    result = $rootScope.currentUser.packageType;
                    if (show == 'badge') {
                        if (result == 'ipad') {
                            result = 'ipad';
                        } else if (result == 'chromebook') {
                            result = 'chromebook';
                        } else if (result == 'pcMac') {
                            result = 'pc-mac';
                        } else {
                            result = 'all';
                        }
                    }
                }
                return result;
            };
            this.licenseExpirationDate = function() {
                if( $rootScope.currentUser &&
                    this.hasLicense() ) {
                    return moment( $rootScope.currentUser.expirationDate ).diff( moment(), 'days' );
                    //return $rootScope.currentUser.expirationDate;
                }
                else {
                    return 0;
                }
            };
            this.leaveCurrentPlan = function () {
                return $http.post(API_BASE + '/license/leave');
            };
            this.removeEducator = function (email) {
                return $http.post(API_BASE + '/license/remove', {teacherEmail: email});
            };
            this.startTrial = function () {
                return $http.post(API_BASE + '/license/trial');
            };
            this.upgradeFromTrial = function (input) {
                return $http.post(API_BASE + '/license/trial/upgrade', {
                    planInfo: input.planInfo,
                    stripeInfo: input.stripeInfo,
                    schoolInfo: input.schoolInfo
                });
            };
            this.disableAutoRenew = function () {
                return $http.post(API_BASE + '/license/cancel');
            };
            this.enableAutoRenew = function () {
                return $http.post(API_BASE + '/license/renew');
            };
            this.upgradeLicense = function (input) {
                var apiUrl = API_BASE + '/license/upgrade';
                return $http.post(apiUrl, {
                    planInfo: input.planInfo,
                    stripeInfo: input.stripeInfo,
                    schoolInfo: input.schoolInfo
                });
            };
            this.getBillingInfo = function () {
                var apiUrl = API_BASE + '/license/billing';
              return $http({method: 'GET', url: apiUrl})
                  .then(function (response) {
                      return response.data;
                  }, function (response) {
                      return response;
                  });
            };
            this.updateBillingInfo = function (stripeInfo) {
                var apiUrl = API_BASE + '/license/billing';
                return $http.post( apiUrl, {stripeInfo: stripeInfo});
            };
            this.stripeValidation = function (payment, request) {
                request.errors = [];

                //stripe request
                if (!Stripe.card.validateCardNumber(payment.number)) {
                    request.errors.push("You entered an invalid Credit Card number");
                }
                if (!Stripe.card.validateExpiry(payment.exp_month, payment.exp_year)) {
                    request.errors.push("You entered an invalid expiration date");
                }
                if (!Stripe.card.validateCVC(payment.cvc)) {
                    request.errors.push("You entered an invalid CVC number");
                }
                if (Stripe.card.cardType(payment.number)==='Unknown') {
                    request.errors.push("You entered an invalid card type");
                }
                if (Stripe.card.cardType(payment.number) !== payment.card_type) {
                    request.errors.push("The credit card number you entered doesn't match the card type you selected");
                }
            };
            this.stripeRequestPromo = function (promoCode, params) {
                if (params) {
                    return $http.get(API_BASE + '/license/promo-code/' + promoCode + '?acceptInvalid=' + params.acceptInvalid);
                } else {
                    return $http.get(API_BASE + '/license/promo-code/' + promoCode);
                }
            };
            this.getGamesByPlanType = function (planId) {
                return $http.get( API_BASE + '/dash/games/plan/' + planId + '/basic').then(function(response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.subscribeWithPurchaseOrder = function (info) {
                var apiUrl = API_BASE + '/license/subscribe/po';
                return $http.post(apiUrl, {
                    purchaseOrderInfo: info.purchaseOrderInfo,
                    planInfo: info.planInfo,
                    schoolInfo: info.schoolInfo
                });
            };
            this.getPurchaseOrderInfo = function (planId) {
                return $http.get(API_BASE + '/license/po').then(function (response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.upgradeFromTrialwithPurchaseOrder = function (info) {
                var apiUrl = API_BASE + '/license/trial/upgrade/po';
                return $http.post(apiUrl, {
                    purchaseOrderInfo: info.purchaseOrderInfo,
                    planInfo: info.planInfo,
                    schoolInfo: info.schoolInfo
                });
            };
            this.updatePurchaseOrder = function (purchaseOrder, planInfo, action) {
                var apiUrl = API_BASE + '/license/po/' + action;
                return $http.post(apiUrl, {purchaseOrderInfo: purchaseOrder, planInfo: planInfo});
            };
            this.resetLicenseMapStatus = function () {
                return $http.post(API_BASE + '/license/nullify');
            };
            this.cancelActivePurchaseOrder = function () {
                return $http.post(API_BASE + '/license/po/cancel');
            };
            this.getGamesAvailableForLicense = function () {
                return $http.get(API_BASE + '/dash/games/available').then(function (response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.leaveTrialAcceptInvitation = function () {
                return $http.post(API_BASE + '/license/trial/move');
            };
            this.declineInvitation = function () {
                return $http.post(API_BASE + '/license/nullify');
            };
            this.getOpenPurchaseOrders = function() {
            	return $http.get( API_BASE + '/license/po/open' );
            };
            this.resellerSubscribeWithPurchaseOrder = function (info) {
                var apiUrl = API_BASE + '/license/subscribe/internal';
                return $http.post(apiUrl, {
                    purchaseOrderInfo: info.purchaseOrderInfo,
                    planInfo: info.planInfo,
                    schoolInfo: info.schoolInfo,
                    user: info.user
                });
            };
    })
    .factory('LicenseStore', function() {
        var data = {};

        return {
          setData: function (info) {
            data.info =  info;
          },
          getData: function () {
            return data.info;
          },
          reset: function () {
              data.info = {};
          }
        };
    });
