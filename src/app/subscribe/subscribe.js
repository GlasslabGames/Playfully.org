angular.module('playfully.subscribe', ['subscribe.const'])

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
    .controller('SubscribeCtrl', function ($scope, SUBSCRIBE_CONSTANTS) {
        $scope.seatChoices = [10, 30, 120, 499];
        $scope.allGames = {
          price: 5,
          seatsSelected: $scope.seatChoices[0],
          description: SUBSCRIBE_CONSTANTS['allGames'].description,
          title: SUBSCRIBE_CONSTANTS['allGames'].title
        };
        $scope.chromeBookGames = {
            price: 2,
            seatsSelected: $scope.seatChoices[0],
            description: SUBSCRIBE_CONSTANTS['chromeBookGames'].description,
            title: SUBSCRIBE_CONSTANTS['chromeBookGames'].title
        };
        $scope.PCMacGames = {
            price: 2,
            seatsSelected: $scope.seatChoices[0],
            description: SUBSCRIBE_CONSTANTS['PCMacGames'].description,
            title: SUBSCRIBE_CONSTANTS['PCMacGames'].title
        };
        $scope.iPadGames = {
            price: 3,
            seatsSelected: $scope.seatChoices[0],
            description: SUBSCRIBE_CONSTANTS['iPadGames'].description,
            title: SUBSCRIBE_CONSTANTS['iPadGames'].title
        };
        $scope.packageChoices = [$scope.chromeBookGames, $scope.PCMacGames, $scope.iPadGames, $scope.allGames];
    });