angular.module('gl-editable-text-popover', [])
    .directive('glEditableTextPopover', function ($compile, $q, $timeout) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                glEditableType: '=',
                glEditableTextPopover: '=',
                glEditableOptions: '=',
                glOnBeforeSave: '=',
                glEditTrigger: '='
            },
            templateUrl: "components/gl-editable-text/gl-editable-text-popover-template.html",
            link: function (scope, element, attr) {
                scope.edit = {};
                if (scope.glEditableType ==='dropdown') {
                    // sets default option as inputted option in array
                    var index = scope.glEditableOptions.indexOf(scope.glEditableTextPopover);
                    scope.edit.content = scope.glEditableOptions[index];
                } else {
                    // sets textarea content as current text
                    scope.edit.content = scope.glEditableTextPopover;
                }
                scope.hideEdit = true;
                scope.editContent = function () {
                    scope.hideEdit = false;
                };
                scope.glEditTrigger = function () {
                    scope.hideEdit = !scope.hideEdit;
                };
                scope.goBackContent = function () {
                    scope.edit.content = scope.glEditableTextPopover;
                    scope.hideEdit = !scope.hideEdit;
                };
                scope.saveContent = function () {
                    var defer = $q.defer();
                    // saves original text in case save fails
                    var originalText = scope.glEditableTextPopover;
                    scope.glEditableTextPopover = scope.edit.content;

                    if (scope.glEditableTextPopover === originalText) {
                        scope.hideEdit = !scope.hideEdit;
                        return;
                    }
                    // change content to text within text field

                    $timeout(function () {
                        // complete task if request fulfilled. timeout gives parent scope time to digest new glEditableTextPopover value
                        if (!scope.glOnBeforeSave) {
                            scope.hideEdit = !scope.hideEdit;
                            defer.resolve();
                        } else {
                            scope.glOnBeforeSave().then(function (result) {
                                scope.hideEdit = !scope.hideEdit;
                                defer.resolve(result);
                            }, function () {
                                scope.glEditableTextPopover = originalText;
                                defer.reject();
                            });
                        }
                    }, 10);
                    return defer.promise;
                };
            }
        };
    });

