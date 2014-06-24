angular.module( 'playfully', [
  // 'http-auth-interceptor',
  'ngCookies',
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'ui.router',
  'ui.bootstrap',
  'playfully.config',
  'auth',
  'user',
  'playfully.home',
  'playfully.login',
  'playfully.navbar',
  'playfully.courses',
  'playfully.support',
  'playfully.tutorial'
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

.run( function run ($rootScope, AuthService, AUTH_EVENTS, USER_ROLES) {

  $rootScope.$on('$stateChangeStart', function(event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (authorizedRoles && !AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
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
  function AppCtrl ( $scope, $rootScope, $log, $location, $state,
    $cookieStore, $translate, $modal, AuthService, UserService, USER_ROLES ) {

  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  $scope.isAuthenticated = AuthService.isAuthenticated;

  $scope._modalInstance = null;

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
    }
  });

  $scope.$on('auth:login-success', function(event, user) {
    $scope.currentUser = user;
    $cookieStore.put('loggedin', user.id);
  });

  $scope.$on('auth:logout-success', function(event) {
    $scope.currentUser = null;
    $cookieStore.remove('loggedin');
    $log.info('logout success event');
    $state.go('home');
  });

  $scope.$on('modal.show', function(event, modalConfig) {
    $scope._modalInstance = $modal.open(modalConfig);
  });

  $scope.$on('auth:not-authenticated', function(event) {
    $log.error('not authenticated event');
    $cookieStore.remove('loggedin');
    $state.go('home');
  });

  $scope.$on('auth:not-authorized', function(event) {
    $log.error('not authorized event');
  });


  // Hack to remember user when they reload / come back
  var tempId = $cookieStore.get('loggedin');
  if (tempId) {
    UserService.getById(tempId)
      .then(function(user) {
        $scope.currentUser = user;
      });
  }

});


