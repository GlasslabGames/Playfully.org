angular.module('playfully.subscribe', ['subscribe.const'])

    .config(function ($stateProvider) {
        $stateProvider.state('root.subscribe', {
            abstract: true,
            url: 'subscribe'
        })
            .state('root.subscribe.upgrade', {
                url: '/upgrade?packageType?seatsSelected',
                resolve: {
                    packages: function (LicenseService) {
                        return LicenseService.getPackages();
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'subscribe/subscribe-upgrade.html',
                        controller: 'SubscribeUpgradeCtrl'
                    }
                }
            })
            .state('root.subscribe.upgrade.credit-card', {
                url: '/credit-card',
                templateUrl: 'subscribe/subscribe-upgrade-credit-card.html',
                controller: 'SubscribeUpgradeCtrl'
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
    .controller('SubscribeUpgradeCtrl', function ($scope, $stateParams, packages) {
        $scope.package = _.find(packages.plans, {name:$stateParams.packageType});
        var seatsSelected = angular.copy(_.find(packages.seats, {studentSeats: parseInt($stateParams.seatsSelected)}));

        $scope.seats = {
            choices: packages.seats,
            selected: $stateParams.seatsSelected,
            isOpen: false
        };

        $scope.calculateTotal = function (price, seatChoice) {
            var targetPackage = _.find($scope.seats.choices, {studentSeats: parseInt(seatChoice)});
            var total = seatChoice * price;
            return total - (total * (targetPackage.discount / 100));
        };


        Stripe.setPublishableKey('pk_test_0T7q98EI508iQGcjdv1DVODS');
        Stripe.card.createToken({
            name: 'charles',
            number: 4242424242424242,
            exp_month: 1,
            exp_year: 2020,
            cvc: 123
        }, function(status, response) {
            console.log('Stripe Response', status, response);
        });
    })
    .controller('SubscribePackagesCtrl', function ($scope, packages, SUBSCRIBE_CONSTANTS) {
        $scope.seatChoices = [];
        $scope.packageChoices = packages.plans;

        angular.forEach(packages.seats, function (pack) {
            $scope.seatChoices.push(pack.studentSeats);
        });

        angular.forEach($scope.packageChoices, function(pack) {
           pack.seatsSelected = $scope.seatChoices[0];
        });

        $scope.calculateTotal = function(price,seatChoice) {
            var targetPackage = _.find(packages.seats, {studentSeats: seatChoice});
            var total = seatChoice * price;

            return total - (total* (targetPackage.discount/100));
        };
    });