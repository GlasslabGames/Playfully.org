angular.module( 'playfully.home', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    parent: 'site',
    url: '/',
    views: {
      'main@': {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.html'
      }
    },
    data:{
      pageTitle: 'Home',
    }
  });
})

.controller( 'HomeCtrl', function HomeController( $scope, $log, CoursesService, Session) {


  $scope.showTutorial = function() {
    if (Session.userRole == 'instructor') {
      $scope.$emit('modal.show', {
        templateUrl: 'tutorial/tutorial.html',
        controller: 'TutorialModalCtrl',
        size: 'lg'
      });
    } else {
      return false;
    }
  };


});


