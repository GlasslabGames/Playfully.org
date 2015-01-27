angular.module('playfully.subscribe', [])

    .config(function ($stateProvider) {
        $stateProvider.state('root.subscribe', {
            abstract: true,
            url: 'subscribe'
        })
            .state('root.subscribe.packages', {
                url: '/packages',
                views: {
                    'main@': {
                        templateUrl: 'subscribe/packages.html',
                        controller: 'SubscribeCtrl'
                    }
                }
            });
    })
    .controller('SubscribeCtrl', function () {

    });