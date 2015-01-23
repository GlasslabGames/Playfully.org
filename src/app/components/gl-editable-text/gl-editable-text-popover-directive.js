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
                // sets default option as inputted option in array
                if (scope.glEditableType ==='dropdown') {
                    var index = scope.glEditableOptions.indexOf(scope.glEditableTextPopover);
                    scope.edit.content = scope.glEditableOptions[index];
                } else {
                    scope.edit.content = scope.glEditableTextPopover;
                }
                scope.hideMe = true;
                scope.editContent = function () {
                    scope.hideMe = false;
                };
                scope.glEditTrigger = function () {
                    scope.hideMe = false;
                };
                scope.goBackContent = function () {
                    scope.edit.content = scope.glEditableTextPopover;
                    scope.hideMe = !scope.hideMe;
                };
                scope.saveContent = function () {
                    var defer = $q.defer();
                    // saves original text in case save fails
                    var originalText = scope.glEditableTextPopover;
                    // change content to text within text field
                    if (originalText !== scope.edit.content) {
                        scope.glEditableTextPopover = scope.edit.content;
                        $timeout(function () {
                            // complete task if request fulfilled. timeout gives time to digest new value
                            scope.glOnBeforeSave().then(function (result) {
                                scope.hideMe = !scope.hideMe;
                                defer.resolve(result);
                            }, function () {
                                scope.glEditableText = originalText;
                                defer.reject();
                            });
                        }, 10);
                    }
                    return defer.promise;
                };
            }
        };
    });

