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

.controller( 'HomeCtrl', function ( $scope, $log, $http, $window, ipCookie, Session) {

  $http.get('/api/v2/data/eventsCount')
    .success(function(data) {
      $scope.eventCount = data.eventCount;
    })
    .error(function(data) {
      $log.error(data); 
    });

});


