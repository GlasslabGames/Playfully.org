angular.module( 'playfully', [
  'ngOrderObjectBy',
  'ngSanitize',
  'ipCookie',
  'ga',
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'angularMoment',
  'ui.router',
  'ui.bootstrap',
  'playfully.config',
  'auth',
  'user',
  'games',
  'reports',
  'checkSpec',
  'research',
  'gl-enter',
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
  'playfully.support',
  'playfully.verify-email',
  'playfully.login-sdk',
  'playfully.register-sdk',
  'student.dashboard-sdk'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
  });
  $locationProvider.hashPrefix('!');

  $urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.path();
    var normalized = path.toLowerCase();

    if (path != normalized) {
      //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
      $location.replace().path(normalized);
    }
  });

  $urlRouterProvider.otherwise('/');
  $stateProvider.state('site', { abstract: true })

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

  // survey redirects for MGO (AA)
  .state('survey_aa_pre', {
    url: '/aa-pre',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/MGO-Pre-Survey";
    }
  })
  .state('survey_aa_post', {
    url: '/aa-post',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/84e668acebce";
    }
  })
  .state('survey_aa_feed', {
    url: '/aa-feed',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/Argubot-Feedback";
    }
  })
  .state('survey_aapre', {
    url: '/aapre',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/MGO-Pre-Survey";
    }
  })
  .state('survey_aapost', {
    url: '/aapost',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/84e668acebce";
    }
  })
  .state('survey_aafeed', {
    url: '/aafeed',
    onEnter: function($window) {
      $window.location = "http://sgiz.mobi/s3/Argubot-Feedback";
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

.config(function($httpProvider) {
  //initialize get if not there
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  //disable IE ajax request caching
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  dt = new Date(1999, 12, 31);
  $httpProvider.defaults.headers.get['If-Modified-Since'] = dt;
})

.config(function ($translateProvider) {

  $translateProvider.translations('en', {
    // prevents flash of untranslated content
  });
  $translateProvider.useStaticFilesLoader({
    prefix: '/assets/i18n/locale-',
    suffix: '.json'
  });
  // CT: changed en to english because translateProvider does not reload a language if it has already been loaded
  $translateProvider.preferredLanguage('english');



})

.factory('Authorization', function ($rootScope, $log, $state, $window, UserService, AuthService, AUTH_EVENTS) {
  return {
    authorize: function() {
      AuthService.isLoggedIn()
        .then(function() {
          UserService.currentUser()
            .then(function(user) {
              $rootScope.$broadcast(AUTH_EVENTS.userRetrieved, user);

              if ($rootScope.toState) {
                if ($rootScope.toState.url == '/' && user && user.role) {
                  if (user.role == 'instructor' ||
                      user.role == 'manager' ||
                      user.role == 'developer'
                    ) {
                    // TODO: remove this later when we have sowo for icivics login
                    if(user.loginType == 'icivics'){
                      $state.go('courses.active');
                    } else {
                      $state.go('instructorDashboard.default');
                    }
                  } else {
                    $state.go('studentDashboard');
                  }
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
    ipCookie, UserService, GamesService, AuthService, AUTH_EVENTS) {

    $rootScope.state = $state;
    $rootScope.allGames = null;
    $scope.currentUser = null;
    $scope.isAuthenticated = UserService.isAuthenticated;
    $scope.isAuthenticatedButNot = AuthService.isAuthenticatedButNot;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isSSOLogin = UserService.isSSOLogin;


    if (!$rootScope.allGames) {
      GamesService.all('minimal').then(function(data) {
        $rootScope.allGames = data;
      });
    }

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

    $scope.truncateUsername = function (username) {
      if (username.length > 40) {
        var part1 = username.substring(0, 19);
        var part2 = username.substring(username.length-19, username.length);
        return part1 + '…' + part2;
      } else {
        return username;
      }
    };


    // Hack to cause popovers to hide when user clicks outside of them.
    angular.element(document.body).bind('click', function (e) {
      var popups = document.querySelectorAll('*[popover]');
      if (popups) {
        angular.forEach(popups, function(popup) {
          var popupElem = angular.element(popup);
          var content, arrow;
          if (popupElem.next() && popupElem.next().length) {
            content = popupElem.next()[0].querySelector('.popover-content');
            arrow = popupElem.next()[0].querySelector('.arrow');
          }
          if (popup != e.target && e.target != content && e.target != arrow) {
            if (popupElem.next().hasClass('popover')) {
              popupElem.next().remove();
              popupElem.scope().tt_isOpen = false;
            }
          }
        });
      }
    });

});

