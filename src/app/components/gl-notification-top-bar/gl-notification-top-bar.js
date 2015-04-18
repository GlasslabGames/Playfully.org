angular.module('gl-notification-top-bar', ['subscribe.const','license'])
    .directive('glNotificationTopBar', function () {
        return {
            scope: {
                glCurrentUser: '='
            },
            controller: function($scope, $timeout, $window, SUBSCRIBE_CONSTANTS, LicenseService, UserService) {
                // timeout allows for user session to be generated before accessing current user data
                $timeout(function(){
                    $scope.currentUser = angular.copy($scope.glCurrentUser);
                    $scope.owner = $scope.currentUser.inviteLicense.owner;
                    $scope.packageType = SUBSCRIBE_CONSTANTS[$scope.currentUser.inviteLicense.packageType];
                    }, 10
                );
                $scope.error = [];
                $scope.acceptInvitation = function() {
                    LicenseService.leaveTrialAcceptInvitation().then(function() {
                        UserService.updateUserSession();
                    }, function(error) {
                        $scope.error.push(error);
                    });
                };
                $scope.declineInvitation = function () {
                    LicenseService.declineInvitation().then(function () {
                        UserService.updateUserSession();
                    }, function (error) {
                        $scope.error.push(error);
                    });
                };
                $scope.goToLink = function (path) {
                    $window.open(path, '_blank');
                };
            },
            templateUrl: 'components/gl-notification-top-bar/gl-notification-top-bar.html'
        };
    });
