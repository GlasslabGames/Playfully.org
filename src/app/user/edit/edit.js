angular.module('user.edit', [])

.controller('EditFormModalCtrl',
  function EditFormModalController( $scope, $log, $rootScope, $modalInstance, UserService, Session) {

  UserService.getById(Session.userId).then(function(user) {
    $scope.user = angular.copy(user);
  }, function(error) {
    $log.error(error);
  });


  // $scope.updateProfile = function(user) {
  //   User.update(user);
  // };

  $scope.cancelEdit = function() {
    $modalInstance.close();
  };

});
