angular.module( 'instructor.reports')
    .controller('helperWrapperCtrl', function($scope) {
        $scope.helperPage = "helperDrawerMain";
        $scope.data = ["Argument Schemes", "Claims and Evidence", "Critical Questions", "Backing"];
        $scope.selectedTitleWithoutSpaces = $scope.selectedTitle = "Report Helper";
        $scope.selectedTitleWithoutSpaces = $scope.selectedTitleWithoutSpaces.replace(/\s/g, '');

        $scope.$on('CHANGE_PAGE', function(event, newDestination) {
            switch (newDestination) {
                case "Report Helper":
                    $scope.helperPage = "helperDrawerMain";
                    updateVariables(newDestination);
                    break;
                case "Argument Schemes":
                    $scope.helperPage = "helperDrawerArgumentSchemes";
                    updateVariables(newDestination);
                    break;
                case "Claims and Evidence":
                    $scope.helperPage = "helperDrawerClaimsAndEvidence";
                    updateVariables(newDestination);
                    break;
                case "Critical Questions":
                    $scope.helperPage = "helperDrawerCriticalQuestions";
                    updateVariables(newDestination);
                    break;
                case "Backing":
                    $scope.helperPage = "helperDrawerBacking";
                    updateVariables(newDestination);
                    break;
            }
        });

        var updateVariables = function(newLocation) {
            $scope.selectedTitleWithoutSpaces = $scope.selectedTitle = newLocation;
            $scope.selectedTitleWithoutSpaces = $scope.selectedTitleWithoutSpaces.replace(/\s/g, '');
        };
    })
    .controller('helperCtrl', function($scope, $location, $anchorScroll) {
        $scope.ids = Array.apply(null, {length: 12}).map(function(callback, index) {
            return "id" + $scope.selectedTitleWithoutSpaces + index;
        });

        $scope.changeSection = function(newOption) {
            $scope.$emit('CHANGE_PAGE', newOption);
        };

        $scope.gotoLocation = function(locationId) {
            $anchorScroll(locationId);
        };
    });
