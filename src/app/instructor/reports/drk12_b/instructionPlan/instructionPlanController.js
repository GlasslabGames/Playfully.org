angular.module( 'instructor.reports')
    .controller('instructionPlanCtrl', function($scope, $window, $stateParams, Drk12Service, courseData, reportData) {
        ////////////////////// Initialization /////////////////////////
        $scope.selectedSkill = $stateParams.location;
        $scope.reportData = reportData;
        $scope.courseData = courseData;

        $scope.planPage = "";
        $scope.temporaryData = {selectedStudents: {}};
        $scope.submissionData = {};
        $scope.data = {
            connectingEvidence: "Argument Schemes",
            supportingClaims: "Claims and Evidence",
            criticalQuestions: "Critical Questions",
            usingBacking: "Backing"
        };

        //// Date stuff

        $scope.placeholderDate = new Date();
        $scope.placeholderDate.setHours(0,0,0,0);

        $scope.dateOptions = {
            formatYear: 'yy'
        };

        $scope.format = 'yyyy-MM-dd';

        ///////////////////////////////////////////////////////////////

        if ($stateParams.noteId) {
            Drk12Service.getInstructionPlans( $stateParams.courseId, $stateParams.gameId, $stateParams.location ).then(function(result) {
                var note = $.grep(result.data, function(e){ return e.id == $stateParams.noteId; });
                $scope.submissionData = note[0];

                if ($scope.submissionData.student_group === 'custom') {
                    $scope.submissionData.students.forEach(function(studentId) {
                        $scope.temporaryData.selectedStudents[studentId] = true;
                    });
                }
            });
        }

        $scope.cancelPlan = function () {
            $window.close();
        };

        $scope.savePlan = function () {
            if ($scope.submissionData.student_group === 'custom' && $scope.temporaryData.selectedStudents) {
                $scope.submissionData.students = Object.keys($scope.temporaryData.selectedStudents);
            }
            Drk12Service.uploadInstructionPlan( $stateParams.courseId, $stateParams.gameId, $stateParams.location, $scope.submissionData );
        };

        var locationToSubPageFilename = function(location) {
            var returnString = "helperDrawerArgumentSchemes";

            switch (location) {
                case "connectingEvidence":
                    returnString = "instructionPlanArgumentSchemes";
                    break;
                case "supportingClaims":
                    returnString = "instructionPlanClaimsAndEvidence";
                    break;
                case "criticalQuestions":
                    returnString = "instructionPlanCriticalQuestions";
                    break;
                case "usingBacking":
                    returnString = "instructionPlanBacking";
                    break;
                default:
                    alert('Given an invalid skill. Defaulting to Connecting Evidence / Argument Schemes');
            }

            return returnString;
        };

        var findUserByUserId = function (userId, reportData) {
            var found;
            for (var i = 0; i < reportData.length; i++) {
                if (reportData[i] && reportData[i].userId === userId) {
                    found = reportData[i];
                    return found;
                }
            }
            return null;
        };

        var populateStudentLearningData = function(usersReportData) {
            if (usersReportData) {
                angular.forEach(courseData.users, function (student) {
                    student.results = findUserByUserId(student.id, usersReportData.students) || {};
                });
            }
        };

        // populate student objects with report data
        populateStudentLearningData(reportData);

        $scope.planPage = locationToSubPageFilename($stateParams.location);
    });
