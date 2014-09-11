angular.module( 'playfully.checkSpec', [
  'ui.router',
  'checkSpec'
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

.controller( 'CheckCtrl', function ( $scope, ConfigRsrc, DetectionSvc ) {
    console.log('Detection:', DetectionSvc.OS);
    console.log('Config:', ConfigRsrc.get());
    console.log('checkSpec');

});


