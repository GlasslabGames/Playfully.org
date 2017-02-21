angular.module( 'instructor.reports')
    // This controller is always assumed to be within the scope of the modal created in the config
    .controller('helperCtrl', function($scope) {
        $scope.topLevelOptions = ["Argument Schemes", "Claims and Evidence", "Critical Questions", "Backing"];
        $scope.selectedTitle = "Report Helper";
    });
