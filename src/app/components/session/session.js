angular.module('session', [])
.service('Session', function () {

  this.userId = null;
  this.userRole = null;
  this.loginType = null;
  this.licenseStatus = null;
  this.licenseOwnerId = null;
  this.purchaseOrderLicenseStatus = null;
  this.paymentType = null;
  this.isTrial = null;
  this.hadTrial = null;

  this.create = function (userId, userRole, loginType, licenseStatus, purchaseOrderLicenseStatus, licenseOwnerId, paymentType, isTrial, hadTrial) {
    if (arguments.length < 2) {
      throw new Error("Session.create requires userId and userRole parameters");
    }
    this.userId = userId;
    this.userRole = userRole;
    this.loginType = loginType || 'glasslab';
    this.licenseStatus = licenseStatus;
    this.licenseOwnerId = licenseOwnerId;
    this.purchaseOrderLicenseStatus = purchaseOrderLicenseStatus;
    this.paymentType = paymentType;
    this.isTrial = isTrial;
    this.hadTrial = hadTrial;
  };

  this.destroy = function () {
    this.userId = null;
    this.userRole = null;
    this.loginType = null;
    this.licenseStatus = null;
    this.licenseOwnerId = null;
    this.purchaseOrderLicenseStatus = null;
    this.paymentType = null;
    this.isTrial = null;
    this.hadTrial = null;
  };

  return this;
});
