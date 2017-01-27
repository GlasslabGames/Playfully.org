angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) { $stateProvider
        .state('modal-xlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:gameId/course/:courseId/:type',
            views: {
                'modal@': {
                    templateUrl: function() {
                        return 'instructor/reports/drk12_b/modal-wrapper.html';
                    },
                    controller: function($scope, $stateParams, $state, $previousState) {
                        $scope.type = $stateParams.type;
                        $scope.navigateBackToReport = function() {
                            $state.go('root.reports.details.drk12_b', {
                                gameId: $stateParams.gameId,
                                courseId: $stateParams.courseId
                            });
                        };

                        // Some magic from the parent object
                        if (!$previousState.get("modalInvoker").state) {
                            $scope.navigateBackToReport();
                        }

                        $scope.data = {
                            info: {title: "Help"},
                            studentInfo: {title: "Performance Over Time"},
                            drilldown: {title: "Performance Over Time"}
                        };
                    }
                }
            }
        });
    });