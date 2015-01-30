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
        .state('root.manager.student-list', {
            url: '/student-list',
            templateUrl: 'manager/manager-student-list.html',
            controller: 'ManagerStudentListCtrl'
        })
        .state('root.manager.current', {
            url: '/current',
            templateUrl: 'manager/manager-current.html',
            controller: 'ManagerCurrentCtrl'
        });
    })
    .controller('ManagerCtrl', function ($scope,$state, SUBSCRIBE_CONSTANTS) {
        $scope.currentTab = $state.current.url;

    })
    .controller('ManagerStudentListCtrl', function ($scope,$state, SUBSCRIBE_CONSTANTS) {
        $scope.$parent.currentTab = $state.current.url;

        var dummyData = [
            {
                firstName: "Charles",
                lastInitial: "T",
                username: "Charosez",
                educators: [
                ]
            },
            {
                firstName: "Luke",
                lastInitial: "R",
                username: "Lukey",
                educators: []
            },
            {
                firstName: "Ben",
                lastInitial: "D",
                username: "Barbarian",
                educators: []
            }
        ];
        $scope.studentList = dummyData;
    })
    .controller('ManagerCurrentCtrl', function ($scope,$state, SUBSCRIBE_CONSTANTS) {
        $scope.$parent.currentTab = $state.current.url;

        var dummyData = {
          studentSeatsRemaining: 20,
          educatorSeatsRemaining: 1,
          packageDetails: {
            name: "iPad",
            description: "Access to all iPad games on GlassLab Games",
            size: "Class",
            studentSeats: 30,
            educatorSeats: 1
          },
          expirationDate: new Date(),
          educatorList: [
            {
              firstName: "Charles",
              lastName: "Tai",
              email: "cwtai86@gmail.com",
              status: "Teacher"
            }
          ]
        };

        $scope.plan = dummyData;
        $scope.plan.expirationDate = moment(dummyData.expirationDate).format("MMM Do YYYY");

        $scope.package = dummyData.packageDetails;

    });

