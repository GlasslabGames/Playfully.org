angular.module( 'instructor.reports')
    .controller('instructionPlanCtrl', function($scope, $timeout, $interval, $anchorScroll, $state, $stateParams) {
        ////////////////////// Initialization /////////////////////////

        $scope.selectedPage = $stateParams.location;

        $scope.planPage = "";
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

        $scope.planPage = locationToSubPageFilename($stateParams.location);
    });
