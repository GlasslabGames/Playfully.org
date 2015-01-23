angular.module('gl-editable-text', [])
.directive('glEditableText', function($compile,$q,$timeout) {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      glEditableText:'=',
      glOnBeforeSave:'=',
      glEditTrigger:'='
    },
    templateUrl: "components/gl-editable-text/gl-editable-text-template.html",
    link: function(scope, element, attr) {
      scope.edit = {};
      // sets text area content
      scope.edit.content = scope.glEditableText;
      scope.hideMe = true;
      scope.editContent = function () {
        scope.hideMe = false;
      };
      scope.glEditTrigger = function () {
        scope.hideMe = false;
      };
      scope.goBackContent = function () {
        scope.edit.content = scope.glEditableText;
        scope.hideMe = !scope.hideMe;
      };
      scope.saveContent = function() {
        var defer = $q.defer();
        // saves original text in case save fails
        var originalText = scope.glEditableText;
        // change content to text within text field
        if (originalText !== scope.edit.content) {
          scope.glEditableText = scope.edit.content;
          $timeout(function() {
            // complete task if request fulfilled. timeout gives time to digest new value
            scope.glOnBeforeSave().then(function (result) {
                scope.hideMe = !scope.hideMe;
                defer.resolve(result);
            }, function () {
                scope.glEditableText = originalText;
                defer.reject();});
          }, 10);
        }
        return defer.promise;
      };
    }
  };
});

