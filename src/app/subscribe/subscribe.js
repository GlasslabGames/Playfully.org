angular.module('playfully.subscribe', ['subscribe.const'])

    .config(function ($stateProvider) {
        $stateProvider.state('root.subscribe', {
            abstract: true,
            url: 'subscribe'
        })
            .state('root.subscribe.upgrade', {
                url: '/upgrade',
                views: {
                    'main@': {
                        templateUrl: 'subscribe/subscribe-upgrade.html',
                        controller: 'SubscribeUpgradeCtrl'
                    }
                }
            })
            .state('root.subscribe.packages', {
                url: '/packages',
                resolve: {
                    packages: function (LicenseService) {
                        return LicenseService.getPackages();
                    }
                } ,
                views: {
                    'main@': {
                        templateUrl: 'subscribe/packages.html',
                        controller: 'SubscribePackagesCtrl'
                    }
                }
            });
    })
    .controller('SubscribeUpgradeCtrl', function ($scope, SUBSCRIBE_CONSTANTS) {

    })
    .controller('SubscribePackagesCtrl', function ($scope, packages, SUBSCRIBE_CONSTANTS) {
        $scope.seatChoices = [];
        angular.forEach(packages.seats, function (pack) {
            $scope.seatChoices.push(pack.studentSeats);
        });
        var subscribe = SUBSCRIBE_CONSTANTS;
        $scope.packageChoices = packages.plans;

        angular.forEach($scope.packageChoices, function(pack) {
           pack.seatsSelected = $scope.seatChoices[0];
        });
        angular.forEach($scope.packageChoices, function (pack) {
            pack.seatsSelected = $scope.seatChoices[0];
        });


        $scope.calculateTotal = function(price,seatChoice) {
            var targetPackage = _.find(packages.seats, {studentSeats: seatChoice});

            var total = seatChoice * price;

            return total - (total* (targetPackage.discount/100));

        };
    });