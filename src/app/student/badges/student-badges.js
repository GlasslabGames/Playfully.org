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
                badges: function (DashService) {
                    return [ { "image": { "src": "https://s3-us-west-1.amazonaws.com/collectiveshift/badgeImages/50x5/Mozilla_Badge_PC_400.png" }, "status": "redeemable" }, { "image": { "src": "https://s3-us-west-1.amazonaws.com/collectiveshift/badgeImages/50x5/placeholder_badge.png" }, "status": "awarded" } ];
                }
            }
        });
    })
.controller('BadgesStudentCtrl', function ($scope, $log, $window, $state, $modal, badges) {
        $scope.badges = badges;
});
