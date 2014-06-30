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
  'courses',
  'games',
  'playfully.home',
  'playfully.dashboard-instructor',
  'playfully.dashboard-student',
  'playfully.login',
  'playfully.register',
  'playfully.navbar',
  'playfully.courses',
  'playfully.support',
  'playfully.tutorial'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('site', {
    abstract: true,
    resolve: ['Authorization', function(Authorization) {
        return Authorization.authorize();
      }]
  });
})

.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
})

.factory('Authorization', function ($rootScope, $state, UserService, AuthService, AUTH_EVENTS) {
  return {
    authorize: function() {
      return UserService.currentUser()
        .then(function(user) {
          $rootScope.$broadcast(AUTH_EVENTS.userRetrieved, user);

          if ($rootScope.toState) {
            if ($rootScope.toState.url == '/') {
              if (user && user.role) {
                $state.transitionTo('dashboard-' + user.role);
              }
            }

            var isAuthenticated = UserService.isAuthenticated();
            var authorizedRoles = $rootScope.toState.data.authorizedRoles;

            if (authorizedRoles && !AuthService.isAuthorized(authorizedRoles)) {
              event.preventDefault();
              if (isAuthenticated) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
              } else {
                //user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
              }
            }
          }
        });
    }
  };
})

.run(function($rootScope, Session, Authorization, AuthService, UserService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    $rootScope.toState = next;
    Authorization.authorize();
  });
})


.controller('AppCtrl', function($scope, $rootScope, $state, $log, $modal, $cookies,
      UserService, AuthService, AUTH_EVENTS) {

  $scope.currentUser = null;
  $scope.isAuthenticated = UserService.isAuthenticated;
  $scope.isAuthorized = AuthService.isAuthorized;

  $scope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
      }
  });

  $scope.$on('modal.show', function(event, modalConfig) {
    $scope._modalInstance = $modal.open(modalConfig);
  });

  $scope.$on(AUTH_EVENTS.loginSuccess, function(event, user) {
    $scope.currentUser = user;
    $state.go('home', {}, { reload: true });
  });

  $scope.$on(AUTH_EVENTS.userRetrieved, function(event, user) {
    $scope.currentUser = user; 
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function(event) {
    $scope.currentUser = null;
    $state.go('home', {}, { reload: true });
  });

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    $state.go('home');
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    $state.go('home');
  });

});

