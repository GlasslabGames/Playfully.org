angular.module('playfully.manager', [])
    .config(function ($stateProvider) {
        $stateProvider.state('root.manager', {
            abstract: true,
            url: 'manager',
            views: {
                'main@': {
                    templateUrl: 'manager/manager.html',
                    controller: 'ManagerCtrl'
                }
            }
        })
        .state('root.manager.current', {
            url: '/current',
            templateUrl: 'manager/manager-current.html',
            controller: 'ManagerCurrentCtrl'
        });
    })
    .controller('ManagerCtrl', function ($scope, SUBSCRIBE_CONSTANTS) {
        $scope.currentTab = "Current Plan";

    })
    .controller('ManagerCurrentCtrl', function ($scope, SUBSCRIBE_CONSTANTS) {

    });