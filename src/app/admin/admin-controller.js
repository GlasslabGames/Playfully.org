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
        $scope.mcOutput = "Hello?";
    };
});