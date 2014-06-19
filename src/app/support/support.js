angular.module( 'playfully.support', [
  'ui.router'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'support', {
    url: '/support',
    views: {
      "main": {
        controller: 'SupportCtrl',
        templateUrl: 'support/support.html'
      }
    },
    data:{ pageTitle: 'Support' }
  });
})

/**
* This is the controller for the Playfully.org home page
*
* @class SupportCtrl
* @constructor
*/
.controller( 'SupportCtrl', function SupportController( $scope ) {

  $scope.tabs = [
    { 
      title: "SimCityEDU", 
      content: "Content for SimCityEDU" },
    { 
      title: "MGO",
      content: "Content for MGO" 
    }];

});


