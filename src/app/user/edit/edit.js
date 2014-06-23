/**
 * Top level of user login module.
 *
 * @module user
 * @submodule user.login.form
 **/
angular.module('user.edit', [])

.controller('EditFormModalCtrl',
  function EditFormModalController( $scope, $log, $rootScope, $modalInstance, User ) {


  $scope.user = angular.copy(User.currentUser);

  $scope.updateProfile = function(user) {
    User.update(user);
  };

  $scope.cancelEdit = function() {
    $modalInstance.close();
  };

});
