angular.module('session', [])
.service('Session', function () {

  this.userId = null;
  this.userRole = null;

  this.create = function (userId, userRole) {
    if (arguments.length < 2) {
      throw new Error("Session.create requires userId and userRole parameters");
    }
    this.userId = userId;
    this.userRole = userRole;
  };

  this.destroy = function () {
    this.userId = null;
    this.userRole = null;
  };

  return this;
});
