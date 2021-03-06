angular.module('playfully.login-sdk', ['sdk-js-support'])

.config(function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('sdk.sdkv2LoginOptions', {
            url: '/v2/game/:gameId/login',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login.html',
                    controller: 'sdkv2LoginCtrl'
                }
            }
        })
        .state('sdk.sdkv2LoginInstructor', {
            url: '/v2/game/:gameId/login/instructor',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-instructor.html',
                    controller: 'sdkv2LoginCtrl'
                }
            }
        })
        .state('sdk.sdkv2LoginStudentSuccess', {
            url: '/v2/game/:gameId/login/student-success',
            data: {hideWrapper: true, authorizedRoles: ['student']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-student-success.html',
                    controller: 'sdkv2LoginStudentSuccessCtrl'
                }
            },
            resolve: {
                courses: function (CoursesService) {
                    return CoursesService.getEnrollments();
                }
            }
        })
        .state('sdk.sdkv2LoginInstructorSuccess', {
            url: '/v2/game/:gameId/login/instructor-success',
            data: {hideWrapper: true, authorizedRoles: ['instructor', 'admin', 'reseller']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-instructor-success.html',
                    controller: 'sdkv2LoginInstructorSuccessCtrl'
                }
            }
        })
        .state('sdk.sdkv2PasswordPrompt', {
            url: '/v2/login/confirm',
            data: {hideWrapper: true, authorizedRoles: ['student', 'instructor', 'admin', 'reseller']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-password-prompt.html',
                    controller: 'sdkv2LoginConfirmCtrl'
                }
            },
            resolve: {
                currentUser: function (UserService) {
                    return UserService.currentUser();
                }
            }
        })
        .state('sdk.sdkv2LoginResetData', {
            url: '/v2/login/resetdata',
            data: {hideWrapper: true, authorizedRoles: ['student', 'instructor', 'admin', 'reseller']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-resetdata-prompt.html',
                    controller: 'sdkv2LoginConfirmCtrl'
                }
            },
            resolve: {
                currentUser: function (UserService) {
                    return UserService.currentUser();
                }
            }
        })
        .state('sdk.sdkv2Logout', {
            url: '/v2/logout',
            onEnter: function ($state, $window, AuthService) {
                AuthService.logout().then(function () {
                    $window.location.search = 'action=LOGGEDOUT';
                });
            }
        });
})

.controller('sdkv2LoginCtrl',
    function ($scope, $rootScope, $log, $window, $state, $stateParams, AuthService, SdkSupportService, THIRD_PARTY_AUTH, $previousState) {
        $scope.gameId = $stateParams.gameId;
        $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
        $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;
        $scope.credentials = {username: '', password: ''};
        $scope.authError = null;
        $scope.isInJsSdkIframe = SdkSupportService.isInJsSdkIframe();
        $scope.closeSdkIframe = function () {
            SdkSupportService.closeIframe();
        };

        $scope.goBackState = function () {
            $previousState.go();
        };

        $scope.login = function (credentials) {
            $scope.authError = null;
            $scope.loginForm.isSubmitting = true;
            AuthService.login(credentials)
                .then(function (result) {
                    $scope.loginForm.isSubmitting = false;
                    if (result.data.role === "student") {
                        $state.go('sdk.sdkv2LoginStudentSuccess', {gameId: $stateParams.gameId});
                    } else {
                        $state.go('sdk.sdkv2LoginInstructorSuccess', {gameId: $stateParams.gameId});
                    }

                }, function (result) {
                    $log.error(result);
                    $scope.loginForm.isSubmitting = false;
                    $scope.authError = result.data.error;
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
                });

        };

        $scope.logInWithEdmodo = function () {
            $window.location.href = '/auth/edmodo/login';
        };
        
        $scope.goBackIncludeGameId = function() {
            $state.go('sdk.sdkv2LoginOptions', {gameId: $stateParams.gameId});
        };
})
.controller('sdkv2LoginStudentSuccessCtrl',
    function ($scope, $window, $log, $stateParams, SdkSupportService, courses) {
        if ($stateParams.gameId) {
            $scope.gameId = $stateParams.gameId.toUpperCase();
            // filters for courses that contains the current game.
            $scope.courses = _.filter(courses, function (course) {
                return _.any(course.games, function (game) {
                    return game.id === $scope.gameId;
                });
            });
            if ($scope.courses.length) {
                $scope.hasCourses = true;
                // show most recently added courses
                $scope.courses.reverse();
            }
        }
        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
            SdkSupportService.closeIframe();
        };
})
.controller('sdkv2LoginInstructorSuccessCtrl',
    function ($scope, $state, $rootScope, $window, SdkSupportService, $log) {
        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
        };
        $scope.goToLink = function (link) {
            //$window.location.search = 'action=URL';
            $window.open(link);
        };
        SdkSupportService.closeIframe();
})
.controller('sdkv2LoginConfirmCtrl',
    function ($scope, $rootScope, $log, $state, $window, currentUser, AuthService, AUTH_EVENTS) {
        $scope.resetProgressConfirm = false;
        if (!currentUser) {
            $state.transitionTo('sdk.sdkv2LoginOptions');
        } else {
            $scope.credentials = {
                username: currentUser.username,
                password: null
            };
        }
        $scope.login = function (credentials) {
            $scope.authError = null;
            AuthService.login(credentials).then(function (result) {
                if ($state.current.data.hideWrapper) {
                    $window.location.search = 'action=SUCCESS';
                } else {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result.data);
                }
            }, function (result) {
                $log.error(result);
                $scope.authError = result.data.error;
                $rootScope.$broadcast(AUTH_EVENTS.loginFailure);
            });
        };
});