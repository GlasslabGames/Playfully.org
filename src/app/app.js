angular.module( 'playfully', [
  'angular-progress-arc',
  'ngOrderObjectBy',
  'ngSanitize',
  'ipCookie',
  'ga',
  'templates-app',
  'templates-common',
  'pascalprecht.translate',
  'angularMoment',
  'ui.router',
  'ct.ui.router.extras',
  'ui.bootstrap',
  'playfully.config',
  'auth',
  'user',
  'games',
  'dash',
  'reports',
  'license',
  'checkSpec',
  'research',
  'util',
  'gl-enter',
  'gl-editable-text-popover',
  'gl-editable-text',
  'playfully.admin',
  'playfully.research',
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
  'student.dashboard-sdk',
  'playfully.developer',
  'playfully.subscribe',
  'playfully.manager'
])

.config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider, $provide) {

  $provide.decorator('$uiViewScroll', function ($delegate) {
     return function (uiViewElement) {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
     };
  });

  $stickyStateProvider.enableDebug(false);

  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
  });
  $locationProvider.hashPrefix('!');

  /*$urlRouterProvider.rule(function ($injector, $location) {

    if (path != normalized) {
      //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
      $location.replace().path(normalized);
    }
  });*/

  $urlRouterProvider.otherwise('/');


  $stateProvider.state('root', {
    url: '/',
    abstract: true,
    sticky: true
  });

  $stateProvider.state('modal', {
    abstract: true,
    onEnter: function ($modal, $previousState, $log) {
      // remember the previous state with memoName "modalInvoker"
      $previousState.memo("modalInvoker");
      $modal.open({
        template: '<div ui-view="modal"></div>',
        backdrop: 'static',
        size: 'sm',
        controller: function($modalInstance, $scope) {
          var isopen = true;
          $modalInstance.result.finally(function() {
            isopen = false;
            $previousState.go("modalInvoker"); // return to previous state
          });
          $scope.close = function () {
            $modalInstance.dismiss('close');
            $previousState.go("modalInvoker"); // return to previous state
          };
          $scope.$on("$stateChangeStart", function(evt, toState) {
            if (!toState.$$state().includes['modal']) {
              $modalInstance.dismiss('close');
            }
          });
        }
      });
    }
  });

  $stateProvider.state('modal-lg', {
    abstract: true,
    onEnter: function ($modal, $previousState, $log) {
      // remember the previous state with memoName "modalInvoker"
      $previousState.memo("modalInvoker");
      $modal.open({
        template: '<div ui-view="modal"></div>',
        backdrop: 'static',
        size: 'lg',
        controller: function($modalInstance, $scope) {
          var isopen = true;
          $modalInstance.result.finally(function() {
            isopen = false;
            $previousState.go("modalInvoker"); // return to previous state
          });
          $scope.close = function () {
            $modalInstance.dismiss('close');
            $previousState.go("modalInvoker"); // return to previous state
          };
          $scope.$on("$stateChangeStart", function(evt, toState) {
            if (!toState.$$state().includes['modal-lg']) {
              $modalInstance.dismiss('close');
            }
          });
        }
      });
    }
  });

  $stateProvider.state('modal-xlg', {
    abstract: true,
    onEnter: function ($modal, $previousState, $log) {
      // remember the previous state with memoName "modalInvoker"
      $previousState.memo("modalInvoker");
      $modal.open({
        template: '<div ui-view="modal"></div>',
        backdrop: 'static',
        windowClass: 'modal-xlg',
        size: 'lg',
        controller: function($modalInstance, $scope) {
          var isopen = true;
          $modalInstance.result.finally(function() {
            isopen = false;
            $previousState.go("modalInvoker"); // return to previous state
          });
          $scope.close = function () {
            $modalInstance.dismiss('close');
            $previousState.go("modalInvoker"); // return to previous state
          };
          $scope.$on("$stateChangeStart", function(evt, toState) {
            if (!toState.$$state().includes['modal-xlg']) {
              $modalInstance.dismiss('close');
            }
          });
        }
      });
    }
  });



  // $stateProvider.state('site', { abstract: true })

  $stateProvider.state( 'sdk', {
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
  // survey redirects for PRIMA
  .state('prima_survey_pre_a', {
    url: '/prima-survey/:type/:version',
    data: {
      authorizedRoles: ['student','instructor']
    },
    views: {
      'main@': {
        controller: function( $state, $window, currentUser ) {
          var linkMap = {
            "prea": "http://www.surveygizmo.com/s3/2067433/Prima-Beta-Pre-Test-FormA",
            "preb": "http://www.surveygizmo.com/s3/2077973/Prima-Beta-Post-Test-FormB-STAR",
            "posta": "http://www.surveygizmo.com/s3/2072348/Prima-Beta-Post-Test-FormA",
            "postb": "http://www.surveygizmo.com/s3/2077973/Prima-Beta-Post-Test-FormB-STAR",
            "feedback": "http://www.surveygizmo.com/s3/2048726/Prima-Game-Feedback-Survey"
          };

          if( currentUser ) {
            // Feedback survey
            if( $state.params.type === "feedback" ) {
              $window.open( linkMap[ $state.params.type ] + "?uid=" + currentUser.id, '_blank' );
              return;
            }

            // Student
            if( currentUser.role === 'student' ) {
              var version = "";
              if( currentUser.id % 2 ) {
                version = "a";
              }
              else {
                version = "b";
              }

              if( linkMap[ $state.params.type + version ] ) {
                $window.open( linkMap[ $state.params.type + version ] + "?uid=" + currentUser.id, '_blank' );
              }
            }
            // Instructor
            else {
              if( linkMap[ $state.params.type + $state.params.version ] ) {
                $window.open( linkMap[ $state.params.type + $state.params.version ] + "?uid=" + currentUser.id, '_blank' );
              }
            }
          }
        }
      }
    },
    resolve:  {
      currentUser: function(UserService) {
        return UserService.currentUser();
      }
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
                if ($rootScope.toState.name == 'root.home.default' && user && user.role) {
                  if (user.role == 'instructor' ||
                      user.role == 'manager' ||
                      user.role == 'developer'
                    ) {
                    $state.go('root.instructorDashboard.default');
                  } else {
                    $state.go('root.studentDashboard');
                  }
                }

                var authorizedRoles = ($rootScope.toState.data && $rootScope.toState.data.authorizedRoles) || null;

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

.run(function($rootScope, ipCookie, $log, $state, $urlRouter, $window, $location, Session, Authorization, AuthService, UserService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    if (next.name !== 'logout') {
      if (next && next.url && next.url.indexOf('sdk') > -1) {
        ipCookie('inSDK', 'true', { path: '/' });
      }
      $rootScope.toState = next;
      Authorization.authorize();
    }
  });
  
  // Google Analytics - Track current page w/i SPA
  $rootScope.$on('$stateChangeSuccess', function(event){
    if (!$window.ga) { return; }
    $window.ga('send', 'pageview', { page: $location.path() });
  });

})

.controller('AppCtrl',
  function($scope, $rootScope, $state, $stateParams, $log, $modal, $timeout, $window, $location,
    ipCookie, UserService, GamesService, AuthService, LicenseService, AUTH_EVENTS, EMAIL_VALIDATION_PATTERN, FEATURES, CHECKLIST, $previousState, STRIPE) {

    $rootScope.state = $state;
    $rootScope.allGames = null;
    $rootScope.currentUser = null;
    $scope.isAuthenticated = UserService.isAuthenticated;
    $scope.isAuthenticatedButNot = AuthService.isAuthenticatedButNot;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isSSOLogin = UserService.isSSOLogin;
    $scope.isLicenseOwner = LicenseService.isOwner;
    $scope.isTrial = LicenseService.isTrial;
    $scope.isPurchaseOrder = LicenseService.isPurchaseOrder;
    $scope.hasLicense = LicenseService.hasLicense;
    $scope.licenseExpirationDate = LicenseService.licenseExpirationDate;
    $rootScope.emailValidationPattern = EMAIL_VALIDATION_PATTERN;
    $rootScope.features = FEATURES;



    if (!$rootScope.allGames) {
      GamesService.all().then(function(data) {
        $rootScope.allGames = data;
      });
    }
    $scope.howItWorksPanel = {
      isCollapsed: true
    };
    $scope.closePanel = function() {
      $scope.howItWorksPanel.isCollapsed = !$scope.howItWorksPanel.isCollapsed;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };
    $scope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if( STRIPE.env === "live" ) {
          if (angular.isDefined(toState.data)) {
            if (angular.isDefined(toState.data.ssl)) {
                if (toState.data.ssl) {
                    if ($location.protocol() != 'https') {
                        event.preventDefault();
                        var toStateUrl = $state.href(toState.name, toParams);
                        $window.location.href = $window.location.origin.replace('http', 'https') + toStateUrl;
                    }
                }
            }
          }
        }
        if (angular.isDefined(toState.data)) {
              if (angular.isDefined(toState.data.redirects)) {
                  if ($rootScope.currentUser &&
                      $rootScope.currentUser.licenseStatus) {
                      var licenseStatus = LicenseService.hasLicense('type');
                      angular.forEach(toState.data.redirects, function (redirect) {
                          if (redirect.licenses &&
                              redirect.licenses.indexOf(licenseStatus) >= 0) {
                              // if role defined then follow rule, else just redirect
                              if (angular.isArray(redirect.roles &&
                                  redirect.roles.indexOf($rootScope.currentUser.roles) >= 0)) {
                                  event.preventDefault();
                                  $state.go(redirect.state);
                                  return;
                              } else {
                                  event.preventDefault();
                                  $state.go(redirect.state);
                                  return;
                              }
                          }
                      });
                  }
              }
          }
    });
    $scope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        if (!$scope.howItWorksPanel.isCollapsed) {
          $scope.howItWorksPanel.isCollapsed = true;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        var hasPageTitle = (angular.isDefined(toState.data) &&
          angular.isDefined(toState.data.pageTitle));
        if ( hasPageTitle ) {
          $scope.pageTitle = toState.data.pageTitle + ' | GlassLab Games' ;
        }
        if (angular.isDefined(toState.data)) {
            if (angular.isDefined(toState.data.hideWrapper)) {
                $scope.hideWrapper = toState.data.hideWrapper;
            }
            if (angular.isDefined(toState.data.reload) &&
                toState.data.reload) {
                $state.reload();
            }
        }
        if (angular.isDefined(fromState.data)) {
             if (angular.isDefined(fromState.data.reloadNextState) &&
                 fromState.data.reloadNextState) {
                     if (fromState.data.reloadNextState==='reload app') {
                     $window.location.reload();
                 } else {
                     $state.reload();
                 }
             }
        }
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, function(event, user) {
      $rootScope.currentUser = user;
      // Google Analytics
        if (user &&
            user.role === 'instructor') {
            if (user.licenseStatus) {
                if (user.licenseStatus === "pending") {
                    LicenseService.activateLicenseStatus().then(function () {
                        UserService.updateUserSession(function () {
                            if (user.licenseStatus === "pending") {
                                $state.go('modal.notify-invited-subscription');
                                return;
                            }
                        });
                    });
                    return;
                }
            }
            if (user.purchaseOrderLicenseStatus) {
                if (user.purchaseOrderLicenseStatus === "po-received") {
                    LicenseService.activateLicenseStatus().then(function () {
                        UserService.updateUserSession(function () {
                            if (user.purchaseOrderLicenseStatus === "po-received") {
                                $state.go('modal.notify-po-status', {purchaseOrderStatus: 'received'});
                                return;
                            }
                        });
                    });
                    return;
                }
                if (user.purchaseOrderLicenseStatus === "po-rejected") {
                    LicenseService.resetLicenseMapStatus().then(function() {
                        $state.go('modal.notify-po-status', {purchaseOrderStatus: 'rejected'});
                    });
                    return;
                }
            }
            if (user.isUpgradeTrial) {
                $state.go('modal.start-trial-subscription');
                return;
            }
        }
        // Google Analytics - User ID tracking
      if ($window.ga) { $window.ga("set", "dimension1", user.id); }
      /** Student login/register always redirects back to dashboard **/
      if (user.role==='student') {
        $previousState.forget('modalInvoker');
      }
      $state.go('root.home.default');
    });

    $scope.$on(AUTH_EVENTS.userRetrieved, function(event, user) {
      $rootScope.currentUser = user;
        if (user &&
            user.role === 'instructor') {
            if (user.licenseStatus) {
                if (user.licenseStatus === "pending") {
                    LicenseService.activateLicenseStatus().then(function () {
                        UserService.updateUserSession(function () {
                            if (user.licenseStatus === "pending") {
                                $state.go('modal.notify-invited-subscription');
                                return;
                            }
                        });
                    });
                    return;
                }
            }
            if (user.purchaseOrderLicenseStatus) {
                if (user.purchaseOrderLicenseStatus === "po-received") {
                    LicenseService.activateLicenseStatus().then(function () {
                        UserService.updateUserSession(function () {
                            if (user.purchaseOrderLicenseStatus === "po-received") {
                                $state.go('modal.notify-po-status', {purchaseOrderStatus: 'received'});
                                return;
                            }
                        });
                    });
                    return;
                }
                if (user.purchaseOrderLicenseStatus === "po-rejected") {
                    LicenseService.resetLicenseMapStatus().then(function () {
                        $state.go('modal.notify-po-status', {purchaseOrderStatus: 'rejected'});
                    });
                    return;
                }
            }
        }
    });

    $scope.$on(AUTH_EVENTS.logoutSuccess, function(event) {
      $rootScope.currentUser = null;
      return $timeout(function () {
        $state.go('root.home.default');
      }, 100);
    });

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      $state.go('root.home.default');
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      $state.go('root.home.default');
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

