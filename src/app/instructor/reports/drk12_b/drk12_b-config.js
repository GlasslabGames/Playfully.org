angular.module( 'instructor.reports')
    .config(function ( $stateProvider, USER_ROLES) { $stateProvider
        .state('modal-xlg.drk12_bInfo', {
            url: '/reports/details/drk12_b/game/:gameId/course/:courseId/:type',
            views: {
                'modal@': {
                    templateUrl: function($stateParams, REPORT_CONSTANTS) {
                        return 'instructor/reports/drk12_b/_modal-' + $stateParams.type + '.html';
                    },
                    controller: function($scope, $stateParams, $state, $previousState, drk12_bStore) {
                        var navigateBackToReport = function() {
                            $state.go('root.reports.details.drk12_b', {
                                gameId: $stateParams.gameId,
                                courseId: $stateParams.courseId
                            });
                        };

                        // Some magic from the parent object
                        if (!$previousState.get("modalInvoker").state) {
                            navigateBackToReport();
                        }

                        if ($stateParams.type !== "info") {
                            var currentStudentsArray = drk12_bStore.getCurrentStudents();

                            if (!currentStudentsArray || currentStudentsArray.length < 1) {
                                navigateBackToReport();
                            } else {
                                $scope.singleUserView = true;
                                $scope.studentsArray = currentStudentsArray;
                                if (currentStudentsArray.length === 1) {
                                    $scope.singleUserView = true;
                                    $scope.student = currentStudentsArray[0];
                                } else if (currentStudentsArray.length > 1) {
                                    $scope.singleUserView = false;
                                }

                                $scope.skills = drk12_bStore.getSkills();
                                $scope.selectedSkill = drk12_bStore.getSelectedSkill();

                                $scope.isFirstSkill = function(selectedSkillName) {
                                    return Object.keys($scope.skills)[0] === selectedSkillName;
                                };

                                $scope.isLastSkill = function(selectedSkillName) {
                                    return Object.keys($scope.skills)[_.size($scope.skills)-1] === selectedSkillName;
                                };

                                $scope.incrementSkill = function() {
                                    var index = 0;
                                    for(var skillName in $scope.skills) {
                                        console.info('skillName: ', skillName);
                                        if (skillName === $scope.selectedSkill) {
                                            $scope.selectedSkill = Object.keys($scope.skills)[index + 1];
                                            console.info('selectedSkill = ', $scope.selectedSkill);
                                            break;
                                        }
                                        index++;
                                    }
                                };

                                $scope.decrementSkill = function() {
                                    var index = 0;
                                    for(var skillName in $scope.skills) {
                                        console.info('skillName: ', skillName);
                                        if (skillName === $scope.selectedSkill) {
                                            $scope.selectedSkill = Object.keys($scope.skills)[index - 1];
                                            console.info('selectedSkill = ', $scope.selectedSkill);
                                            break;
                                        }
                                        index++;
                                    }
                                };
                            }
                        }
                    }
                }
            }
        });
    });