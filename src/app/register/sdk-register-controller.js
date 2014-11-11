angular.module('playfully.register-sdk', ['register.const'])

.config(function config($stateProvider, $urlRouterProvider) {

        $stateProvider.state('sdkv2RegisterOptions', {
            url: '/sdk/v2/game/:gameId/register',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'register/v2/sdk-register-options.html',
                    controller: 'sdkv2RegisterOptionsModalCtrl'
                }
            }
        })
        .state('sdkv2RegisterInstructor', {
            url: '/sdk/v2/game/:gameId/register/instructor',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'register/v2/sdk-register-instructor.html',
                    controller: 'sdkv2RegisterInstructorCtrl'
                }
            }
        })
        .state('sdkv2RegisterStudent', {
            url: '/sdk/v2/game/:gameId/register/student',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'register/v2/sdk-register-student.html',
                    controller: 'sdkv2RegisterStudentModalCtrl'
                }
            }
        })
        .state('sdkv2RegisterStudentSuccess', {
            url: '/sdk/register/student/success',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'register/v2/sdk-register-student-success.html',
                    controller: 'sdkv2RegisterStudentModalCtrl'
                }
            }
        })
        .state('sdkv2RegisterPlayfullyInfo', {
            url: '/sdk/v2/game/:gameId/register/playfully/info',
            parent: 'site',
            data: {hideWrapper: true},
            views: {
                'main@': {
                    templateUrl: 'register/v2/sdk-register-playfully-info.html',
                    controller: function ($scope, $stateParams, $window) {
                        $scope.gameId = $stateParams.gameId;
                        $scope.goToLink = function(link) {
                            $window.location.search = 'openURL={'+link+'}';
                        };
                    }
                }
            }
        });
})
.controller('sdkv2RegisterOptionsModalCtrl', function ($scope, $stateParams, THIRD_PARTY_AUTH) {
    $scope.gameId = $stateParams.gameId;
    $scope.isEdmodoActive = THIRD_PARTY_AUTH.edmodo;
    $scope.isiCivicsActive = THIRD_PARTY_AUTH.icivics;

})
.controller('sdkv2RegisterInstructorCtrl',
    function ($scope, $log, $rootScope, $state, $window, UserService, Session, AUTH_EVENTS, ERRORS, REGISTER_CONSTANTS) {
        var user = null;

        $scope.account = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            state: null,
            school: '',
            confirm: '',
            role: 'instructor',
            acceptedTerms: false,
            newsletter: true,
            errors: [],
            isRegCompleted: false
        };

        $scope.states = REGISTER_CONSTANTS.states;

        $scope.register = function (account) {
            $scope.regForm.isSubmitting = true;
            if (account.firstName && account.firstName.indexOf(' ') > -1) {
                firstName = account.firstName.substr(0, account.firstName.indexOf(' '));
                $scope.account.lastName = account.firstName.substr(account.firstName.indexOf(' ') + 1);
                $scope.account.firstName = firstName;
            }
            UserService.register(account)
                .success(function (data, status, headers, config) {
                    user = data;
                    Session.create(user.id, user.role, data.loginType);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = true;
                })
                .error(function (data, status, headers, config) {
                    $log.error(data);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = false;
                    if (data.error) {
                        $scope.account.errors.push(data.error);
                    } else {
                        $scope.account.errors.push(ERRORS['general']);
                    }
                });
        };


        $scope.finish = function () {
            if (user !== null) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
            }
        };
        $scope.goToLink = function (link) {
            $window.location.search = 'openURL={' + link + '}';
        };
        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
        };

})
.controller('sdkv2RegisterStudentModalCtrl',
    function ($scope, $log, $rootScope, $state, $stateParams, $window, UserService, CoursesService, Session, AUTH_EVENTS, ERRORS) {
        var user = null;

        $scope.confirmation = {
            code: null,
            errors: []
        };

        $scope.course = null;

        $scope.account = null;

        $scope.gameId = $stateParams.gameId.toUpperCase();

        var _blankAccount = {
            username: '',
            password: '',
            confirm: '',
            firstName: '',
            lastName: '',
            role: 'student',
            regCode: null,
            errors: [],
            isRegCompleted: false
        };

        $scope.closeWindow = function () {
            $window.location.search = 'action=SUCCESS';
        };

        $scope.confirmCode = function (conf) {
            $scope.regInit.isSubmitting = true;
            $scope.confirmation.errors = [];
            if ($scope.currentUser) {

            }
            // check if code is valid
            CoursesService.verifyCode(conf.code)
                .then(function (resp) {
                    $scope.regInit.isSubmitting = false;
                    $scope.course = resp.data;
                }, function (resp) {
                    $scope.regInit.isSubmitting = false;
                    if (resp.data.error) {
                        $scope.confirmation.errors.push(resp.data.error);
                    }
                })
                .then(function () {
                    // Check if current game is in course
                    CoursesService.verifyGameInCourse($scope.course.id, $scope.gameId)
                        .then(function () {
                            $scope.account = angular.copy(_blankAccount);
                            $scope.account.regCode = $scope.confirmation.code;
                        },
                        function (result) {
                            $scope.regInit.isSubmitting = false;
                            if (result.data && result.data.error) {
                                $scope.confirmation.errors.push(result.data.error);
                            }
                        });
                });
        };
        $scope.registerV2 = function (account) {
            $scope.regForm.isSubmitting = true;
            UserService.register(account)
                .success(function (data, status, headers, config) {
                    $scope.regForm.isSubmitting = false;
                    user = data;
                    Session.create(user.id, user.role, data.loginType);
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);

                    if ($state.current.data.hideWrapper) {
                        $state.go('sdkv2LoginStudentSuccess', {gameId: $scope.gameId});
                    }
                })
                .error(function (data, status, headers, config) {
                    $log.error(data);
                    $scope.regForm.isSubmitting = false;
                    $scope.account.isRegCompleted = false;
                    if (data.error) {
                        $scope.account.errors.push(data.error);
                    } else {
                        $scope.account.errors.push(ERRORS['general']);
                    }
                });
        };
});