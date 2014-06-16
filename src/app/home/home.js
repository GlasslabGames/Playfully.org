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
.controller( 'HomeCtrl', function HomeController( $scope ) {

});


