angular.module('playfully.tutorial', [])

.controller('TutorialModalCtrl',
  function TutorialModalController( $scope, $log, $rootScope, $modalInstance, User ) {



  $scope.close = function() {
    $modalInstance.close();
  };

});
