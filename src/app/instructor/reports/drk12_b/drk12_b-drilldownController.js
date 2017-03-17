angular.module( 'instructor.reports')
    // This controller is always assumed to be within the scope of the modal created in the config
    .controller('Drk12bModalDrilldown', function($scope, $state, $stateParams, drk12_bStore) {
        if (!drk12_bStore.hasValidModalData($scope.type)) {
            $scope.navigateBackToReport();
        } else {
            $scope.selectedStudent = drk12_bStore.getSelectedStudent();
            $scope.selectedSkill = drk12_bStore.getSelectedSkill();
            $scope.selectedMission = drk12_bStore.getSelectedMission();
            $scope.skills = drk12_bStore.getSkills();
        }

        var magicData = [
            {
                key: "connectingEvidence",
                skills: [
                    {
                        key: "AUTHORITRON",
                        description: "AUTHORITRON",
	                    subDescription: "Authority"
                    },
                    {
                        key: "OBSERVATRON",
                        description: "OBSERVATRON",
	                    subDescription: "Observation"
                    },
                    {
                        key: "CONSEBOT",
                        description: "CONSEBOT",
	                    subDescription: "Consequence"
                    },
                    {
                        key: "COMPARIDROID",
                        description: "COMPARIDROID",
	                    subDescription: "Comparison"
                    }
                ]
            },
            {
                key: "supportingClaims",
                skills: [
	                {
		                key: "FUSE_CORE",
		                description: "Built core arguments using relevant and supporting evidence"
	                },
                    {
                        key: "CORE_ATTACK",
                        description: "Attacked irrelevant and contradictory evidence in opponent core arguments"
                    }
                ]
            },
            {
                key: "criticalQuestions",
                skills: [
                    {
                        key: "CRITICAL_QUESTION_ATTACK",
                        description: "Correctly used critical questions"
                    }
                ]
            },
            {
                key: "usingBacking",
                skills: [
                    {
                        key: "CREATED",
                        description: "Chose appropriate backing to strengthen a core argument"
                    },
                    {
                        key: "DEFENDED",
                        description: "Correctly used backing to respond to critical questions"
                    }
                ]
            }
        ];

        $scope.progressTypes = { // TODO: This is redundant. Move to service.
            Advancing: {class:'Advancing', title: 'Advancing'},
            NeedSupport: {class:'NeedSupport', title: 'Needs Support'},
            NotYetAttempted: {class:'NotAttempted', title: 'Not yet attempted / Not enough data'}
        };

        var getUpdatedMissionDetails = function(mission, skillKey) {
            var selectedMagicDataSkill = magicData[0];
            switch (skillKey) {
                case magicData[0].key:
                    selectedMagicDataSkill = magicData[0];
                    break;
                case magicData[1].key:
                    selectedMagicDataSkill = magicData[1];
                    break;
                case magicData[2].key:
                    selectedMagicDataSkill = magicData[2];
                    break;
                case magicData[3].key:
                    selectedMagicDataSkill = magicData[3];
                    break;
            }

            var returnObject = {};
            if (!mission.skillLevel[selectedMagicDataSkill.key].detail) {
                mission.skillLevel[selectedMagicDataSkill.key].detail = {}; // because sometimes I don't get what I need from the back end
            }
            var missionDetails = mission.skillLevel[selectedMagicDataSkill.key].detail;

            selectedMagicDataSkill.skills.forEach(function(subSkill) {
                // Special one-off horrible hack for FUSE_CORE. Need to show it in skill 2, but it comes from the server as part of skill 1.
                if (subSkill.key === magicData[1].skills[0].key) {
                    if (!mission.skillLevel[magicData[0].key].detail) { // because sometimes I don't get what I need from the back end
                        mission.skillLevel[magicData[0].key].detail = {};
                    }
                    missionDetails[subSkill.key] = mission.skillLevel[magicData[0].key].detail[subSkill.key];
                }
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
	            missionDetails[subSkill.key].subDescription = subSkill.subDescription;
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        $scope.navigateToStudentInfo = function() {
            $state.go('modal-xxlg.drk12_bInfo', {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId,
                type: "studentInfo"
            });
        };

        $scope.isConnectedEvidence = function() {
            return $scope.selectedSkill === magicData[0].key;
        };

        $scope.didComeFromStudentInfo = function() {
            return drk12_bStore.getCurrentStudents().length > 0;
        };

        $scope.numberOfSubSkills = function(object) {
            return Object.keys(object).length;
        };

        $scope.calculateSuccessRate = function(correct, attempts) {
            if (attempts === 0) {
                return "-";
            } else {
                return ((correct/attempts)*100).toFixed(0);
            }
        };

        $scope.calculdatedDetails = getUpdatedMissionDetails($scope.selectedMission, $scope.selectedSkill);
    });
