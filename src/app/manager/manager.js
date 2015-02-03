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
        .state('modal.notify-invited-subscription', {
            url: '/notify-invited-subscription',
            templateUrl: 'manager/notify-invited-subscription-modal.html',
            controller: function($scope) {
                var dummyData = {
                    planOwner: {
                        firstName: "Charles",
                        lastName: "Tai"
                    },
                    studentSeatsRemaining: 20,
                    educatorSeatsRemaining: 5,
                    packageDetails: {
                        name: "iPad",
                        description: "Access to all iPad games on GlassLab Games",
                        size: "Class",
                        studentSeats: 30,
                        educatorSeats: 20
                    },
                    expirationDate: new Date(),
                    educatorList: [
                        {
                            firstName: "Charles",
                            lastName: "Tai",
                            email: "cwtai86@gmail.com",
                            status: "Admin"
                        }
                    ]
                };
                $scope.plan = dummyData;
                $scope.packageDetails = package;
            }
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
                        $scope.email = $stateParams.email;
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
          planOwner: {
              firstName: "Charles",
              lastName: "Tai"
          },
          studentSeatsRemaining: 20,
          educatorSeatsRemaining: 5,
          packageDetails: {
            name: "iPad",
            description: "Access to all iPad games on GlassLab Games",
            size: "Class",
            studentSeats: 30,
            educatorSeats: 20
          },
          expirationDate: new Date(),
          educatorList: [
            {
              firstName: "Charles",
              lastName: "Tai",
              email: "cwtai86@gmail.com",
              status: "Admin"
            }
          ]
        };

        $scope.plan = dummyData;
        $scope.plan.expirationDate = moment(dummyData.expirationDate).format("MMM Do YYYY");
        $scope.package = dummyData.packageDetails;

        $scope.request = {
            isRegCompleted: false,
            invitedEducators: null,
            errors: []
        };

        var _requestInvite = function (request) {
            request.isSubmitting = true;
            GamesService.requestGameAccess(request.gameId)
                .then(function (response) {
                    $scope.request.errors = [];
                    $scope.request.isSubmitting = false;
                    $scope.request.isRegCompleted = true;
                },
                function (response) {
                    $log.error(response.data);
                    $scope.request.isSubmitting = false;
                    $scope.request.errors = [];
                    $scope.request.errors.push(response.data.error);
                });
        };
        $scope.finish = function () {

        };
        var _validateEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.inviteEducators = function(string) {

            var str = string.replace(/\s+/g, '');
            var educators = str.split(',');
            var valid = [];
            var invalid = [];

            if (educators.length > $scope.plan.educatorSeatsRemaining) {
                invalid.push("You tried inviting " + educators.length + " educators. But you only have " +
                $scope.plan.educatorSeatsRemaining  + " educator seats remaining in your subscription.");
            }

            if (educators.length) {
                for (var i = 0; i < educators.length; i++) {

                    if (_.some($scope.plan.educatorList, {email:educators[i]})) {
                        invalid.push(educators[i] + ' is already sharing your subscription.');
                    }
                    if (_validateEmail(educators[i])) {
                        valid.push(educators[i]);
                    } else {
                        invalid.push('Invalid Email: ' + educators[i]);
                    }
                }
            }

            if (invalid.length < 1) {
                _requestInvite(valid);
            }

            $scope.request.errors = invalid;
        };

        $scope.isOwner = function () {
            return false;
        };
    });

