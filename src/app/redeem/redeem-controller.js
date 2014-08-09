angular.module( 'playfully.redeem', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'redeem', {
    url: '/redeem',
    views: {
      "main": {
        controller: 'RedeemCtrl',
        templateUrl: 'redeem/redeem.html'
      }
    },
    data:{ pageTitle: 'Redeem' }
  });
})

.controller( 'RedeemCtrl', function ( $scope ) {


});


