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
            this.getPackages = function () {
                var apiUrl = API_BASE + '/license/packages';
                return $http({method: 'GET', url: apiUrl})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        console.log(response);
                        return response;
                    });
            };
            this.subscribeToLicense = function (input) {
                var apiUrl = API_BASE + '/license/subscribe';
                return $http.post(apiUrl, {planInfo: input.planInfo, stripeInfo: input.stripeInfo });
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
                    return false;
                }
            };
            this.hasLicense = function (show) {
              var license = null;
              var _conditional = function() {
                  if (show) {
                      return license[show];
                  }
                  return license.lic;
              };
              if ($rootScope.currentUser) {
                  if ($rootScope.currentUser.isTrial) {
                      license = {lic:'trial', badge:'trial', active: true};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.licenseStatus==="active") {
                      license = {lic: 'premium', badge: 'premium', active: true};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.licenseStatus === "po-received") {
                      license = {lic: 'po-received', badge: 'premium', active: true};
                      return _conditional();
                  }
                  if ($rootScope.currentUser.licenseStatus==='po-pending') {
                      license = {lic: 'po-pending', badge: null, active: false};
                      return _conditional();
                  }
              }
            };
            this.licenseExpirationDate = function() {
                if( $rootScope.currentUser &&
                    this.hasLicense() ) {
                    return $rootScope.currentUser.expirationDate;
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
                    stripeInfo: input.stripeInfo
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
                return $http.post(apiUrl, {planInfo: input.planInfo, stripeInfo: input.stripeInfo});
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
            this.stripeValidation = function (payment, errors) {
                //stripe request
                if (!Stripe.card.validateCardNumber(payment.number)) {
                    errors.push("You entered an invalid Credit Card number");
                }
                if (!Stripe.card.validateExpiry(payment.exp_month, payment.exp_year)) {
                    errors.push("You entered an invalid expiration date");
                }
                if (!Stripe.card.validateCVC(payment.cvc)) {
                    errors.push("You entered an invalid CVC number");
                }
                if (!Stripe.card.cardType(payment.cardType)) {
                    errors.push("You entered an invalid card type");
                }
            };
            this.stripeRequestPromo = function (promoCode) {
                return $http.get( API_BASE + '/license/promo-code/' + promoCode );
            };
            this.getGamesByPlanType = function (planId) {
                return $http.get( API_BASE + '/dash/games/plan/' + planId + '/basic').then(function(response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.subscribeWithPurchaseOrder = function (purchaseOrder, planInfo) {
                var apiUrl = API_BASE + '/license/subscribe/po';
                return $http.post(apiUrl, {purchaseOrderInfo: purchaseOrder, planInfo: planInfo});
            };
            this.getPurchaseOrderInfo = function (planId) {
                return $http.get(API_BASE + '/license/po').then(function (response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.updatePurchaseOrder = function (action) {
                return $http.get(API_BASE + '/license/po/' + action).then(function (response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };
            this.cancelActivePurchaseOrder = function (action) {
                return $http.get(API_BASE + 'license/po/cancel').then(function (response) {
                    return response.data;
                }, function (response) {
                    console.log('error - ', response);
                    return response;
                });
            };

    });