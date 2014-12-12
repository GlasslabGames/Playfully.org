angular.module('playfully.admin', ['dash'])

.config(function($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            'main@': {
                templateUrl: 'admin/admin.html',
                controller: 'AdminCtrl'
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    });
})

.controller('AdminCtrl', function ($scope, $http, $window, DashService) {

    $scope.mcSubject = "";
    $scope.mcMessage = "";
    $scope.mcIcon = "";
    $scope.mcOutput = "";

    $scope.submit = function() {
        $scope.mcOutput = "Processing...";

        var messageData = {};
        messageData.subject = $scope.mcSubject;
        messageData.message = $scope.mcMessage;
        messageData.icon = $scope.mcIcon;

        DashService.postMessage("message", messageData).then(function(data) {
            $scope.mcOutput = data;
            $scope.mcSubject = "";
            $scope.mcMessage = "";
            $scope.mcIcon = "";
        });
    };
});