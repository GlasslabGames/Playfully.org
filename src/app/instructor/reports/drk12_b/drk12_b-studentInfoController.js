angular.module( 'instructor.reports')
    // This controller is always assumed to be within the scope of the modal created in the config
    .controller('Drk12bModalStudentInfo', function($scope, $state, $stateParams, $rootScope, drk12_bStore) {
        if (!drk12_bStore.hasValidModalData($scope.type)) {
            $scope.navigateBackToReport();
        } else {
            $scope.studentsArray = drk12_bStore.getCurrentStudents();
            if ($scope.studentsArray.length === 1) {
                $scope.singleUserView = true;
                $scope.selectedStudent = $scope.studentsArray[0];
            } else {
                $scope.singleUserView = false;
            }

            $scope.skills = drk12_bStore.getSkills();
            $scope.selectedSkill = drk12_bStore.getSelectedSkill();

            $scope.isFirstSkill = function(selectedSkillName) {
                return Object.keys($scope.skills)[0] === selectedSkillName;
            };

            $scope.isLastSkill = function(selectedSkillName) {
                return Object.keys($scope.skills)[_.size($scope.skills) - 1] === selectedSkillName;
            };

            $scope.allowSkillNavigation = function() {
                return !drk12_bStore.isSingleSKillView;
            };

            $scope.incrementSkill = function() {
                var index = 0;
                for(var skillName in $scope.skills) {
                    if (skillName === $scope.selectedSkill) {
                        drk12_bStore.setSelectedSkill(Object.keys($scope.skills)[index + 1]);
                        $rootScope.$broadcast("SKILL_CHANGE");
                        break;
                    }
                    index++;
                }
            };

            $scope.decrementSkill = function() {
                var index = 0;
                for(var skillName in $scope.skills) {
                    if (skillName === $scope.selectedSkill) {
                        drk12_bStore.setSelectedSkill(Object.keys($scope.skills)[index - 1]);
                        $rootScope.$broadcast("SKILL_CHANGE");
                        break;
                    }
                    index++;
                }
            };

            $scope.navigateToDrilldown = function(student, mission, skillKey) {
                if (!student || !mission || !skillKey || mission.skillLevel[skillKey].level === "NotAttempted") {
                    return;
                }
                drk12_bStore.setSelectedStudent(student);
                drk12_bStore.setSelectedMission(mission);
                drk12_bStore.setSelectedSkill(skillKey);

                $state.go('modal-xxlg.drk12_bInfo', {
                    gameId: $stateParams.gameId,
                    courseId: $stateParams.courseId,
                    type: "drilldown"
                });
            };


            $scope.$on("SKILL_CHANGE", function() {
                $scope.selectedSkill = drk12_bStore.getSelectedSkill();
            });
        }
    });
