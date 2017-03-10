angular.module( 'instructor.reports')
    .controller('helperWrapperCtrl', function($scope, $anchorScroll, drk12_bStore) {
        $scope.helperPage = "helperDrawerMain";
        $scope.data = {
            connectingEvidence: "Argument Schemes",
            supportingClaims: "Claims and Evidence",
            criticalQuestions: "Critical Questions",
            usingBacking: "Backing"
        };
        $scope.selectedPage = "reportHelper";
        $scope.isClassViewActive = null;

        /*
         Ideally the reportHelper html element would be a direct child of the body tag. Since this isn't possible
         We do this craziness to help create that illusion
        */
        jQuery("body").addClass("gl-drk12_b-l-hasHelperMenu");

        var updateLocation = function(newDestination, callback) {
            switch (newDestination) {
                case "reportHelper":
                    $scope.helperPage = "helperDrawerMain";
                    updateVariables(newDestination);
                    break;
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

        $scope.$on("FOOTERHELPER_CLICKED", function(event, isClassViewActive) {
            var newDestination = "";
            var newSubDestination = "";

            if (isClassViewActive !== null) {
                $scope.isClassViewActive = isClassViewActive;
            }

            if (isClassViewActive) {
                newDestination = "reportHelper";
            }  else if (drk12_bStore.getSelectedMission()) {
                newDestination = drk12_bStore.getSelectedSkill();
                newSubDestination = "id" + $scope.selectedPage + "8"; // TODO: Make this less "magical"
            } else if (drk12_bStore.getCurrentStudents().length >  1) {
                newDestination = drk12_bStore.getSelectedSkill();
                newSubDestination = "id" + $scope.selectedPage + "7"; // TODO: Make this less "magical"
            } else {
                if ($scope.tableStructuralData.columnFilter === "all" || drk12_bStore.getSelectedStudent()) {
                    newDestination = "reportHelper";
                } else {
                    newDestination = drk12_bStore.getSelectedSkill();
                }
            }

            /*
             Ideally the reportHelper html element would be a direct child of the body tag. Since this isn't possible
             We do this craziness to help create that illusion
             */
            if (jQuery('body.gl-drk12_b-l-hasHelperMenu-is-open').length > 0) {
                jQuery("body").removeClass("gl-drk12_b-l-hasHelperMenu-is-open");
            } else {
                jQuery("body").addClass("gl-drk12_b-l-hasHelperMenu-is-open");
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
            $anchorScroll(locationId);
        };

        $scope.$on('$destroy', function(event) {
            var $body = jQuery("body");
            $body.removeClass("gl-drk12_b-l-hasHelperMenu");
            $body.removeClass("gl-drk12_b-l-hasHelperMenu-is-open");
        });
    })
    .controller('helperCtrl', function($scope) {
        $scope.ids = Array.apply(null, {length: 12}).map(function(callback, index) {
            return "id" + $scope.selectedPage + index;
        });

        $scope.changeSection = function(newOption) {
            $scope.$emit('CHANGE_PAGE', newOption);
        };
    });
