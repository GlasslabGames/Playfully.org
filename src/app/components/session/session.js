angular.module('session', [])
.service('Session', function () {

  this.userId = null;
  this.userRole = null;
  this.loginType = null;

  this.create = function (userId, userRole, loginType) {
    if (arguments.length < 2) {
      throw new Error("Session.create requires userId and userRole parameters");
    }
    this.userId = userId;
    this.userRole = userRole;
    this.loginType = loginType || 'glasslab';
  };

  this.destroy = function () {
    this.userId = null;
    this.userRole = null;
    this.loginType = null;
  };

  return this;
});
