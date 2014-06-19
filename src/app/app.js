angular.module( 'playfully', [
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'ui.router',
  'ui.bootstrap',
  'playfully.home',
  'playfully.navbar',
  'playfully.support',
  'user'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.config( function translateConfig ( $translateProvider ) {

    $translateProvider.useStaticFilesLoader({
      prefix: '/assets/i18n/locale-',
      suffix: '.json'
    });
    
    $translateProvider.preferredLanguage('en');
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
/**
 * Home controller.
 * @class AppCtrl
 * @param {!angular.Scope} $scope
 * @constructor
 * @ngInject
 * @export
 */
.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $translate ) {

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
    }
  });


});


