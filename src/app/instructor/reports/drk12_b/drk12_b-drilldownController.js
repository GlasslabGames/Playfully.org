angular.module( 'instructor.reports')
    .controller('Drk12Drilldown', function($scope, $state, $stateParams, myGames, defaultGame, gameReports, ReportsService, Drk12Service, usersData) {
        $scope.skills = Drk12Service.skills;
        $scope.missionNumber = $stateParams.mission;

        ////////////////////// Get Initially Needed Values/Variables
        $scope.selectedSkill = $stateParams.skill;

        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];
        $scope.selectedStudent = $scope.courses.selected.users.find(function(student) { return student.id === Number($stateParams.studentId); });

        var selectedStudentData = usersData.students.find(function(student) { return student.userId === Number($stateParams.studentId); });

        $scope.selectedMission = selectedStudentData.missions.find(function(missionObject) { return "" + missionObject.mission === "" + $stateParams.mission; });

        ////////////////////////////////////////////////////////////
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
		                description: "Evidence",
                        subDescription: "Built core arguments using relevant and supporting evidence"
	                },
                    {
                        key: "CORE_ATTACK",
                        description: "Contradictory",
                        subDescription: "Attacked irrelevant and contradictory evidence in opponent core arguments"
                    }
                ]
            },
            {
                key: "criticalQuestions",
                skills: [
                    {
                        key: "CRITICAL_QUESTION_ATTACK",
                        description: "Attack",
                        subDescription: "Correctly used critical questions"
                    }
                ]
            },
            {
                key: "usingBacking",
                skills: [
                    {
                        key: "CREATED",
                        description: "Created",
                        subDescription: "Chose appropriate backing to strengthen a core argument"
                    },
                    {
                        key: "DEFENDED",
                        description: "Defended",
                        subDescription: "Correctly used backing to respond to critical questions"
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
	            missionDetails[subSkill.key].locked = true;
	            if (typeof selectedStudentData.argubotsUnlocked[subSkill.key] === "string") {
	                if (selectedStudentData.argubotsUnlocked[subSkill.key] === "ST") {
                        missionDetails[subSkill.key].locked = false;
                    } else if (selectedStudentData.argubotsUnlocked[subSkill.key] === "BT" && (mission.mission === "BT" || mission.mission > 6)) { // TODO: Better magic number solution
                        missionDetails[subSkill.key].locked = false;
                    }
                } else if (typeof selectedStudentData.argubotsUnlocked[subSkill.key] === "number") {
	                if (mission.mission === "BT" && selectedStudentData.argubotsUnlocked[subSkill.key] > 6) { // TODO: Better magic number solution
                        missionDetails[subSkill.key].locked = false;
                    } else if (mission.mission !== "ST" && mission.mission >= selectedStudentData.argubotsUnlocked[subSkill.key]) {
                        missionDetails[subSkill.key].locked = false;
                    }
                } else {
                    console.error('argubotsUnlocked invalid state. Mission: ', mission.mission, " Unlocked: ", selectedStudentData.argubotsUnlocked[subSkill.key]);
                }
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        $scope.isConnectedEvidence = function() {
            return $scope.selectedSkill === magicData[0].key;
        };

        $scope.numberOfSubSkills = function(object) {
            return Object.keys(object).length;
        };

        $scope.calculateSuccessRate = function(correct, attempts) {
            if (attempts === 0) {
                return "-";
            } else {
                return "" + ((correct/attempts)*100).toFixed(0) + "%";
            }
        };

        $scope.calculdatedDetails = getUpdatedMissionDetails($scope.selectedMission, $scope.selectedSkill);

        ///////////////////////// Necessary stuff for parent drop-downs
        var reportId = 'drk12_b';

        // Games
        $scope.games.options = {}; // TODO: This appears to be report agnostic. Why is it placed in each report?
        angular.forEach(myGames, function(game) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.games.options['' + game.gameId] = game;
        });

        $scope.games.selectedGameId = defaultGame.gameId; // TODO: This appears to be report agnostic. Why is it placed in each report?


        // Reports
        $scope.reports.options = [];  // TODO: This appears to be report agnostic. Why is it placed in each report?

        angular.forEach(gameReports.list, function(report) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            if(report.enabled) {
                $scope.reports.options.push( angular.copy(report) );
                // select report that matches this state
                if (reportId === report.id) {
                    $scope.reports.selected = report;
                }
            }
        });

        // Check if selected game has selected report

        if (!ReportsService.isValidReport(reportId, $scope.reports.options))  { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId, $scope.reports.options), {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId
            });
            return;
        }

        // Set parent scope developer info

        if (gameReports.hasOwnProperty('developer')) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.developer.logo = gameReports.developer.logo;
        }

        ////////////////// End Necessary stuff for parent drop-downs

    });
