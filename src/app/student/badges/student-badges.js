angular.module('student.badges', [])

    .config(function config($stateProvider) {
        $stateProvider.state('root.studentBadges', {
            url: 'badges',
            views: {
                'main@': {
                    controller: 'BadgesStudentCtrl',
                    templateUrl: 'student/badges/student-badges.html'
                }
            },
            data: {
                pageTitle: 'Badges',
                authorizedRoles: ['student']
            },
            resolve: {
                badges: function (UserService) {
                    // Get badge list (status and badge data combined)
                    return UserService.getUserBadgeListAndLRNGDetails();
                },
                TESTMakeBadge: function(GamesService, UserService) {
                    return function( badgeId ) { GamesService.generateBadgeCode( UserService.currentUserId(), badgeId ); };
                }
            }
        });
    })
.controller('BadgesStudentCtrl', function ($scope, $log, $window, $state, $modal, badges,TESTMakeBadge) {
    $scope.badges = badges;
    $scope.TESTMakeBadge = TESTMakeBadge;
});
