angular.module( 'playfully', [
  'ngSanitize',
  'ipCookie',
  'ga',
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'ui.router',
  'ui.bootstrap',
  'playfully.config',
  'auth',
  'user',
  'games',
  'playfully.navbar',
  'playfully.home',
  'playfully.instructor',
  'playfully.student',
  'playfully.register',
  'playfully.login',
  'playfully.profile',
  'playfully.password-reset',
  'playfully.support'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('site', {
    abstract: true,
    resolve: ['Authorization', function(Authorization) {
        return Authorization.authorize();
      }]
  })

  .state( 'sdk', {
    url: '/sdk',
    onEnter: function($log, $location, ipCookie) {
      var search = $location.search();

      // if cookie, set cookie
      if( search.cookie && search.cookie.length > 0) {
        ipCookie('connect.sid', search.cookie, { path: '/' });
      }

      // if redirect, set location path
      if( search.redirect && search.redirect.length > 0) {
        $location.search({});
        $location.path(search.redirect);
      }
    }
  })

  .state( 'modal', {
    abstract: true,
    parent: 'home',
    url: '',
    onEnter: function($rootScope, $modal, $state) {
      $rootScope.modalInstance = $modal.open({
        template: '<div ui-view="modal"></div>',
        size: 'sm'
      });

      $rootScope.modalInstance.result.finally(function() {
        $state.go('home');
      });
    }
  });
})

.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/i18n/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
})

.factory('Authorization', function ($rootScope, $log, $state, UserService, AuthService, AUTH_EVENTS) {
  return {
    authorize: function() {
      return UserService.currentUser()
        .then(function(user) {
          $rootScope.$broadcast(AUTH_EVENTS.userRetrieved, user);

          if ($rootScope.toState) {
            if ($rootScope.toState.url == '/' && user && user.role) {
              $state.transitionTo(user.role + 'Dashboard');
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

.run(function($rootScope, ipCookie, $log, $state, $urlRouter, Session, Authorization, AuthService, UserService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    if (next.name !== 'logout') {
      if (next && next.url && next.url.indexOf('sdk') > -1) {
        ipCookie('inSDK', 'true', { path: '/' });
      }
      $rootScope.toState = next;
      Authorization.authorize();
    }
  });
})

.controller('AppCtrl',
  function($scope, $rootScope, $state, $log, $modal, ipCookie,
      UserService, AuthService, AUTH_EVENTS) {

    $rootScope.state = $state;
    $scope.currentUser = null;
    $scope.isAuthenticated = UserService.isAuthenticated;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        var hasPageTitle = (angular.isDefined(toState.data) &&
          angular.isDefined(toState.data.pageTitle));
        if ( hasPageTitle ) {
          $scope.pageTitle = toState.data.pageTitle + ' | Playfully' ;
        }
        if (angular.isDefined(toState.data) &&
          angular.isDefined(toState.data.hideWrapper)) {
          $scope.hideWrapper = toState.data.hideWrapper;
        }
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, function(event, user) {
      $scope.currentUser = user;
      if ($rootScope.modalInstance) {
        $rootScope.modalInstance.close();
      }
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

