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
        $scope.seatChoices = [10, 30, 120, 500];
        var subscribe = SUBSCRIBE_CONSTANTS;

        var chromeBookGames = {
            price: 25,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['chromeBookGames'].description,
            title: subscribe['chromeBookGames'].title,
            browserGames: [1,2,3,4],
            ipadGames: [],
            downloadableGames: []
        };

        var iPadGames = {
            price: 30,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['iPadGames'].description,
            title: subscribe['iPadGames'].title,
            browserGames: [],
            ipadGames: [1,2,3,4,5],
            downloadableGames: []
        };

        var PCMacGames = {
            price: 35,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['PCMacGames'].description,
            title: subscribe['PCMacGames'].title,
            browserGames: [1,2,3,4],
            ipadGames: [],
            downloadableGames: [1,2]
        };

        var allGames = {
            price: 50,
            seatsSelected: $scope.seatChoices[0],
            description: subscribe['allGames'].description,
            title: subscribe['allGames'].title,
            browserGames: [1,2,3,4],
            ipadGames: [1,2,3,4,5],
            downloadableGames: [1,2]
        };

        $scope.packageChoices = [chromeBookGames, iPadGames, PCMacGames, allGames];
        $scope.calculateTotal = function(price,seatChoice) {
            var total = seatChoice * price * 0.10;

            if (seatChoice===10) {
                return total;
            }
            if (seatChoice === 30) {
                return (total)-(total *0.20);
            }
            if (seatChoice === 120) {
                return (total) - (total * 0.25);
            }
            if (seatChoice === 500) {
                return (total) - (total *0.30);
            }
        };
    });