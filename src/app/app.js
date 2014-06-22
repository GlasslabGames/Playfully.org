angular.module( 'playfully', [
  'http-auth-interceptor',
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'ui.router',
  'ui.bootstrap',
  'playfully.config',
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

.run( function run (User) {
  // In case they are still logged in from previous session.
  User.requestCurrentUser();
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
.controller( 'AppCtrl',
  function AppCtrl ( $scope, $rootScope, $location, $translate, $modal, User ) {

  $scope._modalInstance = null;

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
    }
  });

  $scope.$on('modal.show', function(event, data) {
    $scope._modalInstance = $modal.open(data);
  });


  $scope.$on('event:auth-loginRequired', function(event, data) {
    console.log("Event:");
    console.log(event);
    console.log("Data:");
    console.log(data);
    // UserService.showLogin();
  });


});


