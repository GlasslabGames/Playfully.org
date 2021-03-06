angular.module( 'instructor.reports')
    .directive('drkHelperSubMenu', function () {
        return {
            restrict: 'A',
            template: '<div class="drk-helper-jump-nav">' +
                          '<button type="button" ng-click="gotoLocation(ids[0])">' +
                               '<span class="emphasis">I. Focus on the learning goals for this skill</span>' +
                          '</button>' +
                      '</div>' +
                      '<div class="drk-helper-jump-nav">' +
                          '<button type="button" ng-click="gotoLocation(ids[1])">' +
                              '<span class="emphasis">II. Check on student progress with this skill</span>' +
                          '</button>' +
                      '</div>' +
                      '<div class="drk-helper-jump-nav">' +
                          '<button type="button" ng-click="gotoLocation(ids[3])">' +
                              '<span class="emphasis">Instruction Plan</span>' +
                          '</button>' +
                      '</div>'
        };
    })
    .directive('stickyMenu', function($document) { // Starting inspiration from https://css-tricks.com/scroll-fix-content/
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                $document.unbind('scroll');

                $document.bind("scroll", function(event) {
                    if ($document.scrollTop() > 152) {
                        element.addClass("fixed");
                    } else {
                        element.removeClass("fixed");
                    }
                });
            }
        };
    })
    .controller('helperWrapperCtrl', function($scope, $timeout, $interval, $anchorScroll, $state, $stateParams, Drk12Service) {
        ////////////////////// Initialization /////////////////////////

        $scope.courseId = $stateParams.courseId;
        $scope.gameId = $stateParams.gameId;
        $scope.selectedSkill = $stateParams.location;
        $scope.selectedAnchor = $stateParams.anchor;

        $scope.ids = [
            "id" + $scope.selectedSkill + 0,
            "id" + $scope.selectedSkill + 1,
            "id" + $scope.selectedSkill + 2,
            "id" + $scope.selectedSkill + 3
        ];

        $scope.helperPage = "";
        $scope.skills = [
            'connectingEvidence',
            'supportingClaims',
            'criticalQuestions',
            'usingBacking'
        ];
        $scope.isClassViewActive = null;

        //// Date stuff

        $scope.placeholderDate = new Date();
        $scope.placeholderDate.setHours(0,0,0,0);

        $scope.dateOptions = {
            formatYear: 'yy'
        };

        $scope.format = 'yyyy-MM-dd';

        var retrieveInstructionPlans = function() {
            Drk12Service.getInstructionPlans( $stateParams.courseId, $stateParams.gameId, $stateParams.location ).then(function(result) {
                $scope.instructionPlans = result.data;
            });
        };

        retrieveInstructionPlans();

        ///////////////////////////////////////////////////////////////

        var locationToSubPageFilename = function(location) {
            var returnString = "helperDrawerArgumentSchemes";

            switch (location) {
                case "connectingEvidence":
                    returnString = "helperDrawerArgumentSchemes";
                    break;
                case "supportingClaims":
                    returnString = "helperDrawerClaimsAndEvidence";
                    break;
                case "criticalQuestions":
                    returnString = "helperDrawerCriticalQuestions";
                    break;
                case "usingBacking":
                    returnString = "helperDrawerBacking";
                    break;
                default:
                    alert('Given an invalid skill. Defaulting to Connecting Evidence / Argument Schemes');
            }

            return returnString;
        };

        $scope.helperPage = locationToSubPageFilename($stateParams.location);

        var anchorToId = function(anchorString) {
            var returnString = "";
            switch (anchorString) {
                case "drilldown":
                    returnString = "id" + $scope.selectedSkill + "8"; // TODO: Make this less "magical"
                    break;
                default:
                    console.error("Was not able to find an id for the anchor " + anchorString);
            }

            return returnString;
        };

        $scope.gotoLocation = function(locationId) {
            var interval = $interval(function() {
                if (jQuery("#" + locationId).length > 0) {
                    $anchorScroll(locationId);
                    $interval.cancel(interval);
                }
            }, 2);
        };

        $scope.openInstructionPlanView = function(planId) {
            var url = "";
            if (planId) {
                url = $state.href('root.cleanChrome.drk12InstructionPlan', {gameId: $scope.gameId, courseId: $scope.courseId, location: $scope.selectedSkill, noteId: planId});
            } else {
                url = $state.href('root.cleanChrome.drk12InstructionPlan', {gameId: $scope.gameId, courseId: $scope.courseId, location: $scope.selectedSkill});
            }
            window.open(url, '_instPlan');
        };

        window.instructionPlanSaved = function() {
            retrieveInstructionPlans();
        };

        $timeout(function() { // make sure the page is loaded before doing this
            if ($scope.selectedAnchor) {
                $anchorScroll(anchorToId($scope.selectedAnchor));
            }
        });
    });
