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

.controller( 'HomeCtrl', function ( $scope, $log, Session) {
  

});


