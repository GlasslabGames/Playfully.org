angular.module( 'instructor.reports')
    .controller('helperWrapperCtrl', function($scope, $timeout, $interval, $anchorScroll, $state, $stateParams) {
        ////////////////////// Initialization /////////////////////////

        $scope.selectedPage = $stateParams.location;
        $scope.selectedAnchor = $stateParams.anchor;

        $scope.helperPage = "helperDrawerArgumentSchemes";
        $scope.data = {
            connectingEvidence: "Argument Schemes",
            supportingClaims: "Claims and Evidence",
            criticalQuestions: "Critical Questions",
            usingBacking: "Backing"
        };
        $scope.isClassViewActive = null;

        //// Date stuff

        $scope.placeholderDate = new Date();
        $scope.placeholderDate.setHours(0,0,0,0);

        $scope.dateOptions = {
            formatYear: 'yy'
        };

        $scope.format = 'yyyy-MM-dd';

        ///////////////////////////////////////////////////////////////

        var updateLocation = function(newDestination, callback) {
            switch (newDestination) {
                case "connectingEvidence":
                    $scope.helperPage = "helperDrawerArgumentSchemes";
                    updateVariables(newDestination);
                    break;
                case "supportingClaims":
                    $scope.helperPage = "helperDrawerClaimsAndEvidence";
                    updateVariables(newDestination);
                    break;
                case "criticalQuestions":
                    $scope.helperPage = "helperDrawerCriticalQuestions";
                    updateVariables(newDestination);
                    break;
                case "usingBacking":
                    $scope.helperPage = "helperDrawerBacking";
                    updateVariables(newDestination);
                    break;
            }
            if (callback) {
                callback();
            }
        };

        $scope.$on("FOOTERHELPER_CLICKED", function(event, isClassViewActive, selectedSkill) {
            var newDestination = "";
            var newSubDestination = "";

            if ($state.current.name === "root.reports.details.drk12_b") {
                if (isClassViewActive !== null) {
                    $scope.isClassViewActive = isClassViewActive;
                }

                if (isClassViewActive) {
                    newDestination = "reportHelper";
                } else {
                    newDestination = selectedSkill;
                }
            } else if ($state.current.name === "root.reports.details.drk12_b_drilldown") {
                newDestination = selectedSkill;
                updateVariables(newDestination); // TODO: See about working this redundancy
                newSubDestination = "id" + $scope.selectedPage + "8"; // TODO: Make this less "magical"
            } else {
                console.error("Footer opened from unexpected page. This will surely go badly.");
            }

            updateLocation(newDestination, function(){ $scope.gotoLocation(newSubDestination); });
        });

        $scope.$on('CHANGE_PAGE', function(event, newDestination) {
            updateLocation(newDestination);
        });

        var updateVariables = function(newLocation) {
            $scope.selectedPage = newLocation;
        };

        $scope.gotoLocation = function(locationId) {
            var interval = $interval(function() {
                if (jQuery("#" + locationId).length > 0) {
                    $anchorScroll(locationId);
                    $interval.cancel(interval);
                }
            }, 2);
        };

        var anchorToId = function(anchorString) {
            var returnString = "";
            switch (anchorString) {
                case "drilldown":
                    returnString = "id" + $scope.selectedPage + "8"; // TODO: Make this less "magical"
                    break;
                default:
                    console.error("Was not able to find an id for the anchor " + anchorString);
            }

            return returnString;
        };

        $timeout(function() { // make sure the page is loaded before doing this
            if ($scope.selectedAnchor) {
                $anchorScroll(anchorToId($scope.selectedAnchor));
            }
        });
    })
    .controller('helperCtrl', function($scope) {
        $scope.ids = Array.apply(null, {length: 12}).map(function(callback, index) {
            return "id" + $scope.selectedPage + index;
        });

        $scope.changeSection = function(newOption) {
            $scope.$emit('CHANGE_PAGE', newOption);
        };

        $scope.dateOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpened = true;
        };
    });
