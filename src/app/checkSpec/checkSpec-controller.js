angular.module( 'playfully.checkSpec', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'checkSpec', {
    url: '/checkSpec',
    views: {
      "main": {
        controller: 'CheckCtrl',
        templateUrl: 'checkSpec/checkSpec.html'
      }
    }
  });
})

.controller( 'CheckCtrl', function ( $scope ) {
    console.log('checkSpec');

});


