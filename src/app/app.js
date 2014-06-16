angular.module( 'playfully', [
  'templates-app',
  'templates-common',
  'ui.router',
  'ui.bootstrap',
  'playfully.home',
  'playfully.navbar',
  'user'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run (UserService) {
  // In case they are still logged in from previous session.
  UserService.requestCurrentUser();
})

/**
* This is the root controller for the application
*
* @class AppCtrl
* @constructor
*/
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
    }
  });


});


