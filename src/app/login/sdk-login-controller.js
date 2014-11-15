angular.module('playfully.login-sdk', [])

.config(function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('sdkv2LoginOptions', {
            url: '/sdk/v2/game/:gameId/login',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login.html',
                    controller: 'sdkv2LoginCtrl'
                }
            }
        })
        .state('sdkv2LoginInstructor', {
            url: '/sdk/v2/game/:gameId/login/instructor',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-instructor.html',
                    controller: 'sdkv2LoginCtrl'
                }
            }
        })
        .state('sdkv2LoginStudentSuccess', {
            url: '/sdk/v2/game/:gameId/login/student-success',
            parent: 'site',
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
        .state('sdkv2LoginInstructorSuccess', {
            url: '/sdk/v2/game/:gameId/login/instructor-success',
            parent: 'site',
            data: {hideWrapper: true, authorizedRoles: ['instructor', 'admin']},
            views: {
                'main@': {
                    templateUrl: 'login/v2/sdk-login-instructor-success.html',
                    controller: 'sdkv2LoginInstructorSuccessCtrl'
                }
            }
        })
        .state('sdkv2PasswordPrompt', {
            url: '/sdk/v2/login/confirm',
            parent: 'site',
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
        .state('sdkv2LoginResetData', {
            url: '/sdk/v2/login/resetdata',
            parent: 'site',
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
        .state('sdkv2Logout', {
            parent: 'site',
            url: '/sdk/v2/logout',
            onEnter: function ($state, AuthService) {
                AuthService.logout().then(function () {
                    $state.transitionTo('sdkv2LoginOptions');
                });
            }
        });
})

.controller('sdkv2LoginCtrl',
    function ($scope, $rootScope, $log, $window, $state, $stateParams, AuthService, AUTH_EVENTS, THIRD_PARTY_AUTH) {
        $scope.gameId = $stateParams.gameId;
        $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
        $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;
        $scope.credentials = {username: '', password: ''};
        $scope.authError = null;

        $scope.login = function (credentials) {
            $scope.authError = null;
            $scope.loginForm.isSubmitting = true;
            AuthService.login(credentials)
                .then(function (result) {
                    $scope.loginForm.isSubmitting = false;
                    if (result.data.role === "student") {
                        $state.go('sdkv2LoginStudentSuccess', {gameId: $stateParams.gameId});
                    } else {
                        $state.go('sdkv2LoginInstructorSuccess', {gameId: $stateParams.gameId});
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
            $state.transitionTo('sdkv2LoginOptions');
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