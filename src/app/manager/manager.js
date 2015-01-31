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
        .state('modal.remove-educator', {
            url: '/manager/current/remove-educator?:email',
            data: {
                pageTitle: 'Remove educator'
            },
            views: {
                'modal@': {
                    templateUrl: 'manager/manager-remove-educator-modal.html',
                    controller: function ($scope, $log, $stateParams) {
                        console.log($stateParams.email);
                        // if service succeeds, then success
                    }
                }
            }
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

        $scope.userSortFunction = function (colName, callback) {
            return function (user) {
                if (colName === 'firstName') {
                    return user.firstName;
                }
                if (colName === 'lastInitial') {
                    return user.lastInitial;
                }
                if (colName === 'screenName') {
                    return user.username;
                }
                if (callback) {
                    return callback();
                }
            };
        };
        // Highlights currently selected column, name is the default selected column
        $scope.sortSelected = function (colName) {

            var columns = $scope.col;
            // check if column exists
            if (!columns[colName]) {
                columns[colName] = {};
            }
            // check if clicked column is already active
            if (columns['current'] === colName) {
                columns[colName].reverse = !columns[colName].reverse;
                return;
            }
            // set previous current values to false
            columns[columns.current].reverse = false;
            // set clicked column as new current and to active
            columns.current = colName;
            return;
        };

        $scope.col = {firstName: {reverse: false}, lastInitial: {}, screenName: {}, current: 'firstName'};
        $scope.colName = {value: 'firstName'};
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
              email: "cwtai86@gmail.com"
            },
            {
              firstName: "Buzzy",
              lastName: "Fart",
              email: "buzzy@gmail.com"
            }
          ]
        };

        $scope.plan = dummyData;
        $scope.plan.expirationDate = moment(dummyData.expirationDate).format("MMM Do YYYY");

        $scope.package = dummyData.packageDetails;
        $scope.invitedEducators = null;
        $scope.invalid = null;

        $scope.inviteEducators = function(string) {
            // remove white space
            var str = string.replace(/\s+/g, '');
            var educators = str.split(',');
            console.log(educators);
            //remove whitespace
            //check for @ sign, check
            var valid = [];
            var invalid = [];

            var validateEmail = function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            };

            for (var i = 0; i < educators.length; i++) {
                if (validateEmail(educators[i])) {
                    valid.push(educators[i]);
                } else {
                    invalid.push(educators[i]);
                }
            }
            if (valid.length===educators.length) {
                // send api
            } else {
                $scope.invalid = invalid;
            }
        };
    });

