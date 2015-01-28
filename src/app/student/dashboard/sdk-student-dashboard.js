angular.module('student.dashboard-sdk', [
    'ui.router'
])

.config(function config($stateProvider) {

    $stateProvider.state('sdk.sdkv2EnrollInCourse', {
        url: '/v2/game/:gameId/enroll',
        resolve: {
            games: function (GamesService) {
                return GamesService.active('details');
            },
            courses: function (CoursesService) {
                return CoursesService.getEnrollments();
            }
        },
        views: {
            'main@': {
                controller: 'sdkv2EnrollInCourseModalCtrl',
                templateUrl: 'student/dashboard/v2/sdk-course-enroll.html'
            }
        },
        data: {
            hideWrapper: true,
            authorizedRoles: ['student']
        }
    });
})
.controller('sdkv2EnrollInCourseModalCtrl',
    function ($scope, $rootScope, $state, $stateParams, $log, $timeout, courses, CoursesService, $history) {
        $scope.gameId = $stateParams.gameId.toUpperCase();
        $scope.verification = {
            code: null,
            errors: []
        };
        $scope.goBackState = function () {
            $history.back();
        };
        $scope.enroll = function (verification) {
            $scope.enrollment = null;
            $scope.verification.errors = [];
            var msg;
            var userNotEnrolledInCourse = true;
            var enrolledCourse = null;
            // Check whether the user is already enrolled
            if (courses.length) {
                angular.forEach(courses, function (course) {
                    if (verification.code === course.code) {
                        userNotEnrolledInCourse = false;
                        enrolledCourse = course;
                    }
                });
            }
            if (userNotEnrolledInCourse) {
                // Check if verification code is valid
                CoursesService.verifyCode(verification.code)
                    .then(function (result) {
                        $scope.enrollment = result.data;
                    }, function (result) {
                        if (result.data.error) {
                            $scope.verification.errors.push(result.data.error);
                        }
                    })
                    .then(function () {
                        // Check if current game is in course
                        CoursesService.verifyGameInCourse($scope.enrollment.id, $scope.gameId)
                            .then(function (courseInfo) {
                                CoursesService.enroll(verification.code)
                                    .then(function () {
                                        $state.go('sdk.sdkv2LoginStudentSuccess', {gameId: $scope.gameId});
                                    });
                            },
                            function (result) {
                                if (result.data && result.data.error) {
                                    $scope.verification.errors.push(result.data.error);
                                }
                            });
                    });
            } else {
                msg = "You have already enrolled in this course: " + enrolledCourse.title;
                $scope.verification.errors.push(msg);
            }
        };
    });