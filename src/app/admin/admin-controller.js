angular.module('admin', [])
    .config(function($stateProvider) {
        $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: 'admin/admin.html',
            data: { authorizedRoles: ['instructor'] }
        });
    });

