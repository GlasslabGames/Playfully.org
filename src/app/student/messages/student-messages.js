angular.module('student.messages', [])

    .config(function config($stateProvider) {
        $stateProvider.state('root.studentMessages', {
            url: 'messages',
            views: {
                'main': {
                    controller: 'MessagesStudentCtrl',
                    templateUrl: 'student/messages/student-messages.html'
                }
            },
            data: {
                pageTitle: 'Message Center',
                authorizedRoles: ['student']
            },
            resolve: {
                messages: function (DashService) {
                    return DashService.getMessages('message', 10, false).then(function (messages) {
                        var modifiedMessages = [];
                        for (var key in messages) {
                            var message = messages[key].value;
                            if (message &&
                                message.timestamp) {
                                message.timeAgo = moment(new Date(message.timestamp)).fromNow();
                            }
                            modifiedMessages.push(message);
                        }
                        return modifiedMessages;
                    });
                }
            }
        });
    })
.controller('MessagesStudentCtrl', function ($scope, $log, $window, $state, $modal, messages) {
        $scope.messages = messages;
        $scope.status = {
            showMessages: true
        };
});