(function (window, angular) {
    'use strict';


    angular.module('gl-angular-json-editor', []).provider('JSONEditor', function () {
        var configuration = {
            defaults: {
                options: {
                    iconlib: 'fontawesome4',
                    theme: 'bootstrap3',
                    ajax: true
                }
            }
        };

        this.configure = function (options) {
            extendDeep(configuration, options);
        };

        this.$get = ['$window', function ($window) {
            // configure JSONEditor using provider's configuration
            var JSONEditor = $window.JSONEditor;
            extendDeep(JSONEditor, configuration);
            return $window.JSONEditor;
        }];

        // Helper method for merging configuration objects
        function extendDeep(dst) {
            angular.forEach(arguments, function (obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function (value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extendDeep(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        }

    }).directive('jsonEditor', ['$q', 'JSONEditor', function ($q, JSONEditor) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                schema: '=',
                startval: '=',
                buttonsController: '@',
                onChange: '&',
                extraOptions: '='
            },
            controller: ['$scope', '$attrs', '$controller', function ($scope, $attrs, $controller) {
                var controller, controllerScope, controllerName = $attrs.buttonsController;
                if (!(angular.isString(controllerName) && controllerName !== '')) {
                    return;
                }

                controllerScope = {
                    $scope: $scope
                };

                try {
                    controller = $controller(controllerName, controllerScope);
                } catch (e) {
                    // Any exceptions thrown will probably be because the controller specified does not exist
                    throw new Error('angular-json-editor: buttons-controller attribute must be a valid controller.');
                }
            }],
            link: function (scope, element, attrs, controller, transclude) {
                var startValPromise = $q.when({}),
                    schemaPromise = $q.when(null);

                scope.isValid = false;

                if (!angular.isString(attrs.schema)) {
                    throw new Error('angular-json-editor: schema attribute has to be defined.');
                }
                if (angular.isObject(scope.schema)) {
                    schemaPromise = $q.when(scope.schema);
                }
                if (angular.isObject(scope.startval)) {
                    // Support both $http (i.e. $q) and $resource promises, and also normal object.
                    startValPromise = $q.when(scope.startval);
                }

                // Wait for the start value and schema to resolve before building the editor.
                $q.all([schemaPromise, startValPromise]).then(function (result) {

                    // Support $http promise response with the 'data' property.
                    var schema = result[0].data || result[0],
                        startVal = result[1].data || result[1];
                    if (schema === null) {
                        throw new Error('angular-json-editor: could not resolve schema data.');
                    }

                    function restart() {
                        var values = startVal;
                        if (scope.editor && scope.editor.destroy) {
                            values = scope.editor.getValue();
                            scope.editor.destroy();
                        }

                        var options = {
                            startval: values,
                            schema: schema,
                        };
                        angular.forEach(scope.extraOptions, function (obj, key) {
                            options[key] = obj;
                        });

                        scope.editor = new JSONEditor(element[0], options, true);

                        scope.editor.on('ready', editorReady);
                        scope.editor.on('change', editorChange);
                        element.append(buttons);
                    }

                    function editorReady() {
                        scope.isValid = (scope.editor.validate().length === 0);
                    }

                    function editorChange() {
                        // Fire the onChange callback
                        if (typeof scope.onChange === 'function') {
                            scope.onChange({
                                $editorValue: scope.editor.getValue()
                            });
                        }
                        // reset isValid property onChange
                        scope.$apply(function () {
                            scope.isValid = (scope.editor.validate().length === 0);
                        });
                    }

                    restart(startVal, schema);

                    scope.$watch('schema', function (newVal, oldVal) {
                        //update newScheme
                        if (newVal.success) {
                            newVal.success(function (data) {
                                schema = data;
                            });
                        } else {
                            schema = newVal;
                        }

                        restart();
                    }, true);

                    // Transclude the buttons at the bottom.
                    var buttons = transclude(scope, function (clone) {
                        return clone;
                    });

                    element.append(buttons);
                });
            }
        };
    }]);

})(window, angular);