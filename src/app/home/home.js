angular.module( 'playfully.home', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

/**
* This is the controller for the Playfully.org home page
*
* @class HomeCtrl
* @constructor
*/
.controller( 'HomeCtrl', function HomeController( $scope, $log, User ) {
  $scope.currentUser = User.currentUser;
  $scope.currentRole = null;


  $scope.showTutorial = function() {
    if (User.currentUser.role == 'instructor') {
      $scope.$emit('modal.show', {
        templateUrl: 'tutorial/tutorial.html',
        controller: 'TutorialModalCtrl',
        size: 'lg'
      });
    } else {
      return false;
    }
  };

  $scope.$on('', function() {
    $scope.currentUser = null;
    $scope.currentRole = null;

  });

  /* TODO: can't have this in every controller. */
  $scope.$watch(function() {
    return User.currentUser;
  }, function(currentUser) {
    $scope.currentUser = currentUser;
    if (currentUser) {
      $scope.currentRole = currentUser.role;
    } else {
      $scope.currentRole = null;
    }
  });
});


