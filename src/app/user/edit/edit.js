angular.module('user.edit', [])

.controller('EditFormModalCtrl',
  function EditFormModalController( $scope, $log, $rootScope, $modalInstance, UserService, Session) {

  UserService.getById(Session.userId).then(function(user) {
    $scope.user = angular.copy(user);
  }, function(error) {
    $log.error(error);
  });


  $scope.updateProfile = function(user) {
    UserService.update(user)
      .success(function(data, status, headers, config) {
        $log.info(data);
      })
      .error(function(data, status, headers, config) {
        $log.error(data);
      });
  };

  $scope.cancelEdit = function() {
    $modalInstance.close();
  };

});
