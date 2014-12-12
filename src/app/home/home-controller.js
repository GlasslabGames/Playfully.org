angular.module( 'playfully.home', ['ui.router'])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'root.home', {
    url: '',
    views: {
      'main@': {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.html'
      }
    },
    data:{
      authorizedRoles: ['instructor', 'student', 'manager', 'admin'],
      pageTitle: 'Home'
    }
  });
})

.controller( 'HomeCtrl', function ( $scope, $location, $log, $http, $window, ipCookie, Session) {

  $scope.subEmail = "";
  $scope.showSubscribeMessage = false;
  $scope.subscribeMessage = "";
  $scope.subscribe = function() {
    if( $scope.subEmail &&
        $scope.subEmail.length > 1) {
      $scope.showSubscribeMessage = true;
      $scope.subscribeMessage = "Sending...";
      $http.post('/api/v2/auth/newsletter/subscribe', {
        email: $scope.subEmail
      })
        .success(function() {
          $scope.subscribeMessage = "Thank you for Subscribing!";
        })
        .error(function(data) {
          $log.error(data);
        });
    }
  };

  $scope.go = function(url){
    $location.path(url);
  };

  $http.get('/api/v2/data/eventsCount')
    .success(function(data) {
      $scope.eventCount = data.eventCount;
    })
    .error(function(data) {
      $log.error(data); 
    });

});


