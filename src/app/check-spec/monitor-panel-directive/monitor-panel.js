angular.module('playfully.checkSpec')
.directive(
    'glMonitorPanel',
    [
        function () {
            return {
                restrict: 'A',
                scope: {},
                replace: true,
                templateUrl: 'check-spec/monitor-panel-directive/monitor-panel.html',
                controller: [
                    '$scope',
                    function ($scope) {
                        /**
                         Property houses settings property.

                         @property settings
                         @type Array
                         **/
                        $scope.settings = [];

                        /**
                         Property houses title property.

                         @property title
                         @type String
                         **/
                        $scope.title = undefined;

                        /**
                         Method sets title on controller scope.

                         @method setTitle
                         @param {String} title Panel title
                         **/
                        this.setTitle = function (title) {
                            $scope.title = title;
                        };

                        /**
                         Method pushes setting object to settings
                         array on the controller scope.

                         @method addSettings
                         @param {Array} settings Collection of setting objects
                         **/
                        this.addSettings = function (settings) {
                            $scope.settings = settings;
                        };

                        /**
                         Method pushes setting object to settings
                         array on the controller scope.

                         @method addSetting
                         @param {Object} setting Setting object
                         **/
                        this.addSetting = function (setting) {
                            angular.forEach($scope.settings, function (obj, idx) {
                                if (setting.description === obj.description) {
                                    $scope.settings[idx] = angular.extend({}, obj, setting);
                                }
                            }, $scope);
                        };

                        /**
                         Method executes initialization process.

                         @method initialize
                         **/
                        function initialize() {
                            $scope.title = 'Default Title';
                        }

                        // Entry point for the controller.
                        initialize();
                    }
                ],
                link: function (scope, element, attrs) {}
            };
        }
    ]
);