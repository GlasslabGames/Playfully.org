angular.module( 'instructor.reports')
    .controller('helperWrapperCtrl', function($scope) {
        $scope.helperPage = "helperDrawerMain";

        $scope.$on('CHANGE_PAGE', function(event, newDestination) {
            switch (newDestination) {
                case "Report Helper":
                    $scope.helperPage = "helperDrawerMain";
                    break;
                case "Argument Schemes":
                    $scope.helperPage = "helperDrawerArgumentSchemes";
                    break;
                case "Claims and Evidence":
                    $scope.helperPage = "helperDrawerClaimsAndEvidence";
                    break;
                case "Critical Questions":
                    $scope.helperPage = "helperDrawerCriticalQuestions";
                    break;
                case "Backing":
                    $scope.helperPage = "helperDrawerBacking";
                    break;
            }
        });
    })
    .controller('helperCtrl', function($scope) {
        $scope.data = ["Argument Schemes", "Claims and Evidence", "Critical Questions", "Backing"];
        $scope.selectedTitle = "Report Helper";

        $scope.changeSection = function(newOption) {
            $scope.$emit('CHANGE_PAGE', newOption);
            $scope.selectedTitle = newOption;
        };
    });
