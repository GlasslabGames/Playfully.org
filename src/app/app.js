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
  'reports',
  'checkSpec',
  'playfully.navbar',
  'playfully.home',
  'playfully.games',
  'playfully.instructor',
  'playfully.student',
  'playfully.register',
  'playfully.redeem',
  'playfully.checkSpec',
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
    abstract: true
    // Commented out because it seems to be redundant to the .run version.
    // resolve: ['Authorization', function(Authorization, $log) {
    //     return Authorization.authorize();
    //   }]
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

  .state('privacy', {
    url: '/privacy',
    views: {
      "main": {
        templateUrl: 'privacy/privacy.html'
      }
    },
    data:{ pageTitle: "Children's Privacy Policy" }

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

.factory('Authorization', function ($rootScope, $log, $state, $window, UserService, AuthService, AUTH_EVENTS) {
  return {
    authorize: function() {
      AuthService.isLoggedIn()
        .then(function(data) {
          // $window.alert("Logged in");
          // $window.alert(JSON.stringify(data));
          UserService.currentUser()
            .then(function(user) {
              $rootScope.$broadcast(AUTH_EVENTS.userRetrieved, user);

              if ($rootScope.toState) {
                if ($rootScope.toState.url == '/' && user && user.role) {
                  $state.go(user.role + 'Dashboard');
                }

                var authorizedRoles = $rootScope.toState.data.authorizedRoles || null;

                if (authorizedRoles) {
                  if (AuthService.isAuthorized(authorizedRoles)) {
                    return true;
                  }
                  else {
                    event.preventDefault();
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                  }
                }
              }
            });


        }, function() {
          // $window.alert("Not logged in");
          if ($rootScope.toState.hasOwnProperty('data') &&
            $rootScope.toState.data.hasOwnProperty('authorizedRoles')) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          } else {
            return true;
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
  function($scope, $rootScope, $state, $log, $modal, $timeout, $window, $location,
    ipCookie, UserService, AuthService, AUTH_EVENTS) {

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
      return $timeout(function () {
        $location.path('/');
      }, 100);
    });

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      $state.go('home');
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      $state.go('home');
    });

});

