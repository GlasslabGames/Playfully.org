angular.module('playfully.login-sdk', [])

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
            data: {hideWrapper: true, authorizedRoles: ['instructor', 'admin']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-instructor-success.html',
                    controller: 'sdkv2LoginInstructorSuccessCtrl'
                }
            }
        })
        .state('sdk.sdkv2PasswordPrompt', {
            url: '/v2/login/confirm',
            data: {hideWrapper: true, authorizedRoles: ['student', 'instructor', 'admin']},
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
            data: {hideWrapper: true, authorizedRoles: ['student', 'instructor', 'admin']},
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
            onEnter: function ($state, AuthService) {
                AuthService.logout().then(function () {
                    $state.transitionTo('sdk.sdkv2LoginOptions');
                });
            }
        });
})

.controller('sdkv2LoginCtrl',
    function ($scope, $rootScope, $log, $window, $state, $stateParams, AuthService, AUTH_EVENTS, THIRD_PARTY_AUTH, $history) {
        $scope.gameId = $stateParams.gameId;
        $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
        $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;
        $scope.credentials = {username: '', password: ''};
        $scope.authError = null;

        $scope.goBackState = function () {
            $history.back();
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
})
.controller('sdkv2LoginStudentSuccessCtrl',
    function ($scope, $window, $log, $stateParams, courses) {
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
        };
})
.controller('sdkv2LoginInstructorSuccessCtrl',
    function ($scope, $state, $rootScope, $window, $log) {
        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
        };
        $scope.goToLink = function (link) {
            //$window.location.search = 'action=URL';
            $window.open(link);
        };
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