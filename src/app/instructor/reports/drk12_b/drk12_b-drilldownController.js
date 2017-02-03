angular.module( 'instructor.reports')
    // This controller is always assumed to be within the scope of the modal created in the config
    .controller('Drk12bModalDrilldown', function($scope, $state, $stateParams, drk12_bStore) {
        if (!drk12_bStore.hasValidModalData($scope.type)) {
            $scope.navigateBackToReport();
        } else {
            $scope.selectedStudent = drk12_bStore.getSelectedStudent();
            $scope.selectedSkill = drk12_bStore.getSelectedSkill();
            $scope.selectedMission = drk12_bStore.getSelectedMission();
        }

        var magicData = [
            {
                key: "connectingEvidence",
                skills: [
                    { key: "AUTHORITRON", description: "AUTHORITRON" },
                    { key: "OBSERVATRON", description: "OBSERVATRON" },
                    { key: "CONSEBOT", description: "CONSEBOT" },
                    { key: "COMPARIDROID", description: "COMPARIDROID" }
                ]
            },
            {
                key: "supportingClaims",
                skills: [
                    {
                        key: "CORE_ATTACK",
                        description: "Identified claims supported by irrelevant pairs and contradictory evidence in battle"
                    },
                    {
                        key: "FUSE_CORE",
                        description: "Assembled claim-evidence pairs with supporting evidence"
                    }
                ]
            },
            {
                key: "criticalQuestions",
                skills: [
                    {
                        key: "CRITICAL_QUESTION_ATTACK",
                        description: "Used a critical question to attack their opponent's bot in a battle"
                    }
                ]
            },
            {
                key: "usingBacking",
                skills: [
                    {
                        key: "CREATED",
                        description: "Created claim-cores with appropriate backing"
                    },
                    {
                        key: "DEFENDED",
                        description: "Used backing to defend against a critical question attack"
                    }
                ]
            }
        ];

        var getUpdatedMissionDetails = function(mission, skillKey) {
            switch (skillKey) {
                case magicData[0].key:
                    return getConnectingEvidenceData(mission);
                case magicData[1].key:
                    return getSupportingClaimsData(mission);
                case magicData[2].key:
                    return getCriticalQuestionsData(mission);
                case magicData[3].key:
                    return getUsingBackingData(mission);
            }
        };

        var getConnectingEvidenceData = function(mission) {
            var returnObject = {};
            var missionDetails = mission.skillLevel[magicData[0].key].detail;

            magicData[0].skills.forEach(function(subSkill) {
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        var getSupportingClaimsData = function(mission) {
            var returnObject = {};
            var missionDetails = mission.skillLevel[magicData[1].key].detail;

            magicData[1].skills.forEach(function(subSkill) {
                if (subSkill.key === magicData[1].skills[1].key) { // FUSE_CORE
                    missionDetails[subSkill.key] = mission.skillLevel[magicData[0].key].detail[subSkill.key];
                }
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        var getCriticalQuestionsData = function(mission) {
            var returnObject = {};
            var missionDetails = mission.skillLevel[magicData[2].key].detail;

            magicData[2].skills.forEach(function(subSkill) {
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        var getUsingBackingData = function(mission) {
            var returnObject = {};
            var missionDetails = mission.skillLevel[magicData[3].key].detail;

            magicData[3].skills.forEach(function(subSkill) {
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        $scope.navigateToStudentInfo = function() {
            $state.go('modal-xlg.drk12_bInfo', {
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
            if (!correct || !attempts || correct === 0 || attempts === 0) {
                return 0;
            } else {
                return ((correct/attempts)*100).toFixed(0);
            }
        };

        $scope.calculdatedDetails = getUpdatedMissionDetails($scope.selectedMission, $scope.selectedSkill);
    });
