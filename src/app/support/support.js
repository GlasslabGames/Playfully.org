angular.module( 'playfully.support', ['ui.router'])

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
  })
  .state('root.privacy', {
    url: 'privacy',
    views: {
      'main': {
        templateUrl: 'support/privacy.html'
      }
    },
    data:{ pageTitle: "Children's Privacy Policy" }
  })
  .state('root.terms-of-service', {
    url: 'terms-of-service',
    views: {
      'main': {
        templateUrl: 'support/terms-of-service.html'
      }
    },
    data:{ pageTitle: "Terms of Service" }
  })
  .state('root.eula', {
    url: 'eula',
    views: {
      'main': {
        templateUrl: 'support/eula.html'
      }
    },
    data:{ pageTitle: "End User License Agreement" }
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