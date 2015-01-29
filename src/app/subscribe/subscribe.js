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
        var subscribe = SUBSCRIBE_CONSTANTS;
        var allGames = {
          price: 5,
          seatsSelected: $scope.seatChoices[0],
          description: subscribe['allGames'].description,
          title: subscribe['allGames'].title
        };
        var chromeBookGames = {
            price: 2,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['chromeBookGames'].description,
            title: subscribe['chromeBookGames'].title
        };
        var PCMacGames = {
            price: 2,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['PCMacGames'].description,
            title: subscribe['PCMacGames'].title
        };
        var iPadGames = {
            price: 3,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['iPadGames'].description,
            title: subscribe['iPadGames'].title
        };
        $scope.packageChoices = [chromeBookGames, iPadGames, PCMacGames, allGames];
    });