angular.module('playfully.admin', ['dash','license'])

.config(function($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        abstract: true,
        views: {
            'main@': {
                templateUrl: 'admin/admin.html'
            }
        },
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.message-center', {
        url: '/message-center',
        templateUrl: 'admin/admin-message-center.html',
        controller: 'AdminMessageCenterCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    })
    .state('admin.purchase-orders', {
        url: '/purchase-orders',
        templateUrl: 'admin/admin-purchase-orders.html',
        controller: 'AdminPurchaseOrdersCtrl',
        data: {
            authorizedRoles: ['admin']
        }
    });
})

.controller('AdminMessageCenterCtrl', function ($scope, $http, $window, DashService) {

    $scope.mcSubject = "";
    $scope.mcMessage = "";
    $scope.mcIcon = "";
    $scope.mcOutput = "";

    $scope.submitMessage = function() {
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
})

.controller('AdminPurchaseOrdersCtrl', function ($scope, $http, $window, LicenseService) {
    $scope.order = {
        key: "",
        number: "",
        amount: ""
    };
    $scope.package = {
        plan: "",
        seats: ""
    };
    $scope.action = "";
    $scope.output = "";

    $scope.updatePurchaseOrder = function() {
        LicenseService.updatePurchaseOrder($scope.action).then(function(data) {
            // Update the output
            $scope.output = data;

            // Reset the order
            $scope.order.key = "";
            $scope.order.number = "";
            $scope.order.amount = "";

            // Reset the package
            $scope.package.plan = "";
            $scope.package.seats = "";

            // Reset the action
            $scope.action = "";
        });
    };
});